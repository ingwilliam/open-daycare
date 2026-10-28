// Derivation of a Kid from the "add kid" dialog values. Data lives only in memory (see SPEC 04).

import type { Kid } from '@/app/_data/kids';

export interface NewKidValues {
  fullName: string;
  birthDate: string; // yyyy-mm-dd
  room: string;
}

const MONTHS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

// Paleta de avatares existente, reutilizada para no introducir colores nuevos.
const AVATAR_PALETTE = [
  { bg: '#B9DEC4', color: '#3E8B62' },
  { bg: '#F4DC8E', color: '#9A7B1E' },
  { bg: '#C9B6E8', color: '#7B5FC0' },
  { bg: '#F4B8CC', color: '#C44A7A' },
  { bg: '#A9D9E8', color: '#1F7A93' },
];

/**
 * Crea un `Kid` a partir de los valores del dialog de alta.
 *
 * @param values - Nombre, fecha de nacimiento (`yyyy-mm-dd`) y sala elegida.
 * @param existingIds - Ids ya presentes en la lista, para generar un id único.
 * @returns El niño derivado, listo para agregar a la lista en memoria.
 */
export function createKid(values: NewKidValues, existingIds: string[]): Kid {
  const fullName = collapseSpaces(values.fullName);
  const [firstName, ...rest] = fullName.split(' ');
  const lastName = rest.join(' ');
  const birth = parseDate(values.birthDate);
  const avatar = AVATAR_PALETTE[existingIds.length % AVATAR_PALETTE.length];

  return {
    id: buildUniqueId(fullName, existingIds),
    firstName,
    lastName,
    fullName,
    initial: firstName.charAt(0).toUpperCase(),
    age: calculateAge(birth),
    room: values.room,
    birthDate: formatBirthDate(birth),
    enrollmentDate: formatMonthYear(new Date()),
    allergies: [],
    medicalNotes: '',
    linkedParents: [],
    avatarBg: avatar.bg,
    avatarColor: avatar.color,
  };
}

/**
 * Colapsa espacios repetidos y recorta los extremos.
 *
 * @param value - Texto original.
 * @returns Texto con espacios simples.
 */
function collapseSpaces(value: string): string {
  return value.trim().replace(/\s+/g, ' ');
}

/**
 * Convierte `yyyy-mm-dd` en una fecha local.
 *
 * @param value - Fecha en formato `yyyy-mm-dd`.
 * @returns Fecha a medianoche local.
 */
function parseDate(value: string): Date {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Calcula los años cumplidos hasta hoy.
 *
 * @param birth - Fecha de nacimiento.
 * @returns Edad en años.
 */
function calculateAge(birth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age;
}

/**
 * Formatea una fecha como el resto de los datos mock (`12 mar 2022`).
 *
 * @param date - Fecha a formatear.
 * @returns Fecha abreviada en español.
 */
function formatBirthDate(date: Date): string {
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Formatea una fecha como mes y año (`oct 2026`).
 *
 * @param date - Fecha a formatear.
 * @returns Mes abreviado y año.
 */
function formatMonthYear(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/**
 * Genera un slug único a partir del nombre completo.
 *
 * @param fullName - Nombre completo del niño.
 * @param existingIds - Ids ya usados.
 * @returns Slug en minúsculas, sin acentos y sin repetir.
 */
function buildUniqueId(fullName: string, existingIds: string[]): string {
  const base = slugify(fullName);

  if (!existingIds.includes(base)) {
    return base;
  }

  let suffix = 2;
  while (existingIds.includes(`${base}-${suffix}`)) {
    suffix += 1;
  }

  return `${base}-${suffix}`;
}

/**
 * Convierte un texto en slug (minúsculas, sin acentos, separado por guiones).
 *
 * @param value - Texto original.
 * @returns Slug listo para usar como id.
 */
function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
