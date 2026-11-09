import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/data.service';
import { Membresia, Plan } from '../../core/models';
import { ToastService } from '../../core/services';
import { esFutura, fechaCorta, HOY, soles, sumarDias } from '../../core/validators';
import { IconComponent } from '../../shared/icon/icon.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { EstadoChipComponent } from '../../shared/estado-chip/estado-chip.component';

@Component({
  selector: 'app-membresias',
  standalone: true,
  imports: [FormsModule, ModalComponent, ConfirmComponent, EstadoChipComponent, IconComponent],
  templateUrl: './membresias.component.html',
})
export class MembresiasComponent {
  data = inject(DataService);
  toast = inject(ToastService);
  fecha = fechaCorta;
  soles = soles;
  esFutura = esFutura;
  tab = signal<'m' | 'p'>('m');
  filtro = signal('ACTIVA');
  intento = signal(false);
  lista = computed(() =>
    this.data.membresias().filter((m) => !this.filtro() || m.estado === this.filtro()),
  );
  porVencer = (m: Membresia) =>
    m.estado === 'ACTIVA' && m.fechaFin >= HOY && m.fechaFin <= sumarDias(HOY, 7);
  historial = (id: number) => this.data.membresias().filter((m) => m.idSocio === id);
  modalContratar = signal(false);
  cSocio = 0;
  cPlan = 1;
  cInicio = HOY;
  calcFin = () => sumarDias(this.cInicio, (this.data.plan(this.cPlan)?.dias ?? 1) - 1);
  abrirContratar() {
    this.intento.set(false);
    this.cSocio = 0;
    this.cPlan = 1;
    this.cInicio = HOY;
    this.modalContratar.set(true);
  }
  contratar() {
    this.intento.set(true);
    if (!this.cSocio || esFutura(this.cInicio))
      return this.toast.error('Revisa los campos marcados.');
    this.data.contratar(this.cSocio, this.cPlan, this.cInicio);
    this.modalContratar.set(false);
    this.toast.ok('Membresía contratada.');
  }
  aRenovar = signal<Membresia | null>(null);
  renovar(m: Membresia) {
    this.data.renovar(m.id);
    this.aRenovar.set(null);
    this.toast.ok('Membresía renovada.');
  }
  aSuspender = signal<Membresia | null>(null);
  motivo = '';
  abrirSuspender(m: Membresia) {
    this.motivo = '';
    this.aSuspender.set(m);
  }
  suspender(m: Membresia) {
    this.data.suspender(m.id, this.motivo.trim());
    this.aSuspender.set(null);
    this.toast.aviso('Membresía suspendida.');
  }
  aEliminar = signal<Membresia | null>(null);
  eliminar(m: Membresia) {
    this.data.eliminarMembresia(m.id);
    this.aEliminar.set(null);
    this.toast.ok('Membresía eliminada.');
  }
  detalle = signal<Membresia | null>(null);
  modalPlan = signal(false);
  planPrecio = signal<Plan | null>(null);
  pNombre = '';
  pDias = 1;
  pPrecio = 0;
  abrirPlan() {
    this.intento.set(false);
    this.pNombre = '';
    this.pDias = 1;
    this.pPrecio = 0;
    this.modalPlan.set(true);
  }
  crearPlan() {
    this.intento.set(true);
    if (!this.pNombre.trim() || this.pDias <= 0 || this.pPrecio <= 0)
      return this.toast.error('Revisa los campos marcados.');
    this.data.nuevoPlan(this.pNombre.trim(), this.pDias, this.pPrecio);
    this.modalPlan.set(false);
    this.toast.ok('Plan creado.');
  }
  abrirPrecio(p: Plan) {
    this.intento.set(false);
    this.pPrecio = p.precio;
    this.planPrecio.set(p);
  }
  cambiarPrecio(p: Plan) {
    this.intento.set(true);
    if (this.pPrecio <= 0) return;
    this.data.cambiarPrecioPlan(p.id, this.pPrecio);
    this.planPrecio.set(null);
    this.toast.ok('Precio actualizado.');
  }
}
