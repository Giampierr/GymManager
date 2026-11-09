from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import (
    SocioFiltroSerializer,
    SocioRespuestaSerializer,
    SocioCrearSerializer,SocioActualizarSerializer
)

from .services import SocioService
from .dtos import SocioCrearDTO,SocioActualizarDTO
from common.enums import ResultadoSocio


class SocioListCreateView(APIView):

    def get(self, request):

        serializer = SocioFiltroSerializer(
            data=request.query_params
        )

        if not serializer.is_valid():
            return Response(
                {
                    "mensaje": "Filtros inválidos",
                    "errores": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        filtros = serializer.validated_data

        resultado = SocioService.buscar_socios(**filtros)

        socios_serializer = SocioRespuestaSerializer(
            instance=resultado.datos,
            many=True
        )

        return Response(
            {
                "codigo": resultado.codigo.value,
                "mensaje": resultado.mensaje,
                "total": len(resultado.datos),
                "socios": socios_serializer.data
            },
            status=status.HTTP_200_OK
        )

class SocioListCreateView(APIView):

    # LISTAR Y BUSCAR
    def get(self, request):

        serializer = SocioFiltroSerializer(
            data=request.query_params
        )

        if not serializer.is_valid():
            return Response(
                {
                    "mensaje": "Filtros inválidos",
                    "errores": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        filtros = serializer.validated_data

        resultado = SocioService.buscar_socios(**filtros)

        socios_serializer = SocioRespuestaSerializer(
            instance=resultado.datos,
            many=True
        )

        return Response(
            {
                "codigo": resultado.codigo.value,
                "mensaje": resultado.mensaje,
                "total": len(resultado.datos),
                "socios": socios_serializer.data
            },
            status=status.HTTP_200_OK
        )

    # REGISTRAR SOCIO
    def post(self, request):

        serializer = SocioCrearSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "mensaje": "Datos inválidos",
                    "errores": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        datos = serializer.validated_data

        socio_dto = SocioCrearDTO(
            dni=datos["dni"],
            nombres=datos["nombres"],
            apellidos=datos["apellidos"],
            fecha_nacimiento=datos["fecha_nacimiento"],
            telefono=datos["telefono"],
            correo=datos["correo"],
            direccion=datos["direccion"],
            observaciones=datos["observaciones"]
        )

        resultado = SocioService.registrar_socio(socio_dto)

        if resultado.codigo == ResultadoSocio.SOCIO_CREADO:

            socio = resultado.datos

            respuesta = SocioRespuestaSerializer(socio)

            return Response(
                {
                    "codigo": resultado.codigo.value,
                    "mensaje": resultado.mensaje,
                    "socio": respuesta.data
                },
                status=status.HTTP_201_CREATED
            )

        if resultado.codigo == ResultadoSocio.DATOS_INVALIDOS:
            return Response(
                {
                    "codigo": resultado.codigo.value,
                    "mensaje": resultado.mensaje,
                    "errores": resultado.datos
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {
                "codigo": resultado.codigo.value,
                "mensaje": resultado.mensaje
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class SocioActualizarView(APIView):

    def patch(self, request, id_socio):

        serializer = SocioActualizarSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {
                    "mensaje": "Datos inválidos",
                    "errores": serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        datos = serializer.validated_data

        dto = SocioActualizarDTO(
            dni=datos.get("dni"),
            nombres=datos.get("nombres"),
            apellidos=datos.get("apellidos"),
            fecha_nacimiento=datos.get("fecha_nacimiento"),
            telefono=datos.get("telefono"),
            correo=datos.get("correo"),
            direccion=datos.get("direccion"),
            observaciones=datos.get("observaciones")
        )

        resultado = SocioService.actualizar_socio(id_socio, dto)

        if resultado.codigo == ResultadoSocio.SOCIO_NO_ENCONTRADO:
            return Response(
                {
                    "codigo": resultado.codigo.value,
                    "mensaje": resultado.mensaje
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if resultado.codigo != ResultadoSocio.SOCIO_ACTUALIZADO:
            return Response(
                {
                    "codigo": resultado.codigo.value,
                    "mensaje": resultado.mensaje,
                    "errores": resultado.datos
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        respuesta = SocioRespuestaSerializer(resultado.datos)

        return Response(
            {
                "codigo": resultado.codigo.value,
                "mensaje": resultado.mensaje,
                "socio": respuesta.data
            },
            status=status.HTTP_200_OK
        )