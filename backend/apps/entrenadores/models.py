from django.db import models

from common.validators import Validador
from common.enums import Especialidad,Estado
# Create your models here.

class Entrenador(models.Model):
    id_entrenador = models.BigAutoField(primary_key=True)
    dni = models.CharField(max_length=8,unique=True,validators=[Validador.validador_dni])
    nombres = models.CharField(max_length=50)
    apellidos = models.CharField(max_length=50)
    telefono = models.CharField(max_length=9,validators=[Validador.validar_telefono])
    correo = models.EmailField(max_length=100,unique=True)
    especialidad = models.CharField(max_length=10,choices=Especialidad.choices)
    fecha_contratacion = models.DateField()
    estado = models.CharField(max_length=10,choices=Estado.choices,default=Estado.ACTIVO)

    class Meta :
        db_table = "entrenadores"

    def __str__(self):
        return f"nombre : {self.nombres} estado : {self.estado} "

