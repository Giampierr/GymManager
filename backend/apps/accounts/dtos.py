from dataclasses import dataclass
from enum import Enum
from typing import Any

from .models import Rol
from common.enums import Estado


@dataclass
class ResultadoServicio:
    codigo: Enum
    mensaje: str
    datos: Any = None


@dataclass
class UsuarioCrearDTO:
    id_rol: int
    nombres: str
    apellidos: str
    correo: str
    password: str
    estado: Estado = Estado.ACTIVO


@dataclass
class UsuarioActualizarDTO:
    id_rol: int | None = None
    nombres: str | None = None
    apellidos: str | None = None
    correo: str | None = None
    password: str | None = None
    estado: Estado | None = None


@dataclass
class UsuarioRespuestaDTO:
    id_usuario: int
    rol: str
    nombres: str
    apellidos: str
    correo: str
    estado: str
