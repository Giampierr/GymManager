class PagoService:

    @staticmethod
    def crear_pago( dto: PagoCrearDTO):
        
        if dto.membresia is None:
            return ResultadoServicio(
                ResultadoPago.MEMBRESIA_NO_ENCONTRADA,
                "Membresia no encontrada"
            )

        if dto.importe <= 0:
            return ResultadoServicio(
                ResultadoPago.IMPORTE_INVALIDO,
                "El importe debe ser mayor a cero"
            )

        if dto.descuento < 0:
            return ResultadoServicio(
                ResultadoPago.DESCUENTO_INVALIDO,
                "El descuento no puede ser negativo"
            )

        pass