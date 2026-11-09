from django.db import models
from common.enums import Estado
from common.validators import Validador


class Socio(models.Model):
    id_socio = models.BigAutoField(primary_key=True)
    codigo_socio = models.CharField(max_length=100, unique=True)
    dni = models.CharField(
        max_length=8,
        unique=True,
        validators=[Validador.validador_dni]
    )
    nombres = models.CharField(max_length=50)
    apellidos = models.CharField(max_length=50)
    fecha_nacimiento = models.DateField()
    telefono = models.CharField(
        max_length=9,
        validators=[Validador.validar_telefono]
    )
    correo = models.EmailField(max_length=100, unique=True)
    direccion = models.TextField(max_length=255)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    estado = models.CharField(
        max_length=10,
        choices=Estado.choices,
        default=Estado.ACTIVO
    )
    observaciones = models.TextField(max_length=255,blank=True,default="")

    class Meta:
        db_table = "socios"

    def __str__(self):
        return f"Nombre: {self.nombres} Código: {self.codigo_socio} Estado: {self.estado}"