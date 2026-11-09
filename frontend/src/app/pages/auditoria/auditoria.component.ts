import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../core/data.service';
import { MODULOS } from '../../core/models';

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './auditoria.component.html',
})
export class AuditoriaComponent {
  data = inject(DataService);
  modulos = MODULOS;
  acciones = ['crear', 'modificar', 'desactivar', 'anular', 'inicio de sesión', 'cierre de sesión'];
  u = signal('');
  m = signal('');
  a = signal('');
  d = signal('');
  h = signal('');
  lista = computed(() =>
    this.data
      .auditoria()
      .filter(
        (x) =>
          (!this.u() || x.usuario.toLowerCase().includes(this.u().toLowerCase())) &&
          (!this.m() || x.modulo === this.m()) &&
          (!this.a() || x.accion === this.a()) &&
          (!this.d() || x.fecha.slice(0, 10) >= this.d()) &&
          (!this.h() || x.fecha.slice(0, 10) <= this.h()),
      ),
  );
}
