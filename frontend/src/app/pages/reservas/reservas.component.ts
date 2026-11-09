import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DIAS, DataService } from '../../core/data.service';
import { Clase, Reserva } from '../../core/models';
import { ToastService } from '../../core/services';
import { fechaCorta } from '../../core/validators';
import { IconComponent } from '../../shared/icon/icon.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { EstadoChipComponent } from '../../shared/estado-chip/estado-chip.component';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [FormsModule, ModalComponent, ConfirmComponent, EstadoChipComponent, IconComponent],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css',
})
export class ReservasComponent {
  data = inject(DataService);
  toast = inject(ToastService);
  dias = DIAS;
  fecha = fechaCorta;
  tab = signal<'c' | 'l' | 'h'>('c');
  intento = signal(false);
  detalle = signal<Clase | null>(null);
  aCancelar = signal<Reserva | null>(null);
  clasesDia = (d: number) =>
    this.data
      .clases()
      .filter((c) => c.dia === d)
      .sort((a, b) => a.hora.localeCompare(b.hora));
  ocupados = (c: Clase) => this.data.reservasActivas(c.id).length;
  pct = (c: Clase) => Math.min(100, (this.ocupados(c) / c.cupo) * 100);
  color = (c: Clase) =>
    this.pct(c) >= 100 ? 'var(--bad)' : this.pct(c) >= 75 ? 'var(--warn)' : 'var(--ok)';
  estadoCupo = (c: Clase) =>
    this.pct(c) >= 100 ? 'completo' : this.pct(c) >= 75 ? 'casi lleno' : 'disponible';
  hSocio = signal('');
  hClase = signal('');
  hEstado = signal('');
  hDesde = signal('');
  historial = computed(() => {
    const t = this.hSocio().trim().toLowerCase();
    return this.data
      .reservas()
      .filter(
        (r) =>
          (!t || this.data.nombreSocio(r.idSocio).toLowerCase().includes(t)) &&
          (!this.hClase() || r.idClase === +this.hClase()) &&
          (!this.hEstado() || r.estado === this.hEstado()) &&
          (!this.hDesde() || r.fecha >= this.hDesde()),
      )
      .slice()
      .reverse();
  });
  modalRes = signal(false);
  rSocio = 0;
  rClase = 0;
  errRes = signal('');
  nuevaReserva(c: Clase | null) {
    this.detalle.set(null);
    this.intento.set(false);
    this.errRes.set('');
    this.rSocio = 0;
    this.rClase = c?.id ?? 0;
    this.modalRes.set(true);
  }
  reservar() {
    this.intento.set(true);
    this.errRes.set('');
    if (!this.rSocio || !this.rClase) return;
    const e = this.data.reservar(this.rClase, this.rSocio);
    if (e) return this.errRes.set(e);
    this.modalRes.set(false);
    this.toast.ok('Reserva registrada.');
  }
  cancelar(r: Reserva) {
    this.data.cancelarReserva(r.id);
    this.aCancelar.set(null);
    this.toast.aviso('Reserva cancelada.');
  }
  formClase = signal<Partial<Clase> | null>(null);
  nuevaClase() {
    this.intento.set(false);
    this.formClase.set({
      nombre: '',
      idEntrenador: this.data.entrenadores().find((e) => e.activo)?.id,
      dia: 1,
      hora: '07:00',
      sala: 'Sala 1',
      cupo: 10,
    });
  }
  editarClase(c: Clase) {
    this.intento.set(false);
    this.formClase.set({ ...c });
  }
  guardarClase() {
    this.intento.set(true);
    const f = this.formClase()!;
    if (!f.nombre?.trim() || !(f.cupo && f.cupo > 0))
      return this.toast.error('Revisa los campos marcados.');
    this.data.guardarClase(f as Clase);
    this.formClase.set(null);
    this.toast.ok('Clase guardada.');
  }
}
