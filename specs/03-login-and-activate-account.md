# SPEC 03 — Login y activación de cuenta (calco de login.dc.html + activar-cuenta.dc.html)

> **Estado:** Implementado
> **Depende de:** Spec 01 (home-feed) — reutiliza `icons.tsx`, tokens CSS y fuentes; Spec 02 (kids-list-and-profile) — reutiliza `app/_data/kids.ts` para el niño invitado
> **Fecha:** 2026-10-28
> **Objetivo:** Implementar las pantallas `/login` y `/activate-account` como calco visual de `login.dc.html` y `activar-cuenta.dc.html`, con validación de formularios en frontend y sin autenticación real, eliminando el selector Personal/Familia del login.

## Scope

**In:**

- Página `/login` en `app/login/page.tsx` que replica `references/pantallas/login.dc.html`:
  - Panel izquierdo decorativo (gradiente cálido, círculos translúcidos, logo `OpenDayCare`, h1 `El día de cada niño,<br>compartido con su familia.`, párrafo descriptivo y pie `Guardería Sala Soles`).
  - Panel derecho con h2 `Iniciar sesión`, subtítulo `Ingresá para ver el día de hoy.`, campos `EMAIL` y `CONTRASEÑA`, link `¿Olvidaste tu contraseña?` y botón `Iniciar sesión`.
  - Link inferior `¿Te invitó la guardería? Activá tu cuenta` → `/activate-account`.
  - **Sin** selector `INGRESO COMO` (Personal / Familia): se elimina del template.
- Página `/activate-account` en `app/activate-account/page.tsx` que replica `references/pantallas/activar-cuenta.dc.html`:
  - Columna única centrada, sin panel decorativo.
  - Icono de sol en caja degradada, h1 `Bienvenida a OpenDayCare`, párrafo introductorio.
  - Tarjeta del niño invitado con avatar `M`, texto `Te invitaron a seguir a` y `Mateo · Sala Soles`.
  - Campos `CÓDIGO DE INVITACIÓN`, `EMAIL`, `CREAR CONTRASEÑA`.
  - Checkbox de autorización de fotos con el texto del template.
  - Botón `Activar mi cuenta`.
  - Link inferior `¿Ya tenés cuenta? Iniciar sesión` → `/login`.
- Validación frontend en español para ambos formularios (ver Implementation plan, paso 1).
- Responsive: en `< md` se oculta el panel decorativo del login y solo queda el formulario.
- Componentes en `components/auth/` y helper de validación en `app/_lib/validation.ts`.
- Datos mock de invitación en `app/_data/invitations.ts`.

**Out of scope (para specs futuras):**

- Autenticación real, sesiones, cookies, roles o redirección según rol.
- Recuperación de contraseña: el link `¿Olvidaste tu contraseña?` queda como placeholder (`href="#"`).
- Validación del código de invitación contra backend. El código es un valor mock.
- Página `familia-feed.dc.html` (destino original de `Activar mi cuenta`).
- Persistencia de cualquier dato del formulario (`localStorage`, cookies, base de datos).
- Envío real de emails de invitación.
- Pantallas de crear o vincular niños (`agregar-nino`, `vincular-padre`).
- Mensajes de error de servidor (credenciales incorrectas, código expirado): no hay servidor.

## Data model

Datos mock en `app/_data/invitations.ts`. No hay persistencia.

```ts
// Invitation sent by the daycare to a parent. Mock data until the backend exists.
export interface Invitation {
  code: string; // "7K4P9"
  kidId: string; // "mateo-fernandez" → resuelto con getKidById() de app/_data/kids.ts
  parentEmail: string; // "lucia.fernandez@gmail.com"
}

export const mockInvitation: Invitation = {
  code: '7K4P9',
  kidId: 'mateo-fernandez',
  parentEmail: 'lucia.fernandez@gmail.com',
};
```

Formularios (estado local con `useState`, no se guardan):

```ts
// Shape of the form state kept in useState, not persisted.
export interface LoginFormValues {
  email: string;
  password: string;
}

export interface ActivateAccountFormValues {
  invitationCode: string;
  email: string;
  password: string;
  photoConsent: boolean;
}

// Validation result: field name → message in Spanish. Empty object means valid.
export type FormErrors<T> = Partial<Record<keyof T, string>>;
```

Convenciones:

- Los campos de `/login` arrancan vacíos. El template precargaba `caro@opendaycare.com`; no se replica.
- `/activate-account` arranca con `invitationCode` y `email` precargados desde `mockInvitation`, y `password` vacío (el template traía `contraseña` precargada; no se replica).
- Los `href` de `¿Olvidaste tu contraseña?` y de la navegación a `familia-feed` quedan como `#` o como se indica en el plan.

## Implementation plan

1. **Helper de validación.** Crear `app/_lib/validation.ts` con funciones puras: `validateLogin(values): FormErrors<LoginFormValues>` y `validateActivateAccount(values): FormErrors<ActivateAccountFormValues>`. Reglas:
   - Email obligatorio y con formato válido. Mensaje: `Ingresá un email válido.`
   - Contraseña obligatoria en login. Mensaje: `Ingresá tu contraseña.`
   - Contraseña de activación con mínimo 8 caracteres. Mensaje: `La contraseña debe tener al menos 8 caracteres.`
   - Código de invitación obligatorio. Mensaje: `Ingresá el código de invitación.`
   - Código de invitación debe coincidir con `mockInvitation.code` (sin distinguir mayúsculas). Mensaje: `El código no es válido.`
   _Prueba: funciones puras, verificables con `npx tsc --noEmit` y llamadas desde un componente temporal, sin dejar código de prueba._

2. **Datos de invitación.** Crear `app/_data/invitations.ts` con `Invitation` y `mockInvitation`. _Prueba: importar desde `app/activate-account/page.tsx` sin romper._

3. **Panel decorativo.** Crear `components/auth/BrandPanel.tsx` con el gradiente, círculos, logo, h1, párrafo y pie. Reutiliza el icono de sol de `components/shared/icons.tsx`. Oculto en `< md`. _Prueba: renderizado estático en `/login`._

4. **Formulario de login.** Crear `components/auth/LoginForm.tsx` (cliente) con inputs controlados, errores bajo cada campo y submit que valida y, si es válido, navega a `/` con `useRouter().push`. _Prueba: enviar vacío muestra los mensajes; enviar con datos válidos llega a `/`._

5. **Página `/login`.** Crear `app/login/page.tsx` con layout de dos columnas (`BrandPanel` + columna del formulario con h2, subtítulo, `LoginForm`, link `¿Olvidaste tu contraseña?` y link a `/activate-account`). _Prueba: comparar contra `references/pantallas/login.dc.html` sin el selector de rol._

6. **Tarjeta de invitación.** Crear `components/auth/InvitedKidCard.tsx` que recibe un `Kid` (vía `getKidById(mockInvitation.kidId)`) y muestra avatar con inicial, `Te invitaron a seguir a` y `nombre · sala`. _Prueba: muestra `Mateo · Sala Soles`._

7. **Checkbox de fotos.** Crear `components/auth/PhotoConsentCheckbox.tsx` con el estilo del template (caja verde con check cuando está activo). Es un `<input type="checkbox">` real dentro de `<label>` para accesibilidad. _Prueba: alterna el estado al hacer click en el texto._

8. **Formulario de activación.** Crear `components/auth/ActivateAccountForm.tsx` (cliente) con inputs controlados, los campos `CÓDIGO DE INVITACIÓN` (precargado), `EMAIL` (precargado), `CREAR CONTRASEÑA` (vacío), `PhotoConsentCheckbox` (marcado por defecto) y el botón `Activar mi cuenta`. Submit valida y, si es válido, navega a `#` (placeholder). _Prueba: contraseña corta muestra error; código incorrecto muestra error._

9. **Página `/activate-account`.** Crear `app/activate-account/page.tsx` con columna única centrada: icono, h1, párrafo, `InvitedKidCard`, `ActivateAccountForm` y link `¿Ya tenés cuenta? Iniciar sesión` → `/login`. _Prueba: comparar contra `references/pantallas/activar-cuenta.dc.html`._

10. **Verificación final.** `npm run dev`, revisar `/login` y `/activate-account` en desktop y mobile contra las referencias y `references/screenshots/`. Ejecutar `npm run lint` y `npx tsc --noEmit`.

## Acceptance criteria

- [x] `http://localhost:3000/login` renderiza el panel decorativo y el formulario con el texto del template.
- [x] `/login` no muestra el selector `INGRESO COMO`, ni los botones Personal o Familia.
- [x] Los campos de `/login` arrancan vacíos.
- [x] Enviar `/login` con campos vacíos muestra `Ingresá un email válido.` y `Ingresá tu contraseña.` y no navega.
- [x] Enviar `/login` con email válido y contraseña no vacía navega a `/`.
- [x] El link `Activá tu cuenta` de `/login` navega a `/activate-account`.
- [x] En viewport `< md`, `/login` oculta el panel decorativo y muestra solo el formulario.
- [x] `http://localhost:3000/activate-account` renderiza la tarjeta `Mateo · Sala Soles` con avatar `M`.
- [x] `/activate-account` muestra `7K4P9` y `lucia.fernandez@gmail.com` precargados.
- [x] El campo `CREAR CONTRASEÑA` de `/activate-account` arranca vacío.
- [x] Enviar `/activate-account` con contraseña de menos de 8 caracteres muestra `La contraseña debe tener al menos 8 caracteres.`
- [x] Enviar `/activate-account` con un código distinto de `7K4P9` muestra `El código no es válido.`
- [x] El checkbox de autorización de fotos arranca marcado y su estado alterna al hacer click en el texto.
- [x] Enviar `/activate-account` con datos válidos no falla ni muestra errores (navega a `#`).
- [x] El link `Iniciar sesión` de `/activate-account` navega a `/login`.
- [x] Ningún formulario guarda datos en `localStorage`, cookies o red.
- [x] `npm run lint` pasa sin errores.
- [x] `npx tsc --noEmit` pasa sin errores.
- [x] No hay errores en la consola del navegador al cargar ambas páginas.

## Decisions

- **Sí:** Rutas `/login` y `/activate-account` en inglés en la ruta, UI en español. Igual que `/kids` (spec 02).
- **Sí:** Eliminar el selector Personal/Familia del login. Lo pidió el usuario; el rol se resolverá en una spec de autenticación.
- **Sí:** `Iniciar sesión` redirige a `/`. Es el único destino existente; el feed de staff no depende de rol todavía.
- **No:** Decidir el destino por el email ingresado. Implica lógica de roles que no existe.
- **Sí:** Validación frontend con mensajes en español. Cumple con validar entradas sin inventar autenticación.
- **No:** Guardar sesión o datos en `localStorage`. Es persistencia no pedida.
- **Sí:** `Activar mi cuenta` navega a `#` como placeholder. `familia-feed` queda fuera de alcance.
- **Sí:** Reutilizar `app/_data/kids.ts` para el niño invitado. Evita duplicar datos de Mateo.
- **Sí:** Código de invitación mock en `app/_data/invitations.ts`, con validación contra ese valor. Permite probar el error sin backend.
- **No:** Dejar credenciales o contraseñas precargadas. El template las trae como ejemplo; no se replican.
- **Supuesto a confirmar:** Contraseña de activación con mínimo 8 caracteres. El template no lo define.
- **Supuesto a confirmar:** Checkbox de fotos marcado por defecto y no obligatorio. Sigue el template; la autorización es opcional.
- **Supuesto a confirmar:** Panel decorativo oculto en mobile. Sigue la convención de la spec 01 (breakpoint `md`).

## Risks

| Riesgo                                                                 | Mitigación                                                                                                |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Validación de email en frontend acepta direcciones inválidas por RFC   | Usar una regex simple y explícita; la validación real llegará con backend.                                |
| El código mock `7K4P9` queda en producción                             | Está aislado en `app/_data/invitations.ts`; se reemplaza al conectar backend.                             |
| El redirect a `/` desde login puede confundirse con autenticación real | Documentado en Scope y Decisions; la spec de auth lo reemplazará.                                         |
| Inputs controlados con `type="password"` y autofill del navegador      | Usar `autoComplete="current-password"` y `autoComplete="new-password"` según corresponda.                 |

## What is **not** in this spec

- Autenticación real, sesiones y roles.
- Recuperación de contraseña.
- Validación de código de invitación contra backend.
- Página `familia-feed` y flujo posterior a la activación.
- Persistencia de datos del formulario.
- Envío de emails.
- Pantallas `agregar-nino` y `vincular-padre`.

Cada uno de esos, si llega, va en su propia spec.
