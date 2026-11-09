import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, ThemeService } from '../../core/services';
import { DataService } from '../../core/data.service';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, IconComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  auth = inject(AuthService);
  tema = inject(ThemeService);
  router = inject(Router);
  data = inject(DataService);
  usuario = '';
  clave = '';
  ver = signal(false);
  error = signal('');


  cargando = signal(false);

  entrar(): void {
  if (this.cargando()) return;

  this.error.set('');
  this.cargando.set(true);

  this.auth.login(this.usuario, this.clave).subscribe({
    next: () => {
      this.cargando.set(false);
      this.router.navigateByUrl('/resumen');
    },
    error: (err) => {
      this.cargando.set(false);

      if (err.status === 401) {
        this.error.set(
          err.error?.mensaje ?? 'Correo o contraseña incorrectos.'
        );
      } else {
        this.error.set(
          'No se pudo conectar con el servidor.'
        );
      }
    }
  });
}
}
