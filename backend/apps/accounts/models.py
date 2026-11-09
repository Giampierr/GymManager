from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.base_user import BaseUserManager

from common.enums import Estado,Roles

# ==========================
# MODELO ROL
# ==========================

class Rol(models.Model):

    id_rol = models.BigAutoField(primary_key=True)

    nombre = models.CharField(
        max_length=15,
        unique=True,
        choices=Roles.choices
    )

    descripcion = models.CharField(max_length=255)

    # Relación N:M utilizando nuestra tabla intermedia.
    permisos = models.ManyToManyField(
        "Permiso",
        through="RolPermiso",
        related_name="roles"
    )

    class Meta:
        db_table = "rol"

    def __str__(self):
        return self.nombre


# ==========================
# MODELO PERMISO
# ==========================

class Permiso(models.Model):

    id_permiso = models.BigAutoField(primary_key=True)

    modulo = models.CharField(max_length=50)

    accion = models.CharField(max_length=20)

    descripcion = models.CharField(max_length=255)

    class Meta:
        db_table = "permiso"
        constraints = [
            models.UniqueConstraint(
                fields=["modulo", "accion"],
                name="uq_permiso_modulo_accion"
            )
        ]

    def __str__(self):
        return f"{self.modulo} - {self.accion}"


# ==========================
# MODELO ROL PERMISO
# ==========================

class RolPermiso(models.Model):

    # Clave primaria compuesta.
    pk = models.CompositePrimaryKey(
        "rol_id",
        "permiso_id"
    )

    rol = models.ForeignKey(
        Rol,
        on_delete=models.CASCADE,
        db_column="id_rol",
        related_name="rol_permisos"
    )

    permiso = models.ForeignKey(
        Permiso,
        on_delete=models.CASCADE,
        db_column="id_permiso",
        related_name="rol_permisos"
    )

    class Meta:
        db_table = "rol_permisos"

    def __str__(self):
        return f"{self.rol} - {self.permiso}"



# ==========================
# ADMINISTRADOR DE USUARIO
# ==========================

class UsuarioManager(BaseUserManager):

    def create_user(self, correo, password=None, **extra_fields):

        if not correo:
            raise ValueError("El correo es obligatorio")

        if not password:
            raise ValueError("La contraseña es obligatoria")

        correo = self.normalize_email(correo)

        usuario = self.model(
            correo=correo,
            **extra_fields
        )

        usuario.set_password(password)

        usuario.save(using=self._db)

        return usuario


# ==========================
# MODELO USUARIO
# ==========================

class Usuario(AbstractBaseUser):

    id_usuario = models.BigAutoField(primary_key=True)

    rol = models.ForeignKey(
        Rol,
        on_delete=models.PROTECT,
        db_column="id_rol",
        related_name="usuarios"
    )

    nombres = models.CharField(max_length=100)

    apellidos = models.CharField(max_length=100)

    correo = models.EmailField(
        max_length=100,
        unique=True
    )

    password = models.CharField(
        max_length=128,
        db_column="password_hash"
    )

    estado = models.CharField(
        max_length=10,
        choices=Estado.choices,
        default=Estado.ACTIVO
    )

    fecha_creacion = models.DateTimeField(
        auto_now_add=True
    )

    objects = UsuarioManager()

    USERNAME_FIELD = "correo"

    REQUIRED_FIELDS = ["nombres", "apellidos", "rol"]

    @property
    def is_active(self):
        return self.estado == Estado.ACTIVO

    class Meta:
        db_table = "usuarios"

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"