import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [IconComponent],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  @Input() titulo = '';
  @Input() ancho = 640;
  @Output() cerrar = new EventEmitter<void>();
}
