
from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

from common.enums import EstadoClase, EstadoReserva
from apps.entrenadores.models import Entrenador
from apps.socios.models import Socio
from apps.accounts.models import Usuario


class TipoClase(models.Model):
    id_tipo_clase = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.CharField(max_length=100)
    estado = models.CharField(
        max_length=10,
        choices=EstadoClase.choices,
        default=EstadoClase.ACTIVO
    )

    class Meta:
        db_table = "tipo_de_clase"

    def __str__(self):
        return f"Nombre: {self.nombre} Estado: {self.estado}"


class Clase(models.Model):
    id_clase = models.BigAutoField(primary_key=True)

    tipo_clase = models.ForeignKey(
        TipoClase,
        on_delete=models.PROTECT,
        db_column="id_tipo_clase"
    )

    entrenador = models.ForeignKey(
        Entrenador,
        on_delete=models.PROTECT,
        db_column="id_entrenador"
    )

    fecha = models.DateField()
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()

    capacidad_maxima = models.IntegerField(
        validators=[MinValueValidator(1)]
    )

    estado = models.CharField(
        max_length=10,
        choices=EstadoClase.choices,
        default=EstadoClase.ACTIVO
    )

    class Meta:
        db_table = "clases"

    def clean(self):
        if self.hora_inicio and self.hora_fin:
            if self.hora_fin <= self.hora_inicio:
                raise ValidationError({
                    "hora_fin": "La hora de finalización debe ser posterior al inicio."
                })

    def __str__(self):
        return (
            f"Entrenador: {self.entrenador.nombres} "
            f"Fecha: {self.fecha} "
            f"Capacidad: {self.capacidad_maxima}"
        )


class ReservaClase(models.Model):
    id_reserva = models.BigAutoField(primary_key=True)

    socio = models.ForeignKey(
        Socio,
        on_delete=models.PROTECT,
        db_column="id_socio"
    )

    clase = models.ForeignKey(
        Clase,
        on_delete=models.PROTECT,
        db_column="id_clase"
    )

    usuario = models.ForeignKey(
        Usuario,
        on_delete=models.PROTECT,
        db_column="id_usuario"
    )

    fecha_reserva = models.DateTimeField()

    estado = models.CharField(
        max_length=10,
        choices=EstadoReserva.choices,
        default=EstadoReserva.CONFIRMADO
    )

    fecha_cancelacion = models.DateTimeField(
        null=True,
        blank=True
    )

    class Meta:
        db_table = "reservas_clases"

    def __str__(self):
        return (
            f"Socio: {self.socio.nombres} "
            f"Clase: {self.clase.fecha}"
        )
