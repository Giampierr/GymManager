from django.core.validators import RegexValidator

class Validador : 

    validador_dni = RegexValidator(
        regex=r'^\d{8}$',
        message="El DNI debe contener exactamente 8 dígitos."
    )

    validar_telefono = RegexValidator(
    regex=r'^9\d{8}$',
    message="El teléfono debe comenzar con 9 y tener 9 dígitos"
)