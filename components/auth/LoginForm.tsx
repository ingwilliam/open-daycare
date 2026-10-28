'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FormErrors,
  LoginFormValues,
  validateLogin,
} from '@/app/_lib/validation';

const EMPTY_VALUES: LoginFormValues = { email: '', password: '' };

// Ruta a la que se navega tras un login válido. Sin autenticación real todavía (ver SPEC 03).
const HOME_ROUTE = '/';

// Formulario de inicio de sesión: valida al enviar y, si es válido, navega al feed.
export function LoginForm() {
  const router = useRouter();
  const [values, setValues] = useState<LoginFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors<LoginFormValues>>({});

  // Actualiza un campo sin tocar el otro.
  function handleChange(field: keyof LoginFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  // Valida los campos y navega solo si no hay errores. No envía datos a ningún servidor.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateLogin(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    router.push(HOME_ROUTE);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-[18px]">
        <label
          htmlFor="login-email"
          className="mb-2 block text-xs font-bold tracking-[0.7px] text-[#94887B]"
        >
          EMAIL
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => handleChange('email', event.target.value)}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? 'login-email-error' : undefined}
          className={`w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3.5 text-[15px] text-[#3F362E] ${
            errors.email ? 'border-[#D9583C]' : 'border-[#EADFD0]'
          }`}
        />
        {errors.email && (
          <p id="login-email-error" className="mt-1.5 text-[13px] text-[#C5503A]">
            {errors.email}
          </p>
        )}
      </div>

      <div className="mb-2.5">
        <label
          htmlFor="login-password"
          className="mb-2 block text-xs font-bold tracking-[0.7px] text-[#94887B]"
        >
          CONTRASEÑA
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          onChange={(event) => handleChange('password', event.target.value)}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? 'login-password-error' : undefined}
          className={`w-full rounded-[14px] border-[1.5px] bg-white px-4 py-3.5 text-[15px] text-[#3F362E] ${
            errors.password ? 'border-[#D9583C]' : 'border-[#EADFD0]'
          }`}
        />
        {errors.password && (
          <p
            id="login-password-error"
            className="mt-1.5 text-[13px] text-[#C5503A]"
          >
            {errors.password}
          </p>
        )}
      </div>

      <div className="mb-5 text-right">
        <Link href="#" className="text-[13.5px] font-bold text-[#C5503A]">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      <button
        type="submit"
        className="block w-full cursor-pointer rounded-[15px] bg-linear-to-b from-[#F4977E] to-[#EE8164] px-4 py-[15px] text-center text-base font-extrabold text-white shadow-[0_10px_22px_-8px_rgba(238,129,100,0.7)]"
      >
        Iniciar sesión
      </button>
    </form>
  );
}
