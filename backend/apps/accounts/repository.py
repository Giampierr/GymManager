from apps.accounts.models import Usuario,Rol,Permiso,RolPermiso

class UsuarioRepository:

    @staticmethod
    def obtener_por_id(id_usuario: int) -> Usuario | None:
        return Usuario.objects.filter(
            id_usuario=id_usuario
        ).first()

    @staticmethod
    def obtener_por_correo(correo: str) -> Usuario | None:
        return Usuario.objects.filter(
            correo=correo
        ).first()

    @staticmethod
    def existe_correo(correo: str, excluir_id: int | None = None) -> bool:
        consulta = Usuario.objects.filter(correo=correo)

        if excluir_id is not None:
            consulta = consulta.exclude(id_usuario=excluir_id)

        return consulta.exists()

    @staticmethod
    def listar_todos():
        return Usuario.objects.select_related("rol").all().order_by("id_usuario")

    @staticmethod
    def guardar(usuario: Usuario) -> Usuario:
        usuario.save()
        return usuario

    @staticmethod
    def eliminar(usuario: Usuario) -> None:
        usuario.delete()


class RolRepository:

    @staticmethod
    def obtener_por_id(id_rol: int) -> Rol | None:
        return Rol.objects.filter(
            id_rol=id_rol
        ).first()

    @staticmethod
    def obtener_por_nombre(nombre: str) -> Rol | None:
        return Rol.objects.filter(
            nombre=nombre
        ).first()

    @staticmethod
    def listar_todos():
        return Rol.objects.all()

    @staticmethod
    def guardar(rol: Rol) -> Rol:
        rol.save()
        return rol

    @staticmethod
    def eliminar(rol: Rol) -> None:
        rol.delete()


class PermisoRepository:

    @staticmethod
    def obtener_por_id(id_permiso: int) -> Permiso | None:
        return Permiso.objects.filter(
            id_permiso=id_permiso
        ).first()
    
    @staticmethod
    def obtener_por_nombre(nombre: str) -> Permiso | None:
        return Permiso.objects.filter(
            nombre=nombre
        ).first()
    
    @staticmethod
    def listar_todos():
        return Permiso.objects.all()
    
    @staticmethod
    def guardar(permiso: Permiso) -> Permiso:
        permiso.save()
        return permiso
    
    @staticmethod
    def eliminar(permiso: Permiso) -> None:
        permiso.delete()


class RolPermisoRepository:

    @staticmethod
    def listar_por_rol(rol: Rol):
        return RolPermiso.objects.filter(
            rol=rol
        ).select_related("permiso")

    @staticmethod
    def listar_por_permiso(permiso: Permiso):
        return RolPermiso.objects.filter(
            permiso=permiso
        ).select_related("rol")

    @staticmethod
    def asignar(rol: Rol, permiso: Permiso) -> RolPermiso:
        relacion, creado = RolPermiso.objects.get_or_create(
            rol=rol,
            permiso=permiso
        )
        return relacion

    @staticmethod
    def retirar(rol: Rol, permiso: Permiso) -> None:
        RolPermiso.objects.filter(
            rol=rol,
            permiso=permiso
        ).delete()