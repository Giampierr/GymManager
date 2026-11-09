
import jwt

from datetime import datetime, timedelta, timezone
from django.conf import settings


class JWTService:

    @staticmethod
    def generar_access_token(usuario):
        ahora = datetime.now(timezone.utc)

        payload = {
            "user_id": usuario.id_usuario,
            "correo": usuario.correo,
            "rol": usuario.rol.nombre,
            "tipo": "access",
            "iat": ahora,
            "exp": ahora + timedelta(
                minutes=settings.JWT_ACCESS_TOKEN_MINUTES
            )
        }

        return jwt.encode(
            payload,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )

    @staticmethod
    def generar_refresh_token(usuario):
        ahora = datetime.now(timezone.utc)

        payload = {
            "user_id": usuario.id_usuario,
            "tipo": "refresh",
            "iat": ahora,
            "exp": ahora + timedelta(
                days=settings.JWT_REFRESH_TOKEN_DAYS
            )
        }

        return jwt.encode(
            payload,
            settings.JWT_SECRET_KEY,
            algorithm=settings.JWT_ALGORITHM
        )

    @staticmethod
    def validar_token(token):
        try:
            return jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=[settings.JWT_ALGORITHM]
            )
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None
