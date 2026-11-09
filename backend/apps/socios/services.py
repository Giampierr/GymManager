from uuid import uuid4
from django.core.exceptions import ValidationError
from django.db import transaction
    
from common.enums import Estado, ResultadoSocio

from .models import Socio
from .repository import SocioRepository

from .dtos import (
    ResultadoServicio,
    SocioCrearDTO,
    SocioActualizarDTO,
    SocioRespuestaDTO
)


class SocioService:

    @staticmethod
    def _convertir_a_dto(socio: Socio) -> SocioRespuestaDTO:
        return SocioRespuestaDTO(
            id_socio=socio.id_socio,
            codigo_socio=socio.codigo_socio,
            dni=socio.dni,
            nombres=socio.nombres,
            apellidos=socio.apellidos,
            fecha_nacimiento=socio.fecha_nacimiento,
            telefono=socio.telefono,
            correo=socio.correo,
            direccion=socio.direccion,
            fecha_registro=socio.fecha_registro,
            estado=socio.estado,
            observaciones=socio.observaciones
        )

    
    @staticmethod
    def registrar_socio(datos: SocioCrearDTO) -> ResultadoServicio:

        if SocioRepository.existe_dni(datos.dni):
            return ResultadoServicio(
                ResultadoSocio.DNI_DUPLICADO,
                "El DNI ya está registrado"
            )

        if SocioRepository.existe_correo(datos.correo):
            return ResultadoServicio(
                ResultadoSocio.CORREO_DUPLICADO,
                "El correo ya está registrado"
            )

        try:
            with transaction.atomic():

                socio = Socio(
                    codigo_socio=f"TEMP-{uuid4()}",
                    dni=datos.dni,
                    nombres=datos.nombres,
                    apellidos=datos.apellidos,
                    fecha_nacimiento=datos.fecha_nacimiento,
                    telefono=datos.telefono,
                    correo=datos.correo,
                    direccion=datos.direccion,
                    observaciones=datos.observaciones
                )

                socio.full_clean()
                SocioRepository.guardar(socio)

                # Generar código usando el ID autoincremental
                socio.codigo_socio = f"SOC{socio.id_socio:03d}"

                socio.full_clean()
                SocioRepository.guardar(socio)

            return ResultadoServicio(
                ResultadoSocio.SOCIO_CREADO,
                "Socio registrado correctamente",
                SocioService._convertir_a_dto(socio)
            )

        except ValidationError as error:
            return ResultadoServicio(
                ResultadoSocio.DATOS_INVALIDOS,
                "Los datos del socio no son válidos",
                error.message_dict if hasattr(error, "message_dict") else error.messages
            )

    # OBTENER SOCIO
    @staticmethod
    def obtener_socio(id_socio: int) -> ResultadoServicio:

        socio = SocioRepository.obtener_por_id(id_socio)

        if socio is None:
            return ResultadoServicio(
                ResultadoSocio.SOCIO_NO_ENCONTRADO,
                "Socio no encontrado"
            )

        return ResultadoServicio(
            ResultadoSocio.SOCIO_ENCONTRADO,
            "Socio encontrado",
            SocioService._convertir_a_dto(socio)
        )

    # LISTAR SOCIOS
    @staticmethod
    def listar_socios() -> ResultadoServicio:

        socios = SocioRepository.listar_todos()

        resultados = [
            SocioService._convertir_a_dto(socio)
            for socio in socios
        ]

        return ResultadoServicio(
            ResultadoSocio.SOCIOS_ENCONTRADOS,
            "Socios encontrados",
            resultados
        )

    # BUSCAR SOCIOS
    @staticmethod
    def buscar_socios(
        buscar: str | None = None,
        anio: int | None = None,
        mes: int | None = None,
        dominio: str | None = None,
        codigo: str | None = None,
        ordenar: bool = False
    ) -> ResultadoServicio:

        socios = SocioRepository.buscar(
            buscar=buscar,
            anio=anio,
            mes=mes,
            dominio=dominio,
            codigo=codigo,
            ordenar=ordenar
        )

        resultados = [
            SocioService._convertir_a_dto(socio)
            for socio in socios
        ]

        return ResultadoServicio(
            ResultadoSocio.SOCIOS_ENCONTRADOS,
            "Búsqueda realizada correctamente",
            resultados
        )
    # ACTUALIZAR SOCIO
    @staticmethod
    def actualizar_socio(
        id_socio: int,
        datos: SocioActualizarDTO
    ) -> ResultadoServicio:

        socio = SocioRepository.obtener_por_id(id_socio)

        if socio is None:
            return ResultadoServicio(
                ResultadoSocio.SOCIO_NO_ENCONTRADO,
                "Socio no encontrado"
            )

        if datos.dni is not None:
            if SocioRepository.existe_dni(datos.dni, excluir_id=id_socio):
                return ResultadoServicio(
                    ResultadoSocio.DNI_DUPLICADO,
                    "El DNI ya pertenece a otro socio"
                )
            socio.dni = datos.dni

        if datos.correo is not None:
            if SocioRepository.existe_correo(datos.correo, excluir_id=id_socio):
                return ResultadoServicio(
                    ResultadoSocio.CORREO_DUPLICADO,
                    "El correo ya pertenece a otro socio"
                )
            socio.correo = datos.correo

        campos = [
            "nombres",
            "apellidos",
            "fecha_nacimiento",
            "telefono",
            "direccion",
            "observaciones"
        ]

        for campo in campos:
            valor = getattr(datos, campo)

            if valor is not None:
                setattr(socio, campo, valor)

        try:
            socio.full_clean()
            SocioRepository.guardar(socio)

        except ValidationError as e:
            errores = getattr(e, "message_dict", e.messages)

            return ResultadoServicio(
                codigo=ResultadoSocio.DATOS_INVALIDOS,
                mensaje="Los datos del socio no son válidos",
                datos=errores
            )

        return ResultadoServicio(
            ResultadoSocio.SOCIO_ACTUALIZADO,
            "Socio actualizado correctamente",
            SocioService._convertir_a_dto(socio)
        )

    # CAMBIAR ESTADO
    @staticmethod
    def cambiar_estado(
        id_socio: int,
        estado: Estado
    ) -> ResultadoServicio:

        socio = SocioRepository.obtener_por_id(id_socio)

        if socio is None:
            return ResultadoServicio(
                ResultadoSocio.SOCIO_NO_ENCONTRADO,
                "Socio no encontrado"
            )

        socio.estado = estado

        SocioRepository.guardar(socio)

        codigo = (
            ResultadoSocio.SOCIO_ACTIVADO
            if estado == Estado.ACTIVO
            else ResultadoSocio.SOCIO_DESACTIVADO
        )

        return ResultadoServicio(
            codigo,
            "Estado del socio actualizado correctamente",
            SocioService._convertir_a_dto(socio)
        )
