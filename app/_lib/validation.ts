// Form value shapes and validation rules for the auth screens (login and account activation).
// Values are kept in component state and never persisted (see SPEC 03).

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

export interface AddKidFormValues {
  fullName: string;
  birthDate: string; // yyyy-mm-dd (valor de <input type="date">)
  room: string;
}

// Field name → message in Spanish. An empty object means the form is valid.
export type FormErrors<T> = Partial<Record<keyof T, string>>;

const MIN_PASSWORD_LENGTH = 8;

// Simple shape check (something@something.tld). Real validation happens in the backend later.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida el formulario de inicio de sesión.
 *
 * @param values - Valores actuales de los campos `email` y `password`.
 * @returns Errores por campo; objeto vacío si el formulario es válido.
 */
export function validateLogin(
  values: LoginFormValues,
): FormErrors<LoginFormValues> {
  const errors: FormErrors<LoginFormValues> = {};

  // Paso 1: email obligatorio y con formato válido.
  if (!isValidEmail(values.email)) {
    errors.email = 'Ingresá un email válido.';
  }

  // Paso 2: contraseña obligatoria. No se valida su longitud en login,
  // porque la regla de longitud aplica solo a la creación de contraseña.
  if (values.password.trim() === '') {
    errors.password = 'Ingresá tu contraseña.';
  }

  return errors;
}

/**
 * Valida el formulario de activación de cuenta.
 *
 * @param values - Valores actuales del formulario de activación.
 * @param expectedInvitationCode - Código de invitación válido contra el que se compara
 *   (en la app viene de `mockInvitation.code`). Se recibe por parámetro para mantener la función pura.
 * @returns Errores por campo; objeto vacío si el formulario es válido.
 */
export function validateActivateAccount(
  values: ActivateAccountFormValues,
  expectedInvitationCode: string,
): FormErrors<ActivateAccountFormValues> {
  const errors: FormErrors<ActivateAccountFormValues> = {};
  const code = values.invitationCode.trim();

  // Paso 1: el código es obligatorio y debe coincidir sin distinguir mayúsculas.
  if (code === '') {
    errors.invitationCode = 'Ingresá el código de invitación.';
  } else if (code.toUpperCase() !== expectedInvitationCode.toUpperCase()) {
    errors.invitationCode = 'El código no es válido.';
  }

  // Paso 2: email obligatorio y con formato válido.
  if (!isValidEmail(values.email)) {
    errors.email = 'Ingresá un email válido.';
  }

  // Paso 3: la contraseña nueva debe tener al menos 8 caracteres.
  if (values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  return errors;
}

/**
 * Valida el formulario de alta de niño.
 *
 * Solo nombre, fecha de nacimiento y sala son obligatorios. La fecha tampoco
 * puede ser futura, para evitar edades negativas en la lista.
 *
 * @param values - Valores actuales del formulario.
 * @returns Errores por campo; objeto vacío si el formulario es válido.
 */
export function validateAddKid(
  values: AddKidFormValues,
): FormErrors<AddKidFormValues> {
  const errors: FormErrors<AddKidFormValues> = {};

  // Paso 1: el nombre es obligatorio y no puede ser solo espacios.
  if (values.fullName.trim() === '') {
    errors.fullName = 'Ingresá el nombre completo.';
  }

  // Paso 2: la fecha es obligatoria, debe ser parseable y no puede ser futura.
  if (values.birthDate.trim() === '') {
    errors.birthDate = 'Ingresá la fecha de nacimiento.';
  } else if (isFutureDate(values.birthDate)) {
    errors.birthDate = 'Ingresá una fecha válida.';
  }

  // Paso 3: la sala es obligatoria.
  if (values.room.trim() === '') {
    errors.room = 'Seleccioná una sala.';
  }

  return errors;
}

/**
 * Indica si el texto tiene formato de email, ignorando espacios laterales.
 *
 * @param email - Texto ingresado por el usuario.
 * @returns `true` si cumple el formato básico de email.
 */
function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

/**
 * Indica si una fecha `yyyy-mm-dd` es posterior a hoy.
 *
 * @param value - Fecha en formato `yyyy-mm-dd`.
 * @returns `true` si la fecha es futura o no se puede parsear.
 */
function isFutureDate(value: string): boolean {
  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return false;
  }

  // Se construye en hora local para evitar corrimientos de zona horaria.
  const date = new Date(year, month - 1, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return date.getTime() > today.getTime();
}
