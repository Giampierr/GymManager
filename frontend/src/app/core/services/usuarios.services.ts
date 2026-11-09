
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UsuarioRespuesta } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private http = inject(HttpClient);

  private readonly API =
    'http://127.0.0.1:8000/api/accounts/usuarios/';

  listar(): Observable<UsuarioRespuesta[]> {
    return this.http.get<UsuarioRespuesta[]>(this.API);
  }

  // Aquí agregaremos:
  // crear()
  // actualizar()
  // cambiarEstado()
  // restablecerPassword()
}
