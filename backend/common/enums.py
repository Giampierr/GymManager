from django.db import models
from enum import Enum


# ==========================
# TIPOS DE ROL
# ==========================

class Roles(models.TextChoices):

    ADMINISTRADOR = "ADMINISTRADOR", "Administrador"
    RECEPCION = "RECEPCION", "Recepcion"
    ENTRENADOR = "ENTRENADOR","Entrenador"

# ==========================
# ESTADOS DE USUARIO
# ==========================

class Estado(models.TextChoices):

    ACTIVO = "ACTIVO", "Activo"
    INACTIVO = "INACTIVO", "Inactivo"
    SUSPENDIDO = "SUSPENDIDO","Suspendido"

# ==========================
# ESTADOS DE CLASE
# ==========================

class EstadoClase(models.TextChoices):

    ACTIVO = "ACTIVO", "Activo"
    INACTIVO = "INACTIVO", "Inactivo"


# ==========================
# ESTADOS DE RESERVA
# ==========================

class EstadoReserva(models.TextChoices):

    CONFIRMADO = "CONFIRMADO", "Confirmado"
    CANCELADO = "CANCELADO", "Cancelado"

# ==========================
# METODO PAGO
# ==========================

class MetodoPago(models.TextChoices):

    EFECTIVO = "EFECTIVO", "Efectivo"
    TARJETA = "TARJETA", "Tarjeta"
    TRASNFERENCIA = "TRASNFERENCIA", "Trasnferencia"


# ==========================
# ESTADO PAGO
# ==========================

class EstadoPago(models.TextChoices):

    PAGADO = "PAGADO", "Pagado"
    PENDIENTE = "PENDIENTE","Pendiente"
    RECHAZADO = "RECHAZADO","Rechazado"
    ANULADO = "ANULADO","Anulado"


# ==========================
# ESPECIALIDADES ENTRENADORES
# ==========================

class Especialidad(models.TextChoices):

    SPINNING = "SPINNING", "Spinning"
    YOGA = "YOGA","Yoga"
    CROSSFIT = "CROSSFIT","Crossfit"
    FUNCIONAL = "FUNCIONAL","Funcional"
    ZUMBA = "ZUMBA","Zumba"



# ==========================
# CODIGO AUTENTICACION
# ==========================
class CodigoAutenticacion(Enum):
    LOGIN_EXITOSO = "LOGIN_EXITOSO"
    USUARIO_NO_ENCONTRADO = "USUARIO_NO_ENCONTRADO"
    CREDENCIALES_INVALIDAS = "CREDENCIALES_INVALIDAS"
    USUARIO_INACTIVO = "USUARIO_INACTIVO"


# ==========================
# RESULTADO BUSQUEDA
# ==========================
class ResultadoBusqueda(Enum):
    USUARIO_NO_ENCONTRADO = "USUARIO_NO_ENCONTRADO"
    USARIO_ENCONTRADO = "USARIO_ENCONTRADO"

# ==========================
# CODIGO USUARIO
# ==========================
class ResultadoUsuario(Enum):
    USUARIO_CREADO = "USUARIO_CREADO"
    USUARIO_ACTUALIZADO = "USUARIO_ACTUALIZADO"
    USUARIO_NO_ENCONTRADO = "USUARIO_NO_ENCONTRADO"
    USUARIO_ELIMINADO = "USUARIO_ELIMINADO"
    CORREO_DUPLICADO = "CORREO_DUPLICADO"
    ROL_NO_ENCONTRADO = "ROL_NO_ENCONTRADO"



# ==========================
# RESULTADO SOCIOS
# ==========================

class ResultadoSocio(models.TextChoices):
    SOCIO_CREADO = "SOCIO_CREADO", "Socio creado"
    SOCIO_ACTUALIZADO = "SOCIO_ACTUALIZADO", "Socio actualizado"
    SOCIO_ENCONTRADO = "SOCIO_ENCONTRADO", "Socio encontrado"
    SOCIOS_ENCONTRADOS = "SOCIOS_ENCONTRADOS", "Socios encontrados"
    SOCIO_NO_ENCONTRADO = "SOCIO_NO_ENCONTRADO", "Socio no encontrado"
    DNI_DUPLICADO = "DNI_DUPLICADO", "DNI duplicado"
    CORREO_DUPLICADO = "CORREO_DUPLICADO", "Correo duplicado"
    SOCIO_DESACTIVADO = "SOCIO_DESACTIVADO", "Socio desactivado"
    SOCIO_ACTIVADO = "SOCIO_ACTIVADO", "Socio activado"
    DATOS_INVALIDOS = "DATOS_INVALIDOS", "Datos inválidos"