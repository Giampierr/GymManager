
from django.db import models

from apps.accounts.models import Usuario


class Auditoria(models.Model):
    id_auditoria = models.BigAutoField(primary_key=True)

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        db_column="id_usuario"
    )

    accion = models.CharField(max_length=100)
    descripcion = models.TextField()
    fecha_hora = models.DateTimeField()
    direccion_ip = models.CharField(max_length=45)

    class Meta:
        db_table = "auditoria"

    def __str__(self):
        return f"Acción: {self.accion} - Usuario: {self.usuario.correo}"


class IntentoAcceso(models.Model):
    id_intento = models.BigAutoField(primary_key=True)

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.SET_NULL,
        db_column="id_usuario",
        null=True,
        blank=True
    )

    correo_ingresado = models.EmailField(max_length=100)
    fecha_hora = models.DateTimeField()
    resultado = models.CharField(max_length=20)
    direccion_ip = models.CharField(max_length=45)

    class Meta:
        db_table = "intentos_acceso"

    def __str__(self):
        return f"Correo: {self.correo_ingresado} - Resultado: {self.resultado}"
