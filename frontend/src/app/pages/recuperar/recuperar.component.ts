import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './recuperar.component.html',
  styleUrl: './recuperar.component.css',
})
export class RecuperarComponent {
  paso = signal(1);
  error = signal('');
  contacto = '';
  codigo = '';
  nueva = '';
  repite = '';
  fuerza = () => [/.{8,}/, /[A-Z]/, /\d/, /[^\w\s]/].filter((r) => r.test(this.nueva)).length;
  paso1() {
    if (!this.contacto.trim()) return this.error.set('Ingresa tu usuario o correo.');
    this.error.set('');
    this.paso.set(2);
  }
  paso2() {
    if (!/^\d{6}$/.test(this.codigo)) return this.error.set('El código debe tener 6 dígitos.');
    this.error.set('');
    this.paso.set(3);
  }
  paso3() {
    if (this.nueva.length < 8)
      return this.error.set('La contraseña debe tener al menos 8 caracteres.');
    if (this.nueva !== this.repite) return this.error.set('Las contraseñas no coinciden.');
    this.error.set('');
    this.paso.set(4);
  }
}
