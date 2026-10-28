'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { mockInvitation } from '@/app/_data/invitations';
import {
  ActivateAccountFormValues,
  FormErrors,
  validateActivateAccount,
} from '@/app/_lib/validation';
import { PhotoConsentCheckbox } from '@/components/auth/PhotoConsentCheckbox';

// Destino tras activar la cuenta. Queda como placeholder hasta tener la pantalla de familia (ver SPEC 03).
const ACTIVATED_ROUTE = '#';

// Valores iniciales: código y email vienen de la invitación; la contraseña se crea desde cero.
const INITIAL_VALUES: ActivateAccountFormValues = {
  invitationCode: mockInvitation.code,
  email: mockInvitation.parentEmail,
  password: '',
  photoConsent: true,
};

// Formulario de activación: valida al enviar y, si es válido, navega al destino placeholder.
export function ActivateAccountForm() {
  const router = useRouter();
  const [values, setValues] = useState<ActivateAccountFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors<ActivateAccountFormValues>>({});

  // Actualiza un campo sin tocar los demás.
  function handleChange<K extends keyof ActivateAccountFormValues>(
    field: K,
    value: ActivateAccountFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  // Valida los campos contra el código de la invitación y navega solo si no hay errores.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateActivateAccount(values, mockInvitation.code);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    router.push(ACTIVATED_ROUTE);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label
        htmlFor="activate-code"
        className="mb-2 block text-xs font-bold tracking-[0.7px] text-[#94887B]"
      >
        CÓDIGO DE INVITACIÓN
      </label>
      <input
        id="activate-code"
        type="text"
        autoComplete="off"
        value={values.invitationCode}
        onChange={(event) => handleChange('invitationCode', event.target.value)}
        aria-invalid={errors.invitationCode ? true : undefined}
        aria-describedby={errors.invitationCode ? 'activate-code-error' : undefined}
        className={`font-head mb-1.5 w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3.5 text-lg font-bold tracking-[3px] text-ink ${
          errors.invitationCode ? 'border-accent' : 'border-line'
        }`}
      />
      {errors.invitationCode && (
        <p id="activate-code-error" className="mb-4.5 text-[13px] text-[#C5503A]">
          {errors.invitationCode}
        </p>
      )}

      <label
        htmlFor="activate-email"
        className="mb-2 block text-xs font-bold tracking-[0.7px] text-[#94887B]"
      >
        EMAIL
      </label>
      <input
        id="activate-email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={(event) => handleChange('email', event.target.value)}
        aria-invalid={errors.email ? true : undefined}
        aria-describedby={errors.email ? 'activate-email-error' : undefined}
        className={`mb-1.5 w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3.5 text-[15px] text-ink ${
          errors.email ? 'border-accent' : 'border-line'
        }`}
      />
      {errors.email && (
        <p id="activate-email-error" className="mb-4.5 text-[13px] text-[#C5503A]">
          {errors.email}
        </p>
      )}

      <label
        htmlFor="activate-password"
        className="mb-2 block text-xs font-bold tracking-[0.7px] text-[#94887B]"
      >
        CREAR CONTRASEÑA
      </label>
      <input
        id="activate-password"
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        value={values.password}
        onChange={(event) => handleChange('password', event.target.value)}
        aria-invalid={errors.password ? true : undefined}
        aria-describedby={errors.password ? 'activate-password-error' : undefined}
        className={`mb-1.5 w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3.5 text-[15px] text-ink ${
          errors.password ? 'border-accent' : 'border-[#F2A78E]'
        }`}
      />
      {errors.password && (
        <p id="activate-password-error" className="mb-4.5 text-[13px] text-[#C5503A]">
          {errors.password}
        </p>
      )}

      <div className="mt-4" />
      <PhotoConsentCheckbox
        checked={values.photoConsent}
        onChange={(checked) => handleChange('photoConsent', checked)}
      />

      <button
        type="submit"
        className="block w-full cursor-pointer rounded-[15px] bg-linear-to-b from-[#F4977E] to-[#EE8164] px-4 py-[15px] text-center text-base font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)]"
      >
        Activar mi cuenta
      </button>
    </form>
  );
}
