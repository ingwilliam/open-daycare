# SPEC 04 — Diálogo para agregar niño

> **Estado:** Implementado
> **Depende de:** SPEC 02 (kids-list-and-profile) — reutiliza `Kid`, `KidCard`, `kids.ts` y los estilos/tokens de `/kids`
> **Fecha:** 2026-10-28
> **Objetivo:** Añadir en `/kids` un dialog modal para crear un niño (nombre, fecha de nacimiento y sala obligatorios) que se incorpora en memoria a la lista agrupada por sala.

## Scope

**In:**

- En `/kids`, el botón `Agregar niño` deja de ser placeholder (`href="#"`) y abre un dialog modal.
- Dialog `Agregar niño` que replica `references/pantallas/agregar-nino.dc.html`:
  - Tarjeta centrada, `max-width: 520px`, fondo `#FBF4EC`, borde `#ECE0D0`, radio `24px` y sombra.
  - Cabecera con `Cancelar`, título `Agregar niño` y acción `Guardar`.
  - Solo tres campos: `NOMBRE COMPLETO` (texto), `FECHA DE NACIMIENTO` (`input type="date"`) y `SALA` (`<select>`).
- El select de sala arranca vacío con la opción `Seleccioná una sala` y las salas `Soles` y `Luna`.
- Validación al `Guardar` con mensajes en español:
  - Nombre vacío o solo espacios → `Ingresá el nombre completo.`
  - Fecha vacía → `Ingresá la fecha de nacimiento.`
  - Fecha futura → `Ingresá una fecha válida.`
  - Sala sin elegir → `Seleccioná una sala.`
- Con datos válidos: se crea un `Kid` derivado, se agrega a la lista en memoria de la página y el dialog se cierra.
- Cierre sin guardar con `Cancelar`, `Esc` o clic en el fondo. `Guardar` solo cierra si la validación pasa.
- La lista de `/kids` se agrupa por sala: `SALA SOLES` y `SALA LUNA`, con su contador de niños.
- `SALA LUNA` solo se renderiza cuando tiene al menos un niño; `Soles` conserva su sección.
- El buscador sigue filtrando por nombre a través de todas las salas.
- La tarjeta de un niño recién agregado se muestra, pero no navega (su perfil queda fuera de alcance).
- Nuevo componente `components/kids/AddKidDialog.tsx` y helper puro `app/_lib/createKid.ts`.
- Estado del dialog y de la lista creada en `app/kids/page.tsx` (`useState`).
- Accesibilidad básica: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, foco inicial en el campo de nombre y cierre con `Esc`.
- En viewport chico el dialog ocupa el ancho disponible con márgenes y su contenido puede scrollear.

**Out of scope (para specs futuras):**

- Persistencia en `localStorage`, cookies, base de datos o API.
- Editar o eliminar niños.
- Campos `ALERGIAS` y `NOTAS MÉDICAS` del template.
- Vincular padres y `Resumen del día`.
- Perfil navegable del niño creado en memoria (su tarjeta es estática).
- Backend, autenticación y roles.
- Cambios en las páginas de perfil existentes.

## Data model

Se reutiliza `Kid` de `app/_data/kids.ts`. Se agrega la lista de salas:

```ts
export const ROOMS = ['Soles', 'Luna'] as const;
```

Valores del formulario y errores:

```ts
export interface AddKidFormValues {
  fullName: string;
  birthDate: string; // yyyy-mm-dd (valor de <input type="date">)
  room: string; // "Soles" | "Luna"
}
```

Derivación al crear el `Kid` con `createKid(values, existingIds)`:

- `fullName`: nombre recortado y con espacios colapsados.
- `firstName`: primera palabra; `lastName`: resto (puede quedar vacío).
- `initial`: primera letra del nombre en mayúscula.
- `id`: slug del nombre sin acentos (`martina-lopez`). Si ya existe, se agrega sufijo `-2`, `-3`, etc.
- `age`: años cumplidos desde `birthDate` hasta hoy.
- `birthDate`: fecha de nacimiento formateada como el resto de los datos (`12 mar 2022`).
- `enrollmentDate`: mes y año actuales (`oct 2026`).
- `allergies`: `[]`; `medicalNotes`: `''`; `linkedParents`: `[]`.
- `avatarBg` / `avatarColor`: paleta fija existente, elegida por cantidad de niños.

Convenciones:

- La fecha se parsea manualmente desde `yyyy-mm-dd` para evitar corrimientos por zona horaria.
- El estado creado vive solo en memoria: recargar la página lo descarta.

## Implementation plan

1. Agregar `ROOMS` a `app/_data/kids.ts`.
2. Agregar `AddKidFormValues` y `validateAddKid` a `app/_lib/validation.ts`, incluyendo rechazo de fechas futuras.
3. Crear `app/_lib/createKid.ts` con la derivación del `Kid` y helpers de formato/slug.
4. Crear `components/kids/AddKidDialog.tsx` (cliente) con el formulario, validación, cierre por `Esc`/fondo y estilos del template.
5. Agregar `ChevronDownIcon` a `components/shared/icons.tsx` para el select.
6. Ajustar `components/kids/KidCard.tsx` con una prop `navigable` para renderizar tarjetas estáticas.
7. Actualizar `app/kids/page.tsx`: estado de la lista, botón que abre el dialog, guardado en memoria y agrupación por sala.
8. Verificar con `npm run dev`, Playwright y ejecutar `npm run lint` y `npx tsc --noEmit`.

## Acceptance criteria

- [x] Al cargar `/kids` el dialog no está visible.
- [x] Hacer clic en `Agregar niño` abre el dialog.
- [x] El dialog replica el layout del template: tarjeta `max-width` 520px, cabecera `Cancelar`/`Agregar niño`/`Guardar` y fondo `#FBF4EC`.
- [x] El dialog muestra solo los campos `NOMBRE COMPLETO`, `FECHA DE NACIMIENTO` y `SALA`.
- [x] El select de sala arranca vacío y ofrece `Seleccioná una sala`, `Soles` y `Luna`.
- [x] Guardar con todos los campos vacíos muestra `Ingresá el nombre completo.`, `Ingresá la fecha de nacimiento.` y `Seleccioná una sala.`, sin cerrar el dialog ni agregar niños.
- [x] Guardar con una fecha futura muestra `Ingresá una fecha válida.` y no agrega el niño.
- [x] Guardar con datos válidos cierra el dialog y agrega el niño a la sala elegida.
- [x] El contador de la sección de la sala elegida aumenta en uno.
- [x] La tarjeta del niño nuevo muestra su nombre, inicial, edad calculada y `sin padres vinculados`.
- [x] La tarjeta del niño nuevo no navega al hacer clic.
- [x] `SALA LUNA` aparece solo después de agregar el primer niño en esa sala.
- [x] `Cancelar`, `Esc` y clic en el fondo cierran el dialog sin agregar niños.
- [x] El buscador filtra también a los niños agregados en memoria.
- [x] Recargar `/kids` descarta los niños agregados (sin persistencia).
- [x] `npm run lint` pasa sin errores.
- [x] `npx tsc --noEmit` pasa sin errores.
- [x] No hay errores en la consola del navegador al abrir y guardar en el dialog.

## Decisions

- **Sí:** Alta en memoria sin persistencia. Coherente con la spec 02, que deja backend fuera.
- **Sí:** Salas `Soles` y `Luna`. Pedido explícito del usuario.
- **Sí:** Solo los tres campos obligatorios. El usuario pidió dejar fuera alergias y notas médicas.
- **Sí:** Select de sala vacío por defecto. Hace efectiva la obligatoriedad de la sala.
- **Sí:** Rechazar fechas futuras. Evita edades negativas y datos inválidos.
- **Sí:** `id` derivado del nombre con sufijo ante duplicados. Evita claves repetidas en la lista.
- **Sí:** Edad calculada y `enrollmentDate` con la fecha actual. Mantiene consistencia con los datos mock.
- **Sí:** La tarjeta nueva no navega. El perfil sigue leyendo de `kids.ts` estático; navegar daría 404.
- **Sí:** `SALA LUNA` condicional. Evita secciones vacías.
- **No:** Guardar en `localStorage`. Persistencia no pedida.

## Risks

| Riesgo | Mitigación |
| --- | --- |
| Corrimiento de fecha por zona horaria al parsear `yyyy-mm-dd` | Parsear con `new Date(year, month - 1, day)` y no con `Date.parse`. |
| Nombres repetidos generan `id` duplicado | Sufijo incremental (`-2`, `-3`) contra los ids existentes. |
| Los niños creados se pierden al recargar | Documentado: el alcance es en memoria. |
| Estilos nativos del `<select>` y del date picker difieren entre navegadores | Usar `appearance-none` y chevron propio; validar en Chromium. |

## What is **not** in this spec

- Persistencia de los niños creados.
- Edición o eliminación de niños.
- Alergias y notas médicas en el alta.
- Perfil del niño creado en memoria.
- Vinculación de padres y resumen del día.
- Backend, autenticación y roles.

Cada uno de esos, si llega, va en su propia spec.
