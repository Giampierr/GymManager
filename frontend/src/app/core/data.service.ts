import { Injectable, computed, signal } from '@angular/core';
import {
  Asistencia,
  Auditoria,
  Clase,
  Entrenador,
  EstadoMembresia,
  Membresia,
  Pago,
  Plan,
  Reserva,
  Rol,
  Socio,
  Usuario,
  MODULOS,
  ACCIONES,
} from './models';
import { HOY, sumarDias } from './validators';

export type ResultadoAcceso = 'PERMITIDO' | 'VENCIDA' | 'SUSPENDIDA' | 'NO_ENCONTRADO';
const next = (a: { id: number }[]) => Math.max(0, ...a.map((x) => x.id)) + 1;

/**
 * Servicio de datos EN MEMORIA con los datos reales de gimnasia.db.
 * Para conectar con el backend, reemplaza el cuerpo de cada método por llamadas HttpClient
 * (la forma de los modelos ya coincide con las entidades Scala).
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  usuarioActual = signal<Usuario | null>(null);

  planes = signal<Plan[]>([
    { id: 1, nombre: 'Mensual', dias: 30, precio: 100, activo: true },
    { id: 2, nombre: 'Trimestral', dias: 90, precio: 270, activo: true },
    { id: 3, nombre: 'Anual', dias: 365, precio: 900, activo: true },
  ]);

  socios = signal<Socio[]>(
    [
      [
        1,
        'SOC001',
        'Carlos',
        'Ramirez',
        'Dni',
        '12345678',
        '987654321',
        'carlos.ramirez@gmail.com',
        '2026-01-10',
      ],
      [
        2,
        'SOC002',
        'Maria',
        'Torres',
        'Dni',
        '23456781',
        '912345678',
        'maria.torres@gmail.com',
        '2026-01-15',
      ],
      [
        3,
        'SOC003',
        'Jose',
        'Mendoza',
        'Dni',
        '34567812',
        '923456781',
        'jose.mendoza@gmail.com',
        '2026-02-01',
      ],
      [
        4,
        'SOC004',
        'Ana',
        'Castillo',
        'Dni',
        '45678123',
        '934567812',
        'ana.castillo@gmail.com',
        '2026-02-05',
      ],
      [
        5,
        'SOC005',
        'Luis',
        'Fernandez',
        'Dni',
        '56781234',
        '945678123',
        'luis.fernandez@gmail.com',
        '2026-02-12',
      ],
      [
        6,
        'SOC006',
        'Rosa',
        'Vargas',
        'Dni',
        '67812345',
        '956781234',
        'rosa.vargas@gmail.com',
        '2026-02-20',
      ],
      [
        7,
        'SOC007',
        'Miguel',
        'Flores',
        'Dni',
        '78123456',
        '967812345',
        'miguel.flores@gmail.com',
        '2026-03-03',
      ],
      [
        8,
        'SOC008',
        'Lucia',
        'Herrera',
        'Dni',
        '81234567',
        '978123456',
        'lucia.herrera@gmail.com',
        '2026-03-10',
      ],
      [
        9,
        'SOC009',
        'Pedro',
        'Chavez',
        'Dni',
        '89123456',
        '989123456',
        'pedro.chavez@gmail.com',
        '2026-03-15',
      ],
      [
        10,
        'SOC010',
        'Carmen',
        'Rojas',
        'Dni',
        '91234567',
        '991234567',
        'carmen.rojas@gmail.com',
        '2026-03-22',
      ],
      [
        11,
        'SOC011',
        'Diego',
        'Morales',
        'Dni',
        '10234567',
        '912345679',
        'diego.morales@gmail.com',
        '2026-04-01',
      ],
      [
        12,
        'SOC012',
        'Sofia',
        'Castro',
        'Dni',
        '11234567',
        '923456782',
        'sofia.castro@gmail.com',
        '2026-04-08',
      ],
      [
        13,
        'SOC013',
        'Jorge',
        'Medina',
        'Dni',
        '12234567',
        '934567813',
        'jorge.medina@gmail.com',
        '2026-04-15',
      ],
      [
        14,
        'SOC014',
        'Elena',
        'Ruiz',
        'Dni',
        '13234567',
        '945678124',
        'elena.ruiz@gmail.com',
        '2026-05-02',
      ],
      [
        15,
        'SOC015',
        'Andres',
        'Silva',
        'Dni',
        '14234567',
        '956781235',
        'andres.silva@gmail.com',
        '2026-05-10',
      ],
      [
        16,
        'SOC016',
        'Patricia',
        'Leon',
        'CarnetExtranjeria',
        'CE12345678',
        '967812346',
        'patricia.leon@gmail.com',
        '2026-05-18',
      ],
      [
        17,
        'SOC017',
        'Ricardo',
        'Vega',
        'CarnetExtranjeria',
        'CE23456789',
        '978123457',
        'ricardo.vega@gmail.com',
        '2026-06-01',
      ],
      [
        18,
        'SOC018',
        'Daniela',
        'Soto',
        'Dni',
        '15234567',
        '989123457',
        'daniela.soto@gmail.com',
        '2026-06-12',
      ],
      [
        19,
        'SOC019',
        'Fernando',
        'Paredes',
        'Dni',
        '16234567',
        '991234568',
        'fernando.paredes@gmail.com',
        '2026-07-05',
      ],
      [
        20,
        'SOC020',
        'Gabriela',
        'Reyes',
        'Dni',
        '17234567',
        '912345680',
        'gabriela.reyes@gmail.com',
        '2026-08-20',
      ],
    ].map((r) => ({
      id: r[0] as number,
      codigo: r[1] as string,
      nombre: r[2] as string,
      apellido: r[3] as string,
      tipoDocumento: r[4] as any,
      nroDocumento: r[5] as string,
      telefono: r[6] as string,
      email: r[7] as string,
      fechaRegistro: r[8] as string,
      activo: true,
    })),
  );

  membresias = signal<Membresia[]>(
    [
      [1, 1, 1, '2026-10-01', '2026-10-31', 100, 'ACTIVA'],
      [2, 2, 1, '2026-10-05', '2026-11-04', 100, 'ACTIVA'],
      [3, 3, 2, '2026-09-01', '2026-11-30', 270, 'ACTIVA'],
      [4, 4, 2, '2026-07-01', '2026-09-30', 270, 'VENCIDA'],
      [5, 5, 1, '2026-10-10', '2026-11-08', 100, 'ACTIVA'],
      [6, 6, 3, '2026-01-01', '2026-12-31', 900, 'ACTIVA'],
      [7, 7, 1, '2026-08-01', '2026-08-30', 100, 'VENCIDA'],
      [8, 8, 2, '2026-10-12', '2027-01-09', 270, 'ACTIVA'],
      [9, 9, 1, '2026-06-01', '2026-06-30', 100, 'VENCIDA'],
      [10, 10, 1, '2026-09-15', '2026-10-14', 100, 'ACTIVA'],
    ].map((r) => ({
      id: r[0] as number,
      idSocio: r[1] as number,
      idPlan: r[2] as number,
      fechaInicio: r[3] as string,
      fechaFin: r[4] as string,
      precio: r[5] as number,
      estado: r[6] as EstadoMembresia,
    })),
  );

  private metodos = ['Efectivo', 'Tarjeta', 'Yape/Plin', 'Transferencia'];
  pagos = signal<Pago[]>(
    [
      [1, '2026-10-01 09:15', 100],
      [2, '2026-10-05 10:30', 100],
      [3, '2026-09-01 11:00', 270],
      [4, '2026-07-01 14:20', 270],
      [5, '2026-10-10 08:45', 100],
      [6, '2026-01-01 16:00', 900],
      [7, '2026-08-01 12:10', 100],
      [8, '2026-10-11 09:00', 270],
      [9, '2026-06-01 17:30', 100],
      [10, '2026-09-15 13:45', 100],
    ].map((r, i) => ({
      id: r[0] as number,
      fecha: r[1] as string,
      idSocio: i + 1,
      concepto:
        'Membresía ' + ({ 100: 'Mensual', 270: 'Trimestral', 900: 'Anual' } as any)[r[2] as number],
      metodo: this.metodos[i % 4],
      descuento: 0,
      monto: r[2] as number,
      estado: 'REGISTRADO' as const,
    })),
  );

  entrenadores = signal<Entrenador[]>([
    {
      id: 1,
      nombre: 'Marco Salas',
      documento: '40123456',
      telefono: '987111222',
      especialidad: 'Musculación',
      activo: true,
    },
    {
      id: 2,
      nombre: 'Valeria Quispe',
      documento: '41234567',
      telefono: '987222333',
      especialidad: 'Yoga y Pilates',
      activo: true,
    },
    {
      id: 3,
      nombre: 'Renato Paz',
      documento: '42345678',
      telefono: '987333444',
      especialidad: 'Spinning',
      activo: true,
    },
    {
      id: 4,
      nombre: 'Daniel Cruz',
      documento: '43456789',
      telefono: '987444555',
      especialidad: 'Funcional',
      activo: false,
    },
  ]);
  clases = signal<Clase[]>([
    { id: 1, nombre: 'Spinning', idEntrenador: 3, dia: 1, hora: '07:00', sala: 'Sala 1', cupo: 12 },
    { id: 2, nombre: 'Yoga', idEntrenador: 2, dia: 2, hora: '18:00', sala: 'Sala 2', cupo: 10 },
    {
      id: 3,
      nombre: 'Funcional',
      idEntrenador: 4,
      dia: 3,
      hora: '19:00',
      sala: 'Sala 1',
      cupo: 15,
    },
    { id: 4, nombre: 'Pilates', idEntrenador: 2, dia: 4, hora: '08:00', sala: 'Sala 2', cupo: 8 },
    {
      id: 5,
      nombre: 'Musculación guiada',
      idEntrenador: 1,
      dia: 5,
      hora: '17:00',
      sala: 'Sala 3',
      cupo: 6,
    },
    {
      id: 6,
      nombre: 'Spinning noche',
      idEntrenador: 3,
      dia: 2,
      hora: '20:00',
      sala: 'Sala 1',
      cupo: 12,
    },
  ]);
  reservas = signal<Reserva[]>([
    ...[1, 2, 3, 5, 6, 8].map((s, i) => ({
      id: i + 1,
      idClase: 1,
      idSocio: s,
      fecha: '2026-11-02',
      estado: 'RESERVADA' as const,
    })),
    { id: 7, idClase: 5, idSocio: 1, fecha: '2026-11-01', estado: 'RESERVADA' },
    { id: 8, idClase: 5, idSocio: 2, fecha: '2026-11-01', estado: 'RESERVADA' },
    { id: 9, idClase: 5, idSocio: 3, fecha: '2026-11-01', estado: 'RESERVADA' },
    { id: 10, idClase: 5, idSocio: 5, fecha: '2026-11-02', estado: 'RESERVADA' },
    { id: 11, idClase: 5, idSocio: 6, fecha: '2026-11-02', estado: 'RESERVADA' },
    { id: 12, idClase: 5, idSocio: 8, fecha: '2026-11-02', estado: 'RESERVADA' },
    { id: 13, idClase: 2, idSocio: 10, fecha: '2026-10-30', estado: 'ASISTIÓ' },
    { id: 14, idClase: 2, idSocio: 3, fecha: '2026-10-30', estado: 'CANCELADA' },
  ]);
  usuarios = signal<Usuario[]>([
    {
      id: 1,
      usuario: 'admin',
      nombre: 'Carla Mendoza',
      apellido: 'Mendoza',
      correo: 'admin@gymmanager.com',
      password: 'admin123',
      rol: 'Administrador',
      activo: true,
      ultimoAcceso: '2026-11-03 08:02',
    },
    {
      id: 2,
      usuario: 'recepcion',
      nombre: 'Jorge Pérez',
      apellido: 'Pérez',
      correo: 'recepcion@gymmanager.com',
      password: 'recep123',
      rol: 'Recepción',
      activo: true,
      ultimoAcceso: '2026-11-02 17:40',
    },
    {
      id: 3,
      usuario: 'entrenador',
      nombre: 'Marco Salas',
      apellido: 'Salas',
      correo: 'notengo@gymmanager.com',
      password: 'entre123',
      rol: 'Entrenador',
      activo: true,
      ultimoAcceso: '2026-11-01 19:15',
    },
    {
      id: 4,
      usuario: 'ex.admin',
      nombre: 'Luis Ortiz',
      apellido: 'Ortiz',
      correo: 'ex.admin@gymmanager.com',
      password: 'x',
      rol: 'Recepción',
      activo: false,
      ultimoAcceso: '2026-08-20 10:00',
    },
  ]);
  permisos = signal<Record<string, Record<string, string[]>>>(this.permisosIniciales());
  auditoria = signal<Auditoria[]>([
    {
      id: 1,
      fecha: '2026-11-02 17:40',
      usuario: 'recepcion',
      rol: 'Recepción',
      modulo: 'Pagos',
      accion: 'crear',
      detalle: 'Pago #8 registrado (S/ 270.00)',
    },
    {
      id: 2,
      fecha: '2026-11-02 17:35',
      usuario: 'recepcion',
      rol: 'Recepción',
      modulo: 'Asistencias',
      accion: 'inicio de sesión',
      detalle: 'Inicio de sesión',
    },
    {
      id: 3,
      fecha: '2026-11-01 11:20',
      usuario: 'admin',
      rol: 'Administrador',
      modulo: 'Membresías',
      accion: 'modificar',
      detalle: 'Membresía #8 contratada para SOC008',
    },
    {
      id: 4,
      fecha: '2026-10-28 09:05',
      usuario: 'admin',
      rol: 'Administrador',
      modulo: 'Usuarios',
      accion: 'desactivar',
      detalle: 'Usuario ex.admin desactivado',
    },
  ]);
  asistencias = signal<Asistencia[]>(this.generarAsistencias());

  // ---------- derivados ----------
  sociosActivos = computed(() => this.socios().filter((s) => s.activo));
  membresiasActivas = computed(() => this.membresias().filter((m) => m.estado === 'ACTIVA'));
  pagosValidos = computed(() => this.pagos().filter((p) => p.estado === 'REGISTRADO'));
  totalRecaudado = computed(() => this.pagosValidos().reduce((a, p) => a + p.monto, 0));
  promedioPagos = computed(() =>
    this.pagosValidos().length ? this.totalRecaudado() / this.pagosValidos().length : 0,
  );
  mayorPago = computed(() =>
    this.pagosValidos().reduce<Pago | null>((m, p) => (!m || p.monto > m.monto ? p : m), null),
  );
  recaudadoPorMes = computed(() => {
    const m = new Map<string, number>();
    this.pagosValidos().forEach((p) => {
      const k = p.fecha.slice(0, 7);
      m.set(k, (m.get(k) ?? 0) + p.monto);
    });
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  });
  porVencer = computed(() =>
    this.membresiasActivas().filter((m) => m.fechaFin >= HOY && m.fechaFin <= sumarDias(HOY, 7)),
  );

  socio = (id: number) => this.socios().find((s) => s.id === id);
  nombreSocio = (id: number) => {
    const s = this.socio(id);
    return s ? `${s.nombre} ${s.apellido}` : '—';
  };
  plan = (id: number) => this.planes().find((p) => p.id === id);
  entrenador = (id: number) => this.entrenadores().find((e) => e.id === id);
  clase = (id: number) => this.clases().find((c) => c.id === id);
  reservasActivas = (idClase: number) =>
    this.reservas().filter((r) => r.idClase === idClase && r.estado === 'RESERVADA');

  // ---------- permisos por rol (RNF03) ----------
  puede(modulo: string, accion: string): boolean {
    const u = this.usuarioActual();
    if (!u) return false;
    return (this.permisos()[u.rol]?.[modulo] ?? []).includes(accion);
  }
  private permisosIniciales() {
    const todo = (r: string[]) => Object.fromEntries(MODULOS.map((m) => [m, r]));
    const rec: Record<string, string[]> = {
      ...todo(['ver', 'crear', 'editar', 'desactivar']),
      Usuarios: [],
      Auditoría: [],
      Resumen: ['ver'],
    };
    const ent: Record<string, string[]> = {
      ...todo([]),
      Resumen: ['ver'],
      Asistencias: ['ver'],
      Reservas: ['ver'],
      Entrenadores: ['ver'],
    };
    return { Administrador: todo([...ACCIONES]), Recepción: rec, Entrenador: ent };
  }
  togglePermiso(rol: Rol, modulo: string, accion: string) {
    this.permisos.update((p) => {
      const c = structuredClone(p);
      const l = c[rol][modulo] ?? (c[rol][modulo] = []);
      const i = l.indexOf(accion);
      i >= 0 ? l.splice(i, 1) : l.push(accion);
      return c;
    });
    this.log('Usuarios', 'modificar', `Permiso ${accion} de ${rol} en ${modulo}`);
  }

  // ---------- auditoría (RNF04) ----------
  log(modulo: string, accion: string, detalle: string) {
    const u = this.usuarioActual();
    this.auditoria.update((a) => [
      {
        id: next(a),
        fecha: `${HOY} ${new Date().toTimeString().slice(0, 5)}`,
        usuario: u?.usuario ?? '—',
        rol: u?.rol ?? '—',
        modulo,
        accion,
        detalle,
      },
      ...a,
    ]);
  }

  // ---------- RF02 socios ----------
  guardarSocio(s: Omit<Socio, 'id' | 'activo'> & { id?: number }) {
    if (s.id) {
      this.socios.update((l) => l.map((x) => (x.id === s.id ? ({ ...x, ...s } as Socio) : x)));
      this.log('Socios', 'modificar', `Socio ${s.codigo} modificado`);
    } else {
      this.socios.update((l) => [...l, { ...s, id: next(l), activo: true } as Socio]);
      this.log('Socios', 'crear', `Socio ${s.codigo} registrado`);
    }
  }
  toggleSocio(id: number) {
    const s = this.socio(id)!;
    this.socios.update((l) => l.map((x) => (x.id === id ? { ...x, activo: !x.activo } : x)));
    this.log(
      'Socios',
      'desactivar',
      `Socio ${s.codigo} ${s.activo ? 'desactivado' : 'reactivado'}`,
    );
  }
  eliminarSocio(id: number) {
    const s = this.socio(id)!;
    this.socios.update((l) => l.filter((x) => x.id !== id));
    this.log('Socios', 'desactivar', `Socio ${s.codigo} eliminado`);
  }

  // ---------- RF03 planes y membresías ----------
  nuevoPlan(nombre: string, dias: number, precio: number) {
    this.planes.update((l) => [...l, { id: next(l), nombre, dias, precio, activo: true }]);
    this.log('Membresías', 'crear', `Plan ${nombre} creado`);
  }
  cambiarPrecioPlan(id: number, precio: number) {
    this.planes.update((l) => l.map((p) => (p.id === id ? { ...p, precio } : p)));
    this.log('Membresías', 'modificar', `Precio del plan #${id} cambiado a ${precio}`);
  }
  contratar(idSocio: number, idPlan: number, inicio: string) {
    const p = this.plan(idPlan)!;
    this.membresias.update((l) => [
      ...l,
      {
        id: next(l),
        idSocio,
        idPlan,
        fechaInicio: inicio,
        fechaFin: sumarDias(inicio, p.dias - 1),
        precio: p.precio,
        estado: 'ACTIVA',
      },
    ]);
    this.log(
      'Membresías',
      'crear',
      `Membresía ${p.nombre} contratada para ${this.socio(idSocio)?.codigo}`,
    );
  }
  renovar(id: number) {
    const m = this.membresias().find((x) => x.id === id)!;
    const p = this.plan(m.idPlan)!;
    const ini = m.fechaFin > HOY ? sumarDias(m.fechaFin, 1) : HOY;
    this.membresias.update((l) =>
      l.map((x) =>
        x.id === id
          ? {
              ...x,
              fechaInicio: ini,
              fechaFin: sumarDias(ini, p.dias - 1),
              precio: p.precio,
              estado: 'ACTIVA',
            }
          : x,
      ),
    );
    this.log('Membresías', 'modificar', `Membresía #${id} renovada`);
  }
  suspender(id: number, motivo: string) {
    this.membresias.update((l) => l.map((x) => (x.id === id ? { ...x, estado: 'SUSPENDIDA' } : x)));
    this.log('Membresías', 'desactivar', `Membresía #${id} suspendida: ${motivo}`);
  }
  eliminarMembresia(id: number) {
    this.membresias.update((l) => l.filter((x) => x.id !== id));
    this.log('Membresías', 'desactivar', `Membresía #${id} eliminada`);
  }

  // ---------- RF04 pagos ----------
  registrarPago(
    idSocio: number,
    concepto: string,
    metodo: string,
    monto: number,
    descuento: number,
  ) {
    const total = Math.max(0, monto - descuento);
    const id = next(this.pagos());
    this.pagos.update((l) => [
      ...l,
      {
        id,
        fecha: `${HOY} ${new Date().toTimeString().slice(0, 5)}`,
        idSocio,
        concepto,
        metodo,
        descuento,
        monto: total,
        estado: 'REGISTRADO',
      },
    ]);
    this.log('Pagos', 'crear', `Pago #${id} registrado (S/ ${total.toFixed(2)})`);
  }
  anularPago(id: number, motivo: string) {
    this.pagos.update((l) =>
      l.map((p) => (p.id === id ? { ...p, estado: 'ANULADO', motivoAnulacion: motivo } : p)),
    );
    this.log('Pagos', 'anular', `Pago #${id} anulado: ${motivo}`);
  }

  // ---------- RF05 acceso (reglas Prolog: vigente / vencida / suspendida) ----------
  buscarSocio(q: string): Socio | undefined {
    const t = q.trim().toLowerCase();
    if (!t) return undefined;
    return this.socios().find(
      (s) =>
        String(s.id) === t || s.codigo.toLowerCase() === t || s.nroDocumento.toLowerCase() === t,
    );
  }
  estadoMembresiaSocio(idSocio: number): EstadoMembresia | null {
    const ms = this.membresias().filter((m) => m.idSocio === idSocio);
    if (!ms.length) return null;
    return (
      ms.find((m) => m.estado === 'ACTIVA') ??
      ms.find((m) => m.estado === 'SUSPENDIDA') ??
      ms[ms.length - 1]
    ).estado;
  }
  validarAcceso(q: string, registrar = true): { socio?: Socio; resultado: ResultadoAcceso } {
    const s = this.buscarSocio(q);
    let resultado: ResultadoAcceso = 'NO_ENCONTRADO';
    if (s && s.activo) {
      const e = this.estadoMembresiaSocio(s.id);
      resultado = e === 'ACTIVA' ? 'PERMITIDO' : e === 'SUSPENDIDA' ? 'SUSPENDIDA' : 'VENCIDA';
    }
    if (registrar)
      this.asistencias.update((l) => [
        {
          id: next(l),
          fecha: `${HOY} ${new Date().toTimeString().slice(0, 5)}`,
          idSocio: s?.id ?? null,
          codigo: s?.codigo ?? q,
          resultado,
        },
        ...l,
      ]);
    return { socio: s, resultado };
  }

  // ---------- RF06 entrenadores ----------
  guardarEntrenador(e: Omit<Entrenador, 'id' | 'activo'> & { id?: number }) {
    if (e.id) {
      this.entrenadores.update((l) =>
        l.map((x) => (x.id === e.id ? ({ ...x, ...e } as Entrenador) : x)),
      );
      this.log('Entrenadores', 'modificar', `Entrenador ${e.nombre} modificado`);
    } else {
      this.entrenadores.update((l) => [...l, { ...e, id: next(l), activo: true } as Entrenador]);
      this.log('Entrenadores', 'crear', `Entrenador ${e.nombre} registrado`);
    }
  }
  toggleEntrenador(id: number) {
    const e = this.entrenador(id)!;
    this.entrenadores.update((l) => l.map((x) => (x.id === id ? { ...x, activo: !x.activo } : x)));
    this.log(
      'Entrenadores',
      'desactivar',
      `Entrenador ${e.nombre} ${e.activo ? 'desactivado' : 'activado'}`,
    );
  }
  cruceHorario(idEntrenador: number, claseIds: number[]): string | null {
    const sel = this.clases().filter((c) => claseIds.includes(c.id));
    const otras = this.clases().filter(
      (c) => c.idEntrenador === idEntrenador && !claseIds.includes(c.id),
    );
    for (const a of sel) {
      for (const b of [...sel.filter((x) => x.id !== a.id), ...otras])
        if (a.dia === b.dia && a.hora === b.hora)
          return `${a.nombre} y ${b.nombre} coinciden (${DIAS[a.dia]} ${a.hora})`;
    }
    return null;
  }
  asignarClases(idEntrenador: number, claseIds: number[]) {
    this.clases.update((l) => l.map((c) => (claseIds.includes(c.id) ? { ...c, idEntrenador } : c)));
    this.log(
      'Entrenadores',
      'modificar',
      `Clases asignadas a ${this.entrenador(idEntrenador)?.nombre}`,
    );
  }

  // ---------- RF07 clases y reservas ----------
  guardarClase(c: Omit<Clase, 'id'> & { id?: number }) {
    if (c.id)
      this.clases.update((l) => l.map((x) => (x.id === c.id ? ({ ...x, ...c } as Clase) : x)));
    else this.clases.update((l) => [...l, { ...c, id: next(l) } as Clase]);
    this.log(
      'Reservas',
      c.id ? 'modificar' : 'crear',
      `Clase ${c.nombre} ${c.id ? 'modificada' : 'creada'}`,
    );
  }
  reservar(idClase: number, idSocio: number): string | null {
    const c = this.clase(idClase)!;
    if (this.estadoMembresiaSocio(idSocio) !== 'ACTIVA')
      return 'El socio no tiene una membresía activa.';
    if (this.reservasActivas(idClase).some((r) => r.idSocio === idSocio))
      return 'El socio ya tiene una reserva en esta clase.';
    if (this.reservasActivas(idClase).length >= c.cupo)
      return 'La clase está llena. No hay cupos disponibles.';
    this.reservas.update((l) => [
      ...l,
      { id: next(l), idClase, idSocio, fecha: HOY, estado: 'RESERVADA' },
    ]);
    this.log('Reservas', 'crear', `Reserva de ${this.socio(idSocio)?.codigo} en ${c.nombre}`);
    return null;
  }
  cancelarReserva(id: number) {
    this.reservas.update((l) => l.map((r) => (r.id === id ? { ...r, estado: 'CANCELADA' } : r)));
    this.log('Reservas', 'desactivar', `Reserva #${id} cancelada`);
  }

  // ---------- RF01 usuarios ----------
  guardarUsuario(u: Omit<Usuario, 'id' | 'activo' | 'ultimoAcceso'> & { id?: number }) {
    if (u.id)
      this.usuarios.update((l) =>
        l.map((x) =>
          x.id === u.id
            ? {
                ...x,
                usuario: u.usuario,
                nombre: u.nombre,
                rol: u.rol,
                ...(u.password ? { password: u.password } : {}),
              }
            : x,
        ),
      );
    else
      this.usuarios.update((l) => [
        ...l,
        { ...u, id: next(l), activo: true, ultimoAcceso: '—' } as Usuario,
      ]);
    this.log(
      'Usuarios',
      u.id ? 'modificar' : 'crear',
      `Usuario ${u.usuario} ${u.id ? 'modificado' : 'creado'}`,
    );
  }
  toggleUsuario(id: number) {
    const u = this.usuarios().find((x) => x.id === id)!;
    this.usuarios.update((l) => l.map((x) => (x.id === id ? { ...x, activo: !x.activo } : x)));
    this.log(
      'Usuarios',
      'desactivar',
      `Usuario ${u.usuario} ${u.activo ? 'desactivado' : 'activado'}`,
    );
  }
  restablecer(id: number) {
    const u = this.usuarios().find((x) => x.id === id)!;
    this.log('Usuarios', 'modificar', `Contraseña de ${u.usuario} restablecida`);
  }

  private generarAsistencias(): Asistencia[] {
    const act = [1, 2, 3, 5, 6, 8, 10];
    const out: Asistencia[] = [];
    let seed = 7;
    const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    let id = 1;
    for (let d = 20; d >= 0; d--) {
      const fecha = sumarDias(HOY, -d);
      const n = 3 + Math.floor(rnd() * 4);
      for (let i = 0; i < n; i++) {
        const h = 6 + Math.floor(rnd() * 15);
        const m = Math.floor(rnd() * 60);
        const sid = act[Math.floor(rnd() * act.length)];
        const r = rnd();
        const res: Asistencia['resultado'] =
          r < 0.86 ? 'PERMITIDO' : r < 0.94 ? 'VENCIDA' : 'NO_ENCONTRADO';
        out.push({
          id: id++,
          fecha: `${fecha} ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
          idSocio: res === 'NO_ENCONTRADO' ? null : sid,
          codigo: res === 'NO_ENCONTRADO' ? 'SOC999' : 'SOC' + String(sid).padStart(3, '0'),
          resultado: res,
        });
      }
    }
    return out.reverse();
  }
}
export const DIAS = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
