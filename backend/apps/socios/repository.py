from django.db.models import Q
from .models import Socio


class SocioRepository:

    @staticmethod
    def obtener_por_id(id_socio: int) -> Socio | None:
        return Socio.objects.filter(id_socio=id_socio).first()

    @staticmethod
    def obtener_por_dni(dni: str) -> Socio | None:
        return Socio.objects.filter(dni=dni).first()

    @staticmethod
    def obtener_por_correo(correo: str) -> Socio | None:
        return Socio.objects.filter(correo=correo).first()

    @staticmethod
    def obtener_por_codigo(codigo_socio: str) -> Socio | None:
        return Socio.objects.filter(codigo_socio=codigo_socio).first()

    @staticmethod
    def listar_todos():
        return Socio.objects.all().order_by("id_socio")

    @staticmethod
    def listar_por_estado(estado: str):
        return Socio.objects.filter(estado=estado).order_by("id_socio")

    @staticmethod
    def existe_dni(dni: str, excluir_id: int | None = None) -> bool:
        consulta = Socio.objects.filter(dni=dni)

        if excluir_id is not None:
            consulta = consulta.exclude(id_socio=excluir_id)

        return consulta.exists()

    @staticmethod
    def existe_correo(correo: str, excluir_id: int | None = None) -> bool:
        consulta = Socio.objects.filter(correo=correo)

        if excluir_id is not None:
            consulta = consulta.exclude(id_socio=excluir_id)

        return consulta.exists()

    @staticmethod
    def guardar(socio: Socio) -> Socio:
        socio.save()
        return socio

    @staticmethod
    def eliminar(socio: Socio) -> None:
        socio.delete()


    
    @staticmethod
    def buscar(
        buscar: str | None = None,
        anio: int | None = None,
        mes: int | None = None,
        dominio: str | None = None,
        codigo: str | None = None,
        ordenar: bool = False
    ):
        consulta = Socio.objects.all()

        if buscar:
            consulta = consulta.filter(
                Q(nombres__icontains=buscar) |
                Q(apellidos__icontains=buscar) |
                Q(codigo_socio__icontains=buscar)
            )

        if anio is not None:
            consulta = consulta.filter(
                fecha_registro__year=anio
            )

        if mes is not None:
            consulta = consulta.filter(
                fecha_registro__month=mes
            )

        if dominio:
            dominio = dominio.strip().lstrip("@")

            consulta = consulta.filter(
                correo__iendswith=f"@{dominio}"
            )

        if codigo:
            consulta = consulta.filter(
                codigo_socio__iexact=codigo.strip()
            )

        if ordenar:
            consulta = consulta.order_by(
                "apellidos",
                "nombres"
            )
        else:
            consulta = consulta.order_by("id_socio")

        return consulta

