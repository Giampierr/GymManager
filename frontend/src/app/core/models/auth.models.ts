export interface LoginRespuesta {
  codigo: string;
  mensaje: string;
  usuario: {
    id_usuario: number;
    rol: string;
    nombres: string;
    apellidos: string;
    correo: string;
    estado: string;
  };
}

export interface LoginRequest {
  correo: string;
  password: string;
}

export interface UsuarioRespuesta {
  id_usuario: number;
  rol: string;
  nombres: string;
  apellidos: string;
  correo: string;
  estado: string;
}