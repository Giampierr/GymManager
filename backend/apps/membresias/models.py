from django.db import models
from django.core.validators import MinValueValidator

from common.enums import Estado
from apps.socios.models import Socio

class Plan(models.Model):
    id_plan = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=50)

    duracion_meses = models.IntegerField(
        validators=[MinValueValidator(1)]
    )

    precio = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    estado = models.CharField(
        max_length=10,
        choices=Estado.choices,
        default=Estado.ACTIVO
    )

    class Meta:
        db_table = "planes"

    def __str__(self):
        return f"Nombre: {self.nombre} Precio: {self.precio}"

class Membresia(models.Model):
    id_membresia = models.BigAutoField(primary_key=True)

    socio = models.ForeignKey(
        Socio,
        on_delete=models.PROTECT,
        db_column="id_socio"
    )

    plan = models.ForeignKey(
        Plan,
        on_delete=models.PROTECT,
        db_column="id_plan"
    )

    fecha_inicio = models.DateField()
    fecha_vencimiento = models.DateField()

    precio_contratado = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    estado = models.CharField(
        max_length=10,
        choices=Estado.choices,
        default=Estado.ACTIVO
    )

    class Meta:
        db_table = "membresias"

    def __str__(self):
        return f"Socio: {self.socio.nombres} Fecha inicio: {self.fecha_inicio}"