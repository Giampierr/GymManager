
import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable ,map} from 'rxjs';

import { DataService } from './data.service';
import { Usuario, Rol } from './models';
import { LoginRequest, LoginRespuesta } from './models/auth.models';

// ==========================================
// THEME SERVICE
// ==========================================

@Injectable({ providedIn: 'root' })
export class ThemeService {
  modo = signal<'light' | 'dark'>('light');

  constructor() {
    let g: string | null = null;

    try {
      g = localStorage.getItem('gm-tema');
    } catch {}

    this.aplicar(g === 'dark' ? 'dark' : 'light');
  }

  alternar(): void {
    this.aplicar(this.modo() === 'light' ? 'dark' : 'light');
  }

  private aplicar(m: 'light' | 'dark'): void {
    this.modo.set(m);
    document.documentElement.setAttribute('data-theme', m);

    try {
      localStorage.setItem('gm-tema', m);
    } catch {}
  }
}

// ==========================================
// TOAST SERVICE
// ==========================================

export interface Toast {
  id: number;
  tipo: 'ok' | 'err' | 'warn';
  texto: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  items = signal<Toast[]>([]);
  private n = 0;

  ok(t: string): void {
    this.add('ok', t);
  }

  error(t: string): void {
    this.add('err', t);
  }

  aviso(t: string): void {
    this.add('warn', t);
  }

  private add(tipo: Toast['tipo'], texto: string): void {
    const id = ++this.n;

    this.items.update((l) => [...l, { id, tipo, texto }]);

    setTimeout(() => {
      this.items.update((l) => l.filter((x) => x.id !== id));
    }, 3500);
  }
}

// ==========================================
// AUTH SERVICE
// ==========================================

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private data = inject(DataService);
  private router = inject(Router);

  private readonly API = 'http://127.0.0.1:8000/api/accounts';

  constructor() {
    this.restaurarSesion();
  }

  // ------------------------------------------
  // Restaurar sesión
  // ------------------------------------------

  private restaurarSesion(): void {
    try {
      const usuario = sessionStorage.getItem('gm-user');

      if (usuario) {
        this.data.usuarioActual.set(JSON.parse(usuario) as Usuario);
      }
    } catch {
      sessionStorage.removeItem('gm-user');
    }
  }

  // ------------------------------------------
  // Iniciar sesión contra Django
  // ------------------------------------------

  login(correo: string, password: string): Observable<Usuario> {
  const credenciales: LoginRequest = {
    correo: correo.trim(),
    password: password
  };

  return this.http
    .post<LoginRespuesta>(`${this.API}/login/`, credenciales)
    .pipe(
      map((respuesta) => {
        const usuario = this.convertirUsuario(respuesta);

        this.data.usuarioActual.set(usuario);

        try {
          sessionStorage.setItem(
            'gm-user',
            JSON.stringify(usuario)
          );
        } catch {}

        this.data.log(
          'Asistencias',
          'inicio de sesión',
          'Inicio de sesión'
        );

        return usuario;
      })
    );
}

  // ------------------------------------------
  // Convertir DTO de Django a modelo Angular
  // ------------------------------------------

  private convertirUsuario(respuesta: LoginRespuesta): Usuario {
    const u = respuesta.usuario;

    const roles: Record<string, Rol> = {
      ADMINISTRADOR: 'Administrador',
      RECEPCION: 'Recepción',
      ENTRENADOR: 'Entrenador'
    };

    return {
      id: u.id_usuario,
      usuario: u.correo,
      nombre: u.nombres,
      apellido: u.apellidos,
      correo: u.correo,
      rol: roles[u.rol] ?? 'Administrador',
      activo: u.estado === 'ACTIVO',
      ultimoAcceso: new Date().toISOString()
    };
  }

  // ------------------------------------------
  // Cerrar sesión
  // ------------------------------------------

  logout(): void {
    this.data.log(
      'Asistencias',
      'cierre de sesión',
      'Cierre de sesión'
    );

    this.data.usuarioActual.set(null);

    try {
      sessionStorage.removeItem('gm-user');
    } catch {}

    this.router.navigateByUrl('/login');
  }
}



// ==========================================
// AUTH GUARD
// ==========================================

export const authGuard: CanActivateFn = (route) => {
  // Al inyectar AuthService se restaura la sesión.
  inject(AuthService);

  const d = inject(DataService);
  const r = inject(Router);

  if (!d.usuarioActual()) {
    return r.createUrlTree(['/login']);
  }

  const mod = route.data?.['modulo'] as string | undefined;

  if (mod && !d.puede(mod, 'ver')) {
    return r.createUrlTree(['/sin-permisos']);
  }

  return true;
};



// ==========================================
// USUARIO 
// ==========================================

