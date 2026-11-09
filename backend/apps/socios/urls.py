from django.urls import path
from .views import SocioActualizarView, SocioListCreateView

urlpatterns = [
    path("", SocioListCreateView.as_view(), name="socios-list-create"),
    path("<int:id_socio>/", SocioActualizarView.as_view(), name="socios-actualizar"),
]