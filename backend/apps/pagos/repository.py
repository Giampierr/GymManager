from models import Pago

class PagosRepository:
    
    @staticmethod
    def obtener_por_id(id_pago: int) -> Pago | None:
        return Pago.objects.filter(
            id_pago=id_pago
        ).first()   

    @staticmethod
    def listar_todos():
        return Pago.objects.all()

    @staticmethod
    def guardar(pago: Pago) -> Pago:
        pago.save()
        return pago 


    
    