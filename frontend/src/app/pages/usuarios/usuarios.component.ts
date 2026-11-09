import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { DataService } from '../../core/data.service';
import { ACCIONES, MODULOS, Rol, Usuario } from '../../core/models';
import { UsuarioRespuesta } from '../../core/models/auth.models';

import { ToastService } from '../../core/services';
import { UsuariosService } from '../../core/services/usuarios.services';

import { IconComponent } from '../../shared/icon/icon.component';
import { ModalComponent } from '../../shared/modal/modal.component';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';
import { EstadoChipComponent } from '../../shared/estado-chip/estado-chip.component';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [FormsModule, ModalComponent, ConfirmComponent, EstadoChipComponent, IconComponent],
  templateUrl: './usuarios.component.html',
})


export class UsuariosComponent implements OnInit {

  // ==========================================
  // DEPENDENCIAS
  // ==========================================

  data = inject(DataService);
  toast = inject(ToastService);
  usuariosService = inject(UsuariosService);

  // ==========================================
  // ESTADO DE LA VISTA
  // ==========================================

  usuarios = signal<UsuarioRespuesta[]>([]);
  cargando = signal(false);
  error = signal('');

  roles: Rol[] = [
    'Administrador',
    'Recepción',
    'Entrenador'
  ];

  modulos = MODULOS;
  acciones = ACCIONES;

  tab = signal<'u' | 'r'>('u');

  // ==========================================
  // ESTADO DE MODALES Y FORMULARIOS
  // ==========================================

  form = signal<Partial<Usuario> | null>(null);
  intento = signal(false);
  ver = signal(false);

  aToggle = signal<Usuario | null>(null);
  aReset = signal<Usuario | null>(null);

  // ==========================================
  // PERMISOS
  // ==========================================

  tiene = (r: Rol, m: string, a: string) =>
    (this.data.permisos()[r]?.[m] ?? []).includes(a);

  // ==========================================
  // VALIDACIONES
  // ==========================================

  fuerza = (v: string) =>
    [/.{8,}/, /[A-Z]/, /\d/, /[^\w\s]/]
      .filter((x) => x.test(v)).length;

  // ==========================================
  // CICLO DE VIDA
  // ==========================================

  ngOnInit(): void {
    this.listarUsuarios();
  }

  // ==========================================
  // LISTAR USUARIOS DESDE DJANGO
  // ==========================================

  listarUsuarios(): void {
    this.cargando.set(true);
    this.error.set('');

    this.usuariosService.listar().subscribe({
      next: (respuesta) => {
        this.usuarios.set(respuesta);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al listar usuarios:', err);

        this.error.set('No se pudieron cargar los usuarios.');
        this.cargando.set(false);

        this.toast.error('Error al cargar los usuarios.');
      }
    });
  }

  // ==========================================
  // CREAR USUARIO
  // ==========================================

  nuevo(): void {
    this.intento.set(false);
    this.ver.set(false);

    this.form.set({
      usuario: '',
      nombre: '',
      apellido: '',
      correo: '',
      rol: 'Recepción',
      password: ''
    });
  }

  // ==========================================
  // EDITAR USUARIO
  // ==========================================

  editar(u: Usuario): void {
    this.intento.set(false);
    this.ver.set(false);

    this.form.set({
      ...u,
      password: ''
    });
  }

  // ==========================================
  // GUARDAR USUARIO
  // ==========================================

  guardar(): void {
    this.intento.set(true);

    // Pendiente: conectar POST y PUT con Django.
  }

  // ==========================================
  // ACTIVAR / DESACTIVAR USUARIO
  // ==========================================

  toggle(u: Usuario): void {
    // Pendiente: conectar PATCH con Django.
  }

  // ==========================================
  // RESTABLECER CONTRASEÑA
  // ==========================================

  reset(u: Usuario): void {
    // Pendiente: implementar recuperación de contraseña.
  }

  // ==========================================
  // ROLES Y PERMISOS
  // ==========================================

  // Aquí conservaremos la lógica de permisos y su futura
  // conexión con Django.



  comoUsuario(u: UsuarioRespuesta): Usuario {
  const roles: Record<string, Rol> = {
    ADMINISTRADOR: 'Administrador',
    RECEPCION: 'Recepción',
    ENTRENADOR: 'Entrenador'
  };

  return {
    id: u.id_usuario,
    usuario: u.correo.split('@')[0],
    nombre: u.nombres,
    apellido: u.apellidos,
    correo: u.correo,
    password: '',
    rol: roles[u.rol] ?? 'Recepción',
    activo: u.estado === 'ACTIVO',
    ultimoAcceso: '—'
  };
}
}
