from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import LoginSerializer
from .services import AutenticacionService, UsuarioService
from .dtos import UsuarioCrearDTO,UsuarioActualizarDTO
from common.enums import CodigoAutenticacion,ResultadoUsuario,Estado

from .serializers import UsuarioCrearSerializer,UsuarioRespuestaSerializer,UsuarioActualizarSerializer


class LoginView(APIView):

    def post(self, request):

        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "mensaje": "Datos inválidos",
                    "errores": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        correo = serializer.validated_data["correo"]
        password = serializer.validated_data["password"]

        resultado = AutenticacionService.iniciar_sesion(
            correo,
            password
        )

        if resultado.codigo == CodigoAutenticacion.LOGIN_EXITOSO:

            usuario_dto = UsuarioService._convertir_a_dto(
                resultado.datos
            )

            return Response(
                {
                    "codigo": resultado.codigo.value,
                    "mensaje": resultado.mensaje,
                    "usuario": {
                        "id_usuario": usuario_dto.id_usuario,
                        "rol": usuario_dto.rol,
                        "nombres": usuario_dto.nombres,
                        "apellidos": usuario_dto.apellidos,
                        "correo": usuario_dto.correo,
                        "estado": usuario_dto.estado
                    }
                },
                status=status.HTTP_200_OK
            )

        return Response(
            {
                "codigo": resultado.codigo.value,
                "mensaje": resultado.mensaje
            },
            status=status.HTTP_401_UNAUTHORIZED
        )





class UsuarioCrearView(APIView):

    def post(self, request):

        serializer = UsuarioCrearSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "mensaje": "Datos inválidos",
                    "errores": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        datos = serializer.validated_data

        usuario_dto = UsuarioCrearDTO(
            id_rol=datos["id_rol"],
            nombres=datos["nombres"],
            apellidos=datos["apellidos"],
            correo=datos["correo"],
            password=datos["password"]
        )

        resultado = UsuarioService.registrar_usuario(usuario_dto)

        if resultado.codigo == ResultadoUsuario.USUARIO_CREADO:

            usuario = resultado.datos

            return Response(
                {
                    "codigo": resultado.codigo.value,
                    "mensaje": resultado.mensaje,
                    "usuario": {
                        "id_usuario": usuario.id_usuario,
                        "rol": usuario.rol,
                        "nombres": usuario.nombres,
                        "apellidos": usuario.apellidos,
                        "correo": usuario.correo,
                        "estado": usuario.estado
                    }
                },
                status=status.HTTP_201_CREATED
            )

        return Response(
            {
                "codigo": resultado.codigo.value,
                "mensaje": resultado.mensaje
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    def get(self, request):
        usuarios = UsuarioService.listar_usuarios()

        datos = [
            {
                "id_usuario": usuario.id_usuario,
                "rol": usuario.rol,
                "nombres": usuario.nombres,
                "apellidos": usuario.apellidos,
                "correo": usuario.correo,
                "estado": usuario.estado,
            }
            for usuario in usuarios
        ]

        serializer = UsuarioRespuestaSerializer(instance=datos, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class UsuarioActualizarView(APIView):

    def patch(self, request, id_usuario):

        serializer = UsuarioActualizarSerializer(
            data=request.data
        )

        if not serializer.is_valid():
            return Response(
                {
                    "mensaje": "Datos inválidos",
                    "errores": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        datos = serializer.validated_data

        usuario_dto = UsuarioActualizarDTO(
            id_rol=datos.get("id_rol"),
            nombres=datos.get("nombres"),
            apellidos=datos.get("apellidos"),
            correo=datos.get("correo"),
            password=datos.get("password")
        )

        resultado = UsuarioService.actualizar_usuario(
            id_usuario,
            usuario_dto
        )

        if resultado.codigo == ResultadoUsuario.USUARIO_ACTUALIZADO:

            usuario = resultado.datos

            return Response(
                {
                    "codigo": resultado.codigo.value,
                    "mensaje": resultado.mensaje,
                    "usuario": {
                        "id_usuario": usuario.id_usuario,
                        "rol": usuario.rol,
                        "nombres": usuario.nombres,
                        "apellidos": usuario.apellidos,
                        "correo": usuario.correo,
                        "estado": usuario.estado
                    }
                },
                status=status.HTTP_200_OK
            )

        if resultado.codigo == ResultadoUsuario.USUARIO_NO_ENCONTRADO:
            codigo_http = status.HTTP_404_NOT_FOUND
        else:
            codigo_http = status.HTTP_400_BAD_REQUEST

        return Response(
            {
                "codigo": resultado.codigo.value,
                "mensaje": resultado.mensaje
            },
            status=codigo_http
        )

class UsuarioDesactivarView(APIView):

    def patch(self, request, id_usuario):

        resultado = UsuarioService.cambiar_estado(
            id_usuario,
            Estado.INACTIVO
        )

        if resultado.codigo == ResultadoUsuario.USUARIO_ACTUALIZADO:

            usuario = resultado.datos

            return Response(
                {
                    "codigo": resultado.codigo.value,
                    "mensaje": resultado.mensaje,
                    "usuario": {
                        "id_usuario": usuario.id_usuario,
                        "rol": usuario.rol,
                        "nombres": usuario.nombres,
                        "apellidos": usuario.apellidos,
                        "correo": usuario.correo,
                        "estado": usuario.estado
                    }
                },
                status=status.HTTP_200_OK
            )

        return Response(
            {
                "codigo": resultado.codigo.value,
                "mensaje": resultado.mensaje
            },
            status=status.HTTP_404_NOT_FOUND
        )