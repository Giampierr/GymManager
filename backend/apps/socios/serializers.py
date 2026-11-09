from rest_framework import serializers


class SocioFiltroSerializer(serializers.Serializer):

    buscar = serializers.CharField(
        required=False,
        allow_blank=True
    )

    anio = serializers.IntegerField(
        required=False,
        min_value=2000
    )

    mes = serializers.IntegerField(
        required=False,
        min_value=1,
        max_value=12
    )

    dominio = serializers.CharField(
        required=False,
        allow_blank=True
    )

    codigo = serializers.CharField(
        required=False,
        allow_blank=True
    )

    ordenar = serializers.BooleanField(
        required=False,
        default=False
    )



class SocioCrearSerializer(serializers.Serializer):
    dni = serializers.CharField(max_length=8)
    nombres = serializers.CharField(max_length=50)
    apellidos = serializers.CharField(max_length=50)
    fecha_nacimiento = serializers.DateField()
    telefono = serializers.CharField(max_length=9)
    correo = serializers.EmailField(max_length=100)
    direccion = serializers.CharField(max_length=255)
    observaciones = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True,
        default=""
    )


class SocioActualizarSerializer(serializers.Serializer):
    dni = serializers.CharField(max_length=8, required=False)
    nombres = serializers.CharField(max_length=50, required=False)
    apellidos = serializers.CharField(max_length=50, required=False)
    fecha_nacimiento = serializers.DateField(required=False)
    telefono = serializers.CharField(max_length=9, required=False)
    correo = serializers.EmailField(max_length=100, required=False)
    direccion = serializers.CharField(max_length=255, required=False)
    observaciones = serializers.CharField(
        max_length=255,
        required=False,
        allow_blank=True
    )

    def validate(self, attrs):
        if not attrs:
            raise serializers.ValidationError(
                "Debes enviar al menos un campo para actualizar."
            )
        return attrs


class SocioRespuestaSerializer(serializers.Serializer):
    id_socio = serializers.IntegerField()
    codigo_socio = serializers.CharField()
    dni = serializers.CharField()
    nombres = serializers.CharField()
    apellidos = serializers.CharField()
    fecha_nacimiento = serializers.DateField()
    telefono = serializers.CharField()
    correo = serializers.EmailField()
    direccion = serializers.CharField()
    fecha_registro = serializers.DateTimeField()
    estado = serializers.CharField()
    observaciones = serializers.CharField()