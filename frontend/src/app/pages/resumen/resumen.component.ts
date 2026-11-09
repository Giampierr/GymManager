import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DataService } from '../../core/data.service';
import { fechaCorta, soles, solesInt, HOY } from '../../core/validators';
import { IconComponent } from '../../shared/icon/icon.component';
import { BarChartComponent } from '../../shared/bar-chart/bar-chart.component';
import { DonutComponent } from '../../shared/donut/donut.component';
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
  selector: 'app-resumen',
  standalone: true,
  imports: [RouterLink, BarChartComponent, DonutComponent, EstadoChipComponent, IconComponent],
  templateUrl: './resumen.component.html',
})
export class ResumenComponent {
  data = inject(DataService);
  soles = soles;
  hoy = HOY;
  fecha = fechaCorta;
  nombre = () => (this.data.usuarioActual()?.nombre ?? '').split(' ')[0] || 'equipo';
  asistHoy = computed(
    () =>
      this.data.asistencias().filter((a) => a.fecha.startsWith(HOY) && a.resultado === 'PERMITIDO')
        .length,
  );
  ocupacion = computed(() => {
    const c = this.data.clases();
    const cap = c.reduce((a, x) => a + x.cupo, 0);
    const res = c.reduce((a, x) => a + this.data.reservasActivas(x.id).length, 0);
    return cap ? Math.round((res / cap) * 100) : 0;
  });
  kpis = computed(() => {
    const d = this.data;
    const rol = d.usuarioActual()?.rol;
    const base = [
      {
        label: 'Socios activos',
        valor: String(d.sociosActivos().length),
        sub: `${d.socios().length} registrados`,
        icono: 'users',
      },
      {
        label: 'Membresías activas',
        valor: String(d.membresiasActivas().length),
        sub: `${d.porVencer().length} por vencer`,
        icono: 'card',
      },
      {
        label: 'Asistencias de hoy',
        valor: String(this.asistHoy()),
        sub: 'ingresos permitidos',
        icono: 'door',
      },
      {
        label: 'Ocupación de clases',
        valor: this.ocupacion() + '%',
        sub: 'cupos reservados',
        icono: 'calendar',
      },
    ];
    if (rol === 'Entrenador') return base;
    return [
      ...base,
      {
        label: 'Total recaudado',
        valor: solesInt(d.totalRecaudado()),
        sub: 'pagos registrados',
        icono: 'cash',
      },
      {
        label: 'Promedio de pagos',
        valor: solesInt(Math.round(d.promedioPagos())),
        sub: 'por pago',
        icono: 'trend',
      },
      {
        label: 'Pago de mayor monto',
        valor: soles(d.mayorPago()?.monto ?? 0),
        sub: d.mayorPago() ? `ID ${d.mayorPago()!.id}` : 'sin pagos',
        icono: 'cash',
      },
      {
        label: 'Planes vigentes',
        valor: String(d.planes().filter((p) => p.activo).length),
        sub: 'mensual · trimestral · anual',
        icono: 'card',
      },
    ];
  });
  mesesEt = () => this.data.recaudadoPorMes().map(([k]) => MES[+k.slice(5)]);
  mesesVal = () => this.data.recaudadoPorMes().map(([, v]) => v);
  doc = () => [
    {
      label: 'DNI',
      value: this.data.socios().filter((s) => s.tipoDocumento === 'Dni').length,
      color: 'var(--accent)',
    },
    {
      label: 'Carnet de extranjería',
      value: this.data.socios().filter((s) => s.tipoDocumento !== 'Dni').length,
      color: 'var(--accent2)',
    },
  ];
  estados = () =>
    (['ACTIVA', 'VENCIDA', 'SUSPENDIDA', 'CANCELADA'] as const)
      .map((e, i) => ({
        label: e,
        value: this.data.membresias().filter((m) => m.estado === e).length,
        color: ['var(--ok)', 'var(--bad)', 'var(--warn)', 'var(--mute)'][i],
      }))
      .filter((x) => x.value > 0);
  activas = () => this.data.membresiasActivas().slice(0, 5);
}
