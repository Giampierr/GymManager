import { Routes } from '@angular/router';
import { authGuard } from './core/services';
import { ShellComponent } from './layout/shell/shell.component';
import { LoginComponent } from './pages/login/login.component';
import { RecuperarComponent } from './pages/recuperar/recuperar.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SinPermisosComponent } from './pages/sin-permisos/sin-permisos.component';

const p = (m: string) => ({ canActivate: [authGuard], data: { modulo: m } });
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recuperar', component: RecuperarComponent },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'resumen' },
      {
        path: 'resumen',
        ...p('Resumen'),
        loadComponent: () =>
          import('./pages/resumen/resumen.component').then((m) => m.ResumenComponent),
      },
      {
        path: 'socios',
        ...p('Socios'),
        loadComponent: () =>
          import('./pages/socios/socios.component').then((m) => m.SociosComponent),
      },
      {
        path: 'membresias',
        ...p('Membresías'),
        loadComponent: () =>
          import('./pages/membresias/membresias.component').then((m) => m.MembresiasComponent),
      },
      {
        path: 'pagos',
        ...p('Pagos'),
        loadComponent: () => import('./pages/pagos/pagos.component').then((m) => m.PagosComponent),
      },
      {
        path: 'asistencias',
        ...p('Asistencias'),
        loadComponent: () =>
          import('./pages/asistencias/asistencias.component').then((m) => m.AsistenciasComponent),
      },
      {
        path: 'reservas',
        ...p('Reservas'),
        loadComponent: () =>
          import('./pages/reservas/reservas.component').then((m) => m.ReservasComponent),
      },
      {
        path: 'entrenadores',
        ...p('Entrenadores'),
        loadComponent: () =>
          import('./pages/entrenadores/entrenadores.component').then(
            (m) => m.EntrenadoresComponent,
          ),
      },
      {
        path: 'usuarios',
        ...p('Usuarios'),
        loadComponent: () =>
          import('./pages/usuarios/usuarios.component').then((m) => m.UsuariosComponent),
      },
      {
        path: 'auditoria',
        ...p('Auditoría'),
        loadComponent: () =>
          import('./pages/auditoria/auditoria.component').then((m) => m.AuditoriaComponent),
      },
      { path: 'sin-permisos', component: SinPermisosComponent },
      { path: '**', component: NotFoundComponent },
    ],
  },
  { path: '**', redirectTo: 'login' },
];
