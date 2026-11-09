import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-estado',
  standalone: true,
  templateUrl: './estado-chip.component.html',
})
export class EstadoChipComponent {
  @Input() valor = '';
  clase = () =>
    ['ACTIVA', 'ACTIVO', 'REGISTRADO', 'PERMITIDO', 'RESERVADA'].includes(this.valor)
      ? 'ok'
      : ['VENCIDA', 'INACTIVO', 'ANULADO', 'NO_ENCONTRADO'].includes(this.valor)
        ? 'bad'
        : ['SUSPENDIDA', 'POR VENCER'].includes(this.valor)
          ? 'warn'
          : 'mute';
}
