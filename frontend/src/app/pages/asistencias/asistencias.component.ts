import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService, ResultadoAcceso } from '../../core/data.service';
import { HOY, fechaCorta } from '../../core/validators';
import { IconComponent } from '../../shared/icon/icon.component';
import { BarChartComponent } from '../../shared/bar-chart/bar-chart.component';
import { EstadoChipComponent } from '../../shared/estado-chip/estado-chip.component';

interface Res {
  clase: 'ok' | 'bad' | 'warn' | 'mute';
  titulo: string;
  detalle?: string;
}

@Component({
  selector: 'app-asistencias',
  standalone: true,
  imports: [FormsModule, EstadoChipComponent, IconComponent, BarChartComponent],
  templateUrl: './asistencias.component.html',
})
export class AsistenciasComponent {
  data = inject(DataService);
  fecha = fechaCorta;
  Math = Math;
  q = '';
  errorId = signal('');
  res = signal<Res | null>(null);
  desde = signal('');
  hasta = signal('');
  socioQ = signal('');
  resF = signal('');
  validar() {
    this.errorId.set('');
    if (!this.q.trim()) {
      this.errorId.set('Ingrese un ID válido');
      return;
    }
    const { socio, resultado } = this.data.validarAcceso(this.q);
    this.res.set(this.mensaje(resultado, socio?.nombre + ' ' + socio?.apellido));
  }
  private mensaje(r: ResultadoAcceso, n?: string): Res {
    const s = this.data.buscarSocio(this.q);
    const m = s
      ? this.data
          .membresias()
          .filter((x) => x.idSocio === s.id)
          .slice(-1)[0]
      : undefined;
    const det = s
      ? `${n} · ${m ? this.data.plan(m.idPlan)?.nombre + ' · vence ' + fechaCorta(m.fechaFin) : 'sin membresía'}`
      : undefined;
    return r === 'PERMITIDO'
      ? { clase: 'ok', titulo: 'El socio puede ingresar al gimnasio', detalle: det }
      : r === 'VENCIDA'
        ? { clase: 'bad', titulo: 'Acceso denegado: debe renovar su membresía', detalle: det }
        : r === 'SUSPENDIDA'
          ? { clase: 'warn', titulo: 'Acceso denegado: socio suspendido', detalle: det }
          : { clase: 'mute', titulo: 'Socio no encontrado o sin acceso' };
  }
  private idValido() {
    if (!/^\d+$/.test(this.q.trim()) || +this.q.trim() <= 0) {
      this.errorId.set('Ingrese un ID válido');
      return null;
    }
    this.errorId.set('');
    return this.data.socio(+this.q.trim()) ?? null;
  }
  renovar() {
    const s = this.idValido();
    if (this.errorId()) return;
    const e = s ? this.data.estadoMembresiaSocio(s.id) : null;
    this.res.set(
      !s
        ? { clase: 'mute', titulo: 'Socio no encontrado o sin acceso' }
        : e === 'VENCIDA'
          ? { clase: 'bad', titulo: 'El socio necesita renovar su membresía' }
          : { clase: 'ok', titulo: 'El socio no necesita renovar su membresía' },
    );
  }
  suspendido() {
    const s = this.idValido();
    if (this.errorId()) return;
    const e = s ? this.data.estadoMembresiaSocio(s.id) : null;
    this.res.set(
      !s
        ? { clase: 'mute', titulo: 'Socio no encontrado o sin acceso' }
        : e === 'SUSPENDIDA'
          ? { clase: 'warn', titulo: 'El socio está suspendido' }
          : { clase: 'ok', titulo: 'El socio no está suspendido' },
    );
  }

  permitidas = computed(() => this.data.asistencias().filter((a) => a.resultado === 'PERMITIDO'));
  totalHoy = computed(() => this.permitidas().filter((a) => a.fecha.startsWith(HOY)).length);
  totalMes = computed(
    () => this.permitidas().filter((a) => a.fecha.startsWith(HOY.slice(0, 7))).length,
  );
  top = computed(() => {
    const m = new Map<number, number>();
    this.permitidas().forEach((a) => a.idSocio && m.set(a.idSocio, (m.get(a.idSocio) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
  });
  porDia = computed(() => {
    const c = [0, 0, 0, 0, 0, 0, 0];
    this.permitidas().forEach((a) => {
      const d = new Date(a.fecha.slice(0, 10) + 'T00:00:00').getDay();
      c[(d + 6) % 7]++;
    });
    return c;
  });
  porFranja = computed(() => {
    const c = [0, 0, 0, 0, 0, 0];
    this.permitidas().forEach((a) => {
      const h = +a.fecha.slice(11, 13);
      c[h < 9 ? 0 : h < 12 ? 1 : h < 15 ? 2 : h < 18 ? 3 : h < 21 ? 4 : 5]++;
    });
    return c;
  });
  historial = computed(() => {
    const t = this.socioQ().trim().toLowerCase();
    return this.data
      .asistencias()
      .filter(
        (a) =>
          (!this.desde() || a.fecha.slice(0, 10) >= this.desde()) &&
          (!this.hasta() || a.fecha.slice(0, 10) <= this.hasta()) &&
          (!this.resF() || a.resultado === this.resF()) &&
          (!t ||
            a.codigo.toLowerCase().includes(t) ||
            (a.idSocio ? this.data.nombreSocio(a.idSocio).toLowerCase().includes(t) : false)),
      );
  });
}
