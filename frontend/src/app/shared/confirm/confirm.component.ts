import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [ModalComponent],
  templateUrl: './confirm.component.html',
})
export class ConfirmComponent {
  @Input() titulo = 'Confirmar';
  @Input() mensaje = '';
  @Input() textoConfirmar = 'Confirmar';
  @Input() peligro = true;
  @Input() deshabilitado = false;
  @Output() confirmar = new EventEmitter<void>();
  @Output() cancelar = new EventEmitter<void>();
}
