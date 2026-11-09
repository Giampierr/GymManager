import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bar-chart.component.html',
})
export class BarChartComponent {
  @Input() etiquetas: string[] = [];
  @Input() valores: number[] = [];
  @Input() color = 'var(--accent)';
  @Input() titulo = 'Gráfico de barras';
  W = 600;
  H = 260;
  L = 44;
  B = 28;
  max = () => Math.max(1, ...this.valores);
  nice = () => {
    const m = this.max();
    const p = Math.pow(10, Math.floor(Math.log10(m)));
    return Math.ceil(m / p) * p;
  };
  ticks = () => {
    const n = this.nice();
    return [0, 1, 2, 3, 4].map((i) => Math.round((n / 4) * i));
  };
  y = (v: number) => 12 + (this.H - this.B - 12) * (1 - v / this.nice());
  bw = () => Math.min(56, ((this.W - this.L - 8) / Math.max(1, this.valores.length)) * 0.6);
  x = (i: number) => {
    const s = (this.W - this.L - 8) / Math.max(1, this.valores.length);
    return this.L + s * i + (s - this.bw()) / 2;
  };
}
