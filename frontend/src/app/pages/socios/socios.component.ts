import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/data.service';
import { Socio, TipoDocumento } from '../../core/models';
import { ToastService } from '../../core/services';
import {
  esFutura,
  fechaCorta,
  soles,
  validarCorreo,
  validarDocumento,
  validarTelefono,
  HOY,
} from '../../core/validators';
import { IconComponent } from '../../shared/icon/icon.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { EstadoChipComponent } from '../../shared/estado-chip/estado-chip.component';

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

@Component({
  selector: 'app-socios',
  standalone: true,
  imports: [FormsModule, ModalComponent, ConfirmComponent, EstadoChipComponent, IconComponent],
  templateUrl: './socios.component.html',
})
export class SociosComponent {
  data = inject(DataService);
  toast = inject(ToastService);
  meses = MESES;
  fecha = fechaCorta;
  soles = soles;
  texto = signal('');
  tipo = signal('');
  anio = signal('');
  mes = signal('');
  dominio = signal('');
  ordenar = signal(false);
  codigoBuscado = '';
  busqueda = signal<'' | 'si' | 'no'>('');
  encontrado = signal<Socio | undefined>(undefined);
  form = signal<(Partial<Socio> & { tipoDocumento: TipoDocumento }) | null>(null);
  intento = signal(false);
  ficha = signal<Socio | null>(null);
  aDesactivar = signal<Socio | null>(null);
  aEliminar = signal<Socio | null>(null);

  // Equivalen a las consultas de SocioServicio.scala (filter, groupBy, find, sortBy)
  lista = computed(() => {
    const t = this.texto().trim().toLowerCase(),
      d = this.dominio().trim().toLowerCase();
    let l = this.data
      .socios()
      .filter(
        (s) =>
          (!t || (s.nombre + ' ' + s.apellido + ' ' + s.codigo).toLowerCase().includes(t)) &&
          (!this.tipo() || s.tipoDocumento === this.tipo()) &&
          (!this.anio() || +s.fechaRegistro.slice(0, 4) === +this.anio()) &&
          (!this.mes() || +s.fechaRegistro.slice(5, 7) === +this.mes()) &&
          (!d || s.email.toLowerCase().endsWith('@' + d)),
      );
    if (this.ordenar())
      l = [...l].sort((a, b) =>
        (a.apellido + a.nombre).toLowerCase().localeCompare((b.apellido + b.nombre).toLowerCase()),
      );
    return l;
  });
  conteo = computed(() => ({
    dni: this.data.socios().filter((s) => s.tipoDocumento === 'Dni').length,
    ce: this.data.socios().filter((s) => s.tipoDocumento !== 'Dni').length,
  }));
  limpiar() {
    this.texto.set('');
    this.tipo.set('');
    this.anio.set('');
    this.mes.set('');
    this.dominio.set('');
    this.ordenar.set(false);
    this.codigoBuscado = '';
    this.busqueda.set('');
  }
  buscarCodigo() {
    const s = this.data
      .socios()
      .find((x) => x.codigo.toLowerCase() === this.codigoBuscado.trim().toLowerCase());
    this.encontrado.set(s);
    this.busqueda.set(s ? 'si' : 'no');
  }

  nuevo() {
    this.intento.set(false);
    this.form.set({
      codigo: '',
      nombre: '',
      apellido: '',
      tipoDocumento: 'Dni',
      nroDocumento: '',
      telefono: '',
      email: '',
      fechaRegistro: HOY,
    });
  }
  editar(s: Socio) {
    this.intento.set(false);
    this.form.set({ ...s });
  }
  e = () => {
    const f = this.form();
    const r: Record<string, string> = {};
    if (!f || !this.intento()) return r;
    if (!f.codigo?.trim()) r['codigo'] = 'El código es obligatorio.';
    else if (
      this.data
        .socios()
        .some((s) => s.codigo.toLowerCase() === f.codigo!.trim().toLowerCase() && s.id !== f.id)
    )
      r['codigo'] = 'Ya existe un socio con ese código.';
    if (!f.nombre?.trim()) r['nombre'] = 'El nombre es obligatorio.';
    if (!f.apellido?.trim()) r['apellido'] = 'El apellido es obligatorio.';
    if (!validarDocumento(f.tipoDocumento, f.nroDocumento ?? ''))
      r['nroDocumento'] =
        f.tipoDocumento === 'Dni'
          ? 'El DNI debe tener 8 dígitos.'
          : 'El carnet debe tener entre 9 y 15 caracteres alfanuméricos.';
    if (!validarTelefono(f.telefono ?? '')) r['telefono'] = 'Debe tener 9 dígitos y empezar con 9.';
    if (!validarCorreo(f.email ?? '')) r['email'] = 'Correo inválido.';
    if (!f.fechaRegistro) r['fechaRegistro'] = 'Fecha obligatoria.';
    else if (esFutura(f.fechaRegistro)) r['fechaRegistro'] = 'La fecha no puede ser futura.';
    return r;
  };
  guardar() {
    this.intento.set(true);
    const f = this.form()!;
    this.form.set({ ...f });
    if (Object.keys(this.e()).length) return this.toast.error('Revisa los campos marcados.');
    this.data.guardarSocio({
      id: f.id,
      codigo: f.codigo!.trim(),
      nombre: f.nombre!.trim(),
      apellido: f.apellido!.trim(),
      tipoDocumento: f.tipoDocumento,
      nroDocumento: f.nroDocumento!,
      telefono: f.telefono!,
      email: f.email!,
      fechaRegistro: f.fechaRegistro!,
    });
    this.form.set(null);
    this.toast.ok(f.id ? 'Socio actualizado.' : 'Socio registrado.');
  }
  verFicha(s: Socio) {
    this.ficha.set(s);
  }
  membresiaDe = (id: number) =>
    this.data
      .membresias()
      .filter((m) => m.idSocio === id)
      .slice(-1)[0];
  pagosDe = (id: number) =>
    this.data
      .pagos()
      .filter((p) => p.idSocio === id)
      .slice(-3);
  asistDe = (id: number) =>
    this.data
      .asistencias()
      .filter((a) => a.idSocio === id)
      .slice(0, 3);
  toggle(s: Socio) {
    this.data.toggleSocio(s.id);
    this.aDesactivar.set(null);
    this.toast.ok(s.activo ? 'Socio desactivado.' : 'Socio reactivado.');
  }
  eliminar(s: Socio) {
    this.data.eliminarSocio(s.id);
    this.aEliminar.set(null);
    this.toast.ok('Socio eliminado.');
  }
}
