// Modelos del frontend. Los campos de Socio, Membresía, Pago y Administración
// siguen las case classes del backend Scala (modelo/*.scala).
export type TipoDocumento = 'Dni' | 'CarnetExtranjeria';
export type EstadoMembresia = 'ACTIVA' | 'VENCIDA' | 'SUSPENDIDA' | 'CANCELADA';
export type Rol = 'Administrador' | 'Recepción' | 'Entrenador';

export interface Socio {
  id: number;
  codigo: string;
  nombre: string;
  apellido: string;
  tipoDocumento: TipoDocumento;
  nroDocumento: string;
  telefono: string;
  email: string;
  fechaRegistro: string;
  activo: boolean;
}
export interface Plan {
  id: number;
  nombre: string;
  dias: number;
  precio: number;
  activo: boolean;
}
export interface Membresia {
  id: number;
  idSocio: number;
  idPlan: number;
  fechaInicio: string;
  fechaFin: string;
  precio: number;
  estado: EstadoMembresia;
}
export interface Pago {
  id: number;
  fecha: string;
  idSocio: number;
  concepto: string;
  metodo: string;
  descuento: number;
  monto: number;
  estado: 'REGISTRADO' | 'ANULADO';
  motivoAnulacion?: string;
}
export interface Asistencia {
  id: number;
  fecha: string;
  idSocio: number | null;
  codigo: string;
  resultado: 'PERMITIDO' | 'VENCIDA' | 'SUSPENDIDA' | 'NO_ENCONTRADO';
}
export interface Entrenador {
  id: number;
  nombre: string;
  documento: string;
  telefono: string;
  especialidad: string;
  activo: boolean;
}
export interface Clase {
  id: number;
  nombre: string;
  idEntrenador: number;
  dia: number;
  hora: string;
  sala: string;
  cupo: number;
}
export interface Reserva {
  id: number;
  idClase: number;
  idSocio: number;
  fecha: string;
  estado: 'RESERVADA' | 'CANCELADA' | 'ASISTIÓ';
}


export interface Usuario {
  id: number;
  usuario: string;
  nombre: string;
  correo: string;
  apellido: string;
  password?: string;
  rol: Rol;
  activo: boolean;
  ultimoAcceso: string;
}


export interface Auditoria {
  id: number;
  fecha: string;
  usuario: string;
  rol: string;
  modulo: string;
  accion: string;
  detalle: string;
}
export const MODULOS = [
  'Resumen',
  'Socios',
  'Membresías',
  'Pagos',
  'Asistencias',
  'Reservas',
  'Entrenadores',
  'Usuarios',
  'Auditoría',
] as const;
export const ACCIONES = ['ver', 'crear', 'editar', 'desactivar', 'anular'] as const;
