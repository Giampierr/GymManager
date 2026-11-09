from rest_framework import serializers


class LoginSerializer(serializers.Serializer):
    correo = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        trim_whitespace=False
    )


class UsuarioCrearSerializer(serializers.Serializer):

    id_rol = serializers.IntegerField()

    nombres = serializers.CharField(max_length=100)

    apellidos = serializers.CharField(max_length=100)

    correo = serializers.EmailField(max_length=100)

    password = serializers.CharField(
        min_length=8,
        write_only=True
    )

class UsuarioActualizarSerializer(serializers.Serializer):

    id_rol = serializers.IntegerField(required=False)

    nombres = serializers.CharField(
        max_length=100,
        required=False
    )

    apellidos = serializers.CharField(
        max_length=100,
        required=False
    )

    correo = serializers.EmailField(
        max_length=100,
        required=False
    )

    password = serializers.CharField(
        min_length=8,
        write_only=True,
        required=False,
        allow_blank=False
    )

class UsuarioRespuestaSerializer(serializers.Serializer):
    id_usuario = serializers.IntegerField()
    rol = serializers.CharField()
    nombres = serializers.CharField()
    apellidos = serializers.CharField()
    correo = serializers.EmailField()
    estado = serializers.CharField()
