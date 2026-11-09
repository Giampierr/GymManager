import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/data.service';
import { Pago } from '../../core/models';
import { ToastService } from '../../core/services';
import { fechaCorta, soles } from '../../core/validators';
import { IconComponent } from '../../shared/icon/icon.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { BarChartComponent } from '../../shared/bar-chart/bar-chart.component';
import { EstadoChipComponent } from '../../shared/estado-chip/estado-chip.component';

const MES = [
  '',
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [
    FormsModule,
    ModalComponent,
    ConfirmComponent,
    EstadoChipComponent,
    IconComponent,
    BarChartComponent,
  ],
  templateUrl: './pagos.component.html',
})
export class PagosComponent {
  data = inject(DataService);
  toast = inject(ToastService);
  fecha = fechaCorta;
  soles = soles;
  nombresMes = [
    '',
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
  metodos = ['Efectivo', 'Tarjeta', 'Yape/Plin', 'Transferencia'];
  q = signal('');
  metodo = signal('');
  anio = signal('');
  mes = signal('');
  mayor = signal<number | null>(null);
  // Equivalen a PagoServicio.scala: delMes, mayoresA (filter) y recaudadoPorMes (groupBy)
  lista = computed(() => {
    const t = this.q().trim().toLowerCase().replace('#', '');
    return this.data
      .pagos()
      .filter(
        (p) =>
          (!t ||
            this.data.nombreSocio(p.idSocio).toLowerCase().includes(t) ||
            (this.data.socio(p.idSocio)?.codigo ?? '').toLowerCase() === t ||
            String(p.id) === t) &&
          (!this.metodo() || p.metodo === this.metodo()) &&
          (!this.anio() || +p.fecha.slice(0, 4) === +this.anio()) &&
          (!this.mes() || +p.fecha.slice(5, 7) === +this.mes()) &&
          (this.mayor() == null || this.mayor() === ('' as any) || p.monto > +this.mayor()!),
      )
      .slice()
      .reverse();
  });
  et = () => this.data.recaudadoPorMes().map(([k]) => MES[+k.slice(5)]);
  val = () => this.data.recaudadoPorMes().map(([, v]) => v);
  limpiar() {
    this.q.set('');
    this.metodo.set('');
    this.anio.set('');
    this.mes.set('');
    this.mayor.set(null);
  }
  modal = signal(false);
  intento = signal(false);
  procesando = signal(false);
  fSocio = 0;
  fConcepto = 'Membresía Mensual';
  fMetodo = 'Efectivo';
  fMonto = 100;
  fDesc = 0;
  fTipoDesc: 'S' | 'P' = 'S';
  descuentoMonto = () =>
    this.fTipoDesc === 'P' ? (this.fMonto * (this.fDesc || 0)) / 100 : this.fDesc || 0;
  total = () => Math.max(0, this.fMonto - this.descuentoMonto());
  alCambiarConcepto() {
    const p = this.data.planes().find((x) => 'Membresía ' + x.nombre === this.fConcepto);
    if (p) this.fMonto = p.precio;
  }
  abrir() {
    this.intento.set(false);
    this.fSocio = 0;
    this.fConcepto = 'Membresía Mensual';
    this.fMetodo = 'Efectivo';
    this.fMonto = 100;
    this.fDesc = 0;
    this.fTipoDesc = 'S';
    this.modal.set(true);
  }
  registrar() {
    this.intento.set(true);
    if (!this.fSocio || this.fMonto <= 0 || this.descuentoMonto() > this.fMonto)
      return this.toast.error('Revisa los campos marcados.');
    this.procesando.set(true);
    setTimeout(() => {
      this.data.registrarPago(
        this.fSocio,
        this.fConcepto,
        this.fMetodo,
        this.fMonto,
        this.descuentoMonto(),
      );
      this.procesando.set(false);
      this.modal.set(false);
      this.toast.ok('Pago registrado correctamente.');
    }, 600);
  }
  aAnular = signal<Pago | null>(null);
  motivo = '';
  anular(p: Pago) {
    this.data.anularPago(p.id, this.motivo.trim());
    this.aAnular.set(null);
    this.motivo = '';
    this.toast.aviso('Pago anulado.');
  }
}
