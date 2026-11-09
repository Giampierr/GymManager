from django.urls import path
from .views import LoginView, UsuarioActualizarView, UsuarioCrearView, UsuarioDesactivarView

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
    path("usuarios/", UsuarioCrearView.as_view(), name="usuarios-crear"),
    path("usuarios/<int:id_usuario>/",UsuarioActualizarView.as_view(),name="usuarios-actualizar"),
    path("usuarios/<int:id_usuario>/desactivar/", UsuarioDesactivarView.as_view(), name="usuarios-desactivar")
]