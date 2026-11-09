import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DIAS, DataService } from '../../core/data.service';
import { Entrenador } from '../../core/models';
import { ToastService } from '../../core/services';
import { IconComponent } from '../../shared/icon/icon.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { EstadoChipComponent } from '../../shared/estado-chip/estado-chip.component';

@Component({
  selector: 'app-entrenadores',
  standalone: true,
  imports: [FormsModule, ModalComponent, ConfirmComponent, EstadoChipComponent, IconComponent],
  templateUrl: './entrenadores.component.html',
})
export class EntrenadoresComponent {
  data = inject(DataService);
  toast = inject(ToastService);
  dias = DIAS;
  form = signal<Partial<Entrenador> | null>(null);
  intento = signal(false);
  aToggle = signal<Entrenador | null>(null);
  asignar = signal<Entrenador | null>(null);
  agenda = signal<Entrenador | null>(null);
  sel = signal<number[]>([]);
  clasesDe = (id: number, dia?: number) =>
    this.data.clases().filter((c) => c.idEntrenador === id && (!dia || c.dia === dia));
  dni = (v?: string) => /^\d{8}$/.test(v ?? '');
  tel = (v?: string) => /^9\d{8}$/.test(v ?? '');
  nuevo() {
    this.intento.set(false);
    this.form.set({ nombre: '', documento: '', telefono: '', especialidad: '' });
  }
  editar(e: Entrenador) {
    this.intento.set(false);
    this.form.set({ ...e });
  }
  guardar() {
    this.intento.set(true);
    const f = this.form()!;
    if (
      !f.nombre?.trim() ||
      !this.dni(f.documento) ||
      !this.tel(f.telefono) ||
      !f.especialidad?.trim()
    )
      return this.toast.error('Revisa los campos marcados.');
    this.data.guardarEntrenador({
      id: f.id,
      nombre: f.nombre.trim(),
      documento: f.documento!,
      telefono: f.telefono!,
      especialidad: f.especialidad.trim(),
    });
    this.form.set(null);
    this.toast.ok(f.id ? 'Entrenador actualizado.' : 'Entrenador registrado.');
  }
  toggle(e: Entrenador) {
    this.data.toggleEntrenador(e.id);
    this.aToggle.set(null);
    this.toast.ok(e.activo ? 'Entrenador desactivado.' : 'Entrenador activado.');
  }
  abrirAsignar(e: Entrenador) {
    this.sel.set(this.clasesDe(e.id).map((c) => c.id));
    this.asignar.set(e);
  }
  marcar(id: number) {
    this.sel.update((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]));
  }
  cruce = () => {
    const e = this.asignar();
    return e ? this.data.cruceHorario(e.id, this.sel()) : null;
  };
  guardarAsignacion(e: Entrenador) {
    this.data.asignarClases(e.id, this.sel());
    this.asignar.set(null);
    this.toast.ok('Clases asignadas.');
  }
}
