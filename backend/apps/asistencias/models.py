from django.db import models

from apps.socios.models import Socio
from apps.accounts.models import Usuario


# Create your models here.
class Asistencia(models.Model):
    id_asistencia = models.BigAutoField(primary_key=True)
    socio = models.ForeignKey(Socio,on_delete=models.PROTECT,db_column="id_socio")
    usuario = models.ForeignKey(Usuario,on_delete=models.PROTECT,db_column="id_usuario")
    fecha_hora_ingreso = models.DateTimeField()

    class Meta:
        db_table = "asistencias"

    def __str__(self):
        return f"Socio: {self.socio.nombres} | Ingreso: {self.fecha_hora_ingreso}"