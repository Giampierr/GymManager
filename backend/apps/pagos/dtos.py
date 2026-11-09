from dataclasses import dataclass

from apps.accounts.models import Usuario
from apps.membresias.models import Membresia
from common.enums import MetodoPago, EstadoPago
@dataclass
class PagoCrearDTO:
    membresia: Membresia
    usuario:Usuario
    importe : float
    descuento : float
    metodo_pago : MetodoPago
