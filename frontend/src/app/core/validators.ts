import { TipoDocumento } from './models';
// Mismas reglas que util/Validador.scala del backend.
export const validarDni = (v: string) => /^\d{8}$/.test(v);
export const validarCarnet = (v: string) => /^[A-Za-z0-9]{9,15}$/.test(v);
export const validarDocumento = (t: TipoDocumento, v: string) =>
  t === 'Dni' ? validarDni(v) : validarCarnet(v);
export const validarTelefono = (v: string) => /^9\d{8}$/.test(v);
export const validarCorreo = (v: string) => /^[\w.-]+@[\w.-]+\.\w+$/.test(v);
export const HOY = '2026-11-03';
export const hoyISO = () => HOY;
export const esFutura = (f: string) => f > HOY;
export const sumarDias = (iso: string, d: number) => {
  const x = new Date(iso + 'T00:00:00');
  x.setDate(x.getDate() + d);
  return x.toISOString().slice(0, 10);
};
export const soles = (n: number) =>
  'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const solesInt = (n: number) => 'S/ ' + n.toLocaleString('en-US');
export const fechaCorta = (iso: string) => {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}/${m}/${y}`;
};
