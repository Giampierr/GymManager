
from dataclasses import dataclass
from datetime import date, datetime

from common.enums import Estado


@dataclass
class ResultadoServicio:
    codigo: object
    mensaje: str
    datos: object = None


@dataclass
class SocioCrearDTO:
    dni: str
    nombres: str
    apellidos: str
    fecha_nacimiento: date
    telefono: str
    correo: str
    direccion: str
    observaciones: str = ""


@dataclass
class SocioActualizarDTO:
    dni: str | None = None
    nombres: str | None = None
    apellidos: str | None = None
    fecha_nacimiento: date | None = None
    telefono: str | None = None
    correo: str | None = None
    direccion: str | None = None
    observaciones: str | None = None


@dataclass
class SocioRespuestaDTO:
    id_socio: int
    codigo_socio: str
    dni: str
    nombres: str
    apellidos: str
    fecha_nacimiento: date
    telefono: str
    correo: str
    direccion: str
    fecha_registro: datetime
    estado: str
    observaciones: str
