import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DataService } from '../../core/data.service';
import { AuthService, ThemeService } from '../../core/services';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.css',
})
export class ShellComponent {
  router = inject(Router);
  data = inject(DataService);
  auth = inject(AuthService);
  tema = inject(ThemeService);
  abierto = signal(false);
  menuUser = signal(false);
  grupos = [
    {
      titulo: 'OPERACIÓN',
      items: [
        { texto: 'Resumen', ruta: '/resumen', icono: 'dashboard', modulo: 'Resumen' },
        { texto: 'Socios', ruta: '/socios', icono: 'users', modulo: 'Socios' },
        { texto: 'Planes y membresías', ruta: '/membresias', icono: 'card', modulo: 'Membresías' },
        { texto: 'Pagos', ruta: '/pagos', icono: 'cash', modulo: 'Pagos' },
        { texto: 'Asistencias', ruta: '/asistencias', icono: 'door', modulo: 'Asistencias' },
        { texto: 'Clases y reservas', ruta: '/reservas', icono: 'calendar', modulo: 'Reservas' },
        { texto: 'Entrenadores', ruta: '/entrenadores', icono: 'dumbbell', modulo: 'Entrenadores' },
      ],
    },
    {
      titulo: 'ADMINISTRACIÓN',
      items: [
        { texto: 'Usuarios y roles', ruta: '/usuarios', icono: 'shield', modulo: 'Usuarios' },
        { texto: 'Registro de auditoría', ruta: '/auditoria', icono: 'log', modulo: 'Auditoría' },
      ],
    },
  ];
  visibles(g: { items: { texto: string; ruta: string; icono: string; modulo: string }[] }) {
    return g.items.filter((i) => this.data.puede(i.modulo, 'ver'));
  }
  iniciales() {
    const n = this.data.usuarioActual()?.nombre ?? '?';
    return n
      .split(' ')
      .map((x) => x[0])
      .slice(0, 2)
      .join('');
  }
  titulo() {
    const f = this.grupos.flatMap((g) => g.items).find((i) => this.router.url.startsWith(i.ruta));
    return f?.texto ?? 'Resumen';
  }
}
