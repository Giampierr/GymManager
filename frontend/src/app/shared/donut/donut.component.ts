import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-donut',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donut.component.html',
})
export class DonutComponent {
  @Input() items: { label: string; value: number; color: string }[] = [];
  @Input() centro = 'total';
  total = () => this.items.reduce((a, i) => a + i.value, 0);
  segs = () => {
    let acc = 0;
    const t = this.total() || 1;
    return this.items.map((i) => {
      const p = (i.value / t) * 100;
      const s = { ...i, dash: `${p} ${100 - p}`, off: -acc };
      acc += p;
      return s;
    });
  };
}
