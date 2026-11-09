from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

from apps.membresias.models import Membresia
from apps.accounts.models import Usuario
from common.enums import MetodoPago,EstadoPago

# Create your models here.
class Pago(models.Model):
    id_pago = models.BigAutoField(primary_key=True)

    membresia = models.ForeignKey(
        Membresia,
        on_delete=models.PROTECT,
        db_column="id_membresia"
    )

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        db_column="id_usuario"
    )

    codigo_operacion = models.CharField(max_length=100, unique=True)

    importe = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    descuento = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )

    fecha_pago = models.DateTimeField()

    metodo_Pago = models.CharField(
        max_length=15,
        choices=MetodoPago.choices
    )

    estado = models.CharField(
        max_length=15,
        choices=EstadoPago.choices
    )

    def clean(self):
        if self.descuento > self.importe:
            raise ValidationError({
                "descuento": "El descuento no puede superar el importe."
            })

    def calcular_total(self):
        return self.importe - self.descuento

    class Meta:
        db_table = "pagos"

    def __str__(self):
        return f"Usuario: {self.usuario.nombres} Monto: {self.calcular_total()}"