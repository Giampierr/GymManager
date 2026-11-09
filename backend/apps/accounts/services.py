
from .repository import UsuarioRepository, RolRepository
from .models import Usuario
from .dtos import (
    ResultadoServicio,
    UsuarioCrearDTO,
    UsuarioActualizarDTO,
    UsuarioRespuestaDTO
)

from common.enums import (
    CodigoAutenticacion,
    ResultadoBusqueda,
    Estado,
    ResultadoUsuario
)


class AutenticacionService:

    @staticmethod
    def iniciar_sesion(
        correo: str,
        password: str
    ) -> ResultadoServicio:

        usuario = UsuarioRepository.obtener_por_correo(correo)

        if usuario is None:
            return ResultadoServicio(
                CodigoAutenticacion.USUARIO_NO_ENCONTRADO,
                "Credenciales incorrectas"
            )

        if not usuario.check_password(password):
            return ResultadoServicio(
                CodigoAutenticacion.CREDENCIALES_INVALIDAS,
                "Credenciales incorrectas"
            )

        if not usuario.is_active:
            return ResultadoServicio(
                CodigoAutenticacion.USUARIO_INACTIVO,
                "Usuario inactivo"
            )

        return ResultadoServicio(
            CodigoAutenticacion.LOGIN_EXITOSO,
            "Inicio de sesión exitoso",
            usuario
        )


class UsuarioService:

    @staticmethod
    def _convertir_a_dto(usuario: Usuario) -> UsuarioRespuestaDTO:
        return UsuarioRespuestaDTO(
            id_usuario=usuario.id_usuario,
            rol=usuario.rol.nombre,
            nombres=usuario.nombres,
            apellidos=usuario.apellidos,
            correo=usuario.correo,
            estado=usuario.estado
        )

    @staticmethod
    def registrar_usuario(
        datos: UsuarioCrearDTO
    ) -> ResultadoServicio:

        # 1. Comprobar correo duplicado
        if UsuarioRepository.existe_correo(datos.correo):
            return ResultadoServicio(
                ResultadoUsuario.CORREO_DUPLICADO,
                "El correo ya está registrado"
            )

        # 2. Buscar el rol
        rol = RolRepository.obtener_por_id(datos.id_rol)

        if rol is None:
            return ResultadoServicio(
                ResultadoUsuario.ROL_NO_ENCONTRADO,
                "El rol no existe"
            )

        # 3. Crear usuario
        usuario = Usuario(
            rol=rol,
            nombres=datos.nombres,
            apellidos=datos.apellidos,
            correo=datos.correo,
            estado=datos.estado
        )

        # 4. Encriptar contraseña
        usuario.set_password(datos.password)

        # 5. Persistir
        UsuarioRepository.guardar(usuario)

        # 6. Devolver DTO
        return ResultadoServicio(
            ResultadoUsuario.USUARIO_CREADO,
            "Usuario registrado correctamente",
            UsuarioService._convertir_a_dto(usuario)
        )

    
    @staticmethod
    def obtener_usuario(
        id_usuario: int
    ) -> ResultadoServicio:

        usuario = UsuarioRepository.obtener_por_id(id_usuario)

        if usuario is None:
            return ResultadoServicio(
                ResultadoBusqueda.USUARIO_NO_ENCONTRADO,
                "Usuario no encontrado"
            )

        return ResultadoServicio(
            ResultadoBusqueda.USUARIO_ENCONTRADO,
            "Usuario encontrado",
            UsuarioService._convertir_a_dto(usuario)
        )

    @staticmethod
    def listar_usuarios():
        usuarios = UsuarioRepository.listar_todos()

        return [
            UsuarioService._convertir_a_dto(usuario)
            for usuario in usuarios
        ]

    
    @staticmethod
    def actualizar_usuario(
        id_usuario: int,
        datos: UsuarioActualizarDTO
    ) -> ResultadoServicio:

        # 1. Buscar usuario
        usuario = UsuarioRepository.obtener_por_id(id_usuario)

        if usuario is None:
            return ResultadoServicio(
                ResultadoUsuario.USUARIO_NO_ENCONTRADO,
                "Usuario no encontrado"
            )

        # 2. Actualizar rol
        if datos.id_rol is not None:

            rol = RolRepository.obtener_por_id(datos.id_rol)

            if rol is None:
                return ResultadoServicio(
                    ResultadoUsuario.ROL_NO_ENCONTRADO,
                    "El rol no existe"
                )

            usuario.rol = rol

        # 3. Actualizar nombres
        if datos.nombres is not None:
            usuario.nombres = datos.nombres

        # 4. Actualizar apellidos
        if datos.apellidos is not None:
            usuario.apellidos = datos.apellidos

        # 5. Actualizar correo
        if datos.correo is not None:

            if UsuarioRepository.existe_correo(
                datos.correo,
                excluir_id=id_usuario
            ):
                return ResultadoServicio(
                    ResultadoUsuario.CORREO_DUPLICADO,
                    "El correo ya está registrado"
                )

            usuario.correo = datos.correo

        # 6. Actualizar contraseña
        if datos.password is not None:
            usuario.set_password(datos.password)

        # 7. Actualizar estado, si corresponde
        if datos.estado is not None:
            usuario.estado = datos.estado

        # 8. Guardar cambios
        UsuarioRepository.guardar(usuario)

        return ResultadoServicio(
            ResultadoUsuario.USUARIO_ACTUALIZADO,
            "Usuario actualizado correctamente",
            UsuarioService._convertir_a_dto(usuario)
        )

@staticmethod
def cambiar_estado(
        id_usuario: int,
        estado: Estado
    ) -> ResultadoServicio:

        usuario = UsuarioRepository.obtener_por_id(id_usuario)

        if usuario is None:
            return ResultadoServicio(
                ResultadoUsuario.USUARIO_NO_ENCONTRADO,
                "Usuario no encontrado"
            )

        usuario.estado = estado

        UsuarioRepository.guardar(usuario)

        return ResultadoServicio(
            ResultadoUsuario.USUARIO_ACTUALIZADO,
            "Estado actualizado correctamente",
            UsuarioService._convertir_a_dto(usuario)
        )
