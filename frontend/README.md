# GYM MANAGER · FORMA Gym Club (frontend Angular)

Frontend web del proyecto LdPProyecto (Scala + Prolog + SQLite). Angular 20, componentes *standalone*, sin librerías de UI externas.
Diseño en **modo claro y oscuro** (botón en la barra superior; se recuerda la elección).

## Cómo ejecutarlo
Requisitos: Node.js 20 o superior.

```bash
npm install
npm start          # abre http://localhost:4200
npm run build      # genera dist/ para producción
```

## Usuarios de demostración
| Usuario | Contraseña | Rol |
|---|---|---|
| admin | admin123 | Administrador (todo) |
| recepcion | recep123 | Recepción (sin usuarios ni auditoría, no puede anular pagos) |
| entrenador | entre123 | Entrenador (solo consulta Resumen, Asistencias, Reservas y Entrenadores) |

## Qué incluye (según la lista de requerimientos)
- **RF01** Login, recuperación de contraseña (3 pasos), cierre de sesión, usuarios, roles y permisos, registro de auditoría.
- **RF02** Socios: registrar, consultar (todos los filtros de `SocioServicio`), editar, desactivar/reactivar, eliminar y ficha.
- **RF03** Planes (crear, modificar precio) y membresías (contratar, renovar, suspender, consultar, eliminar).
- **RF04** Pagos: registrar con método y descuento, filtros de `PagoServicio`, resumen, gráfico y anulación con motivo (solo roles autorizados).
- **RF05** Asistencias: validar ingreso (reglas de acceso), historial y estadísticas.
- **RF06** Entrenadores: registrar, editar, activar/desactivar y asignar clases (detecta cruces de horario).
- **RF07** Clases grupales: calendario, cupos, reservas, cancelación e historial.
- **RF08** Dashboard administrativo (cambia según el rol).
- **RNF**: permisos por rol, errores genéricos, confirmaciones en operaciones críticas, validaciones iguales a `Validador.scala`, diseño responsive.

## Datos y conexión con el backend
Por ahora todo funciona con **datos en memoria** (se reinician al recargar) tomados de `gimnasia.db`.
Para conectar con el backend, reemplaza el cuerpo de los métodos de `src/app/core/data.service.ts` por llamadas `HttpClient`;
los modelos (`src/app/core/models.ts`) siguen las case classes de Scala.
Lo que el backend actual **no** tiene todavía y habrá que crear: roles/usuarios con contraseñas cifradas (jbcrypt), planes,
asistencias, entrenadores, clases/reservas, auditoría, anulación de pagos y edición de registros.

## Estructura
Cada componente tiene su propia carpeta con tres archivos: lógica (`.ts`), vista (`.html`) y estilos (`.css`, si los necesita).
```
src/app/
├── app.ts · app.html · app.routes.ts · app.config.ts
├── core/                     modelos, validadores, DataService (datos de ejemplo), tema, login y guard
├── layout/
│   └── shell/                barra lateral y barra superior
├── shared/                   componentes reutilizables
│   ├── icon/  modal/  confirm/  bar-chart/  donut/  estado-chip/
└── pages/                    una carpeta por pantalla
    ├── login/  recuperar/  not-found/  sin-permisos/
    ├── resumen/  socios/  membresias/  pagos/
    ├── asistencias/  reservas/  entrenadores/
    └── usuarios/  auditoria/
src/styles.css                variables de color claro/oscuro y estilos globales
```
Ejemplo: `pages/socios/socios.component.ts` (lógica), `socios.component.html` (vista) y, si hubiera, `socios.component.css`.
