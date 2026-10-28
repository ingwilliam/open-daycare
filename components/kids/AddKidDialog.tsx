'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { ROOMS } from '@/app/_data/kids';
import {
  AddKidFormValues,
  FormErrors,
  validateAddKid,
} from '@/app/_lib/validation';
import { ChevronDownIcon } from '@/components/shared/icons';

interface AddKidDialogProps {
  onClose: () => void;
  onSave: (values: AddKidFormValues) => void;
}

const EMPTY_VALUES: AddKidFormValues = {
  fullName: '',
  birthDate: '',
  room: '',
};

// Dialog modal para dar de alta un niño con los tres campos obligatorios.
// Se monta solo cuando está abierto, así el formulario arranca limpio cada vez.
export function AddKidDialog({ onClose, onSave }: AddKidDialogProps) {
  const [values, setValues] = useState<AddKidFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FormErrors<AddKidFormValues>>({});
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Al montarse se enfoca el primer campo.
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Mientras el dialog está abierto: cerrar con Esc y bloquear el scroll del fondo.
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Actualiza un campo sin tocar los demás.
  function handleChange(field: keyof AddKidFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  // Valida y solo entrega los valores si no hay errores.
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateAddKid(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSave(values);
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-6 md:p-10"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-kid-title"
        onSubmit={handleSubmit}
        noValidate
        className="w-full max-w-[520px] overflow-hidden rounded-[24px] border border-line bg-[#FBF4EC] shadow-[0_20px_50px_-24px_rgba(63,54,46,0.35)]"
      >
        <div className="flex items-center justify-between border-b border-line px-[26px] py-5">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-[15px] font-bold text-[#94887B]"
          >
            Cancelar
          </button>
          <span
            id="add-kid-title"
            className="font-head text-[18px] font-semibold text-ink"
          >
            Agregar niño
          </span>
          <button
            type="submit"
            className="cursor-pointer text-[15px] font-extrabold text-accent"
          >
            Guardar
          </button>
        </div>

        <div className="px-[26px] py-6">
          <div className="mb-[18px]">
            <label
              htmlFor="add-kid-name"
              className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]"
            >
              NOMBRE COMPLETO
            </label>
            <input
              ref={nameInputRef}
              id="add-kid-name"
              type="text"
              placeholder="Ej. Martina López"
              value={values.fullName}
              onChange={(event) => handleChange('fullName', event.target.value)}
              aria-invalid={errors.fullName ? true : undefined}
              aria-describedby={errors.fullName ? 'add-kid-name-error' : undefined}
              className={`w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-ink focus:outline-none ${
                errors.fullName ? 'border-accent' : 'border-[#EADFD0]'
              }`}
            />
            {errors.fullName && (
              <p
                id="add-kid-name-error"
                className="mt-1.5 text-[13px] text-[#C5503A]"
              >
                {errors.fullName}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3.5 sm:flex-row">
            <div className="flex-1">
              <label
                htmlFor="add-kid-birthdate"
                className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]"
              >
                FECHA DE NACIMIENTO
              </label>
              <input
                id="add-kid-birthdate"
                type="date"
                value={values.birthDate}
                onChange={(event) =>
                  handleChange('birthDate', event.target.value)
                }
                aria-invalid={errors.birthDate ? true : undefined}
                aria-describedby={
                  errors.birthDate ? 'add-kid-birthdate-error' : undefined
                }
                className={`w-full rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] text-ink focus:outline-none ${
                  errors.birthDate ? 'border-accent' : 'border-[#EADFD0]'
                }`}
              />
              {errors.birthDate && (
                <p
                  id="add-kid-birthdate-error"
                  className="mt-1.5 text-[13px] text-[#C5503A]"
                >
                  {errors.birthDate}
                </p>
              )}
            </div>

            <div className="flex-1">
              <label
                htmlFor="add-kid-room"
                className="mb-2 block text-[12px] font-extrabold tracking-[0.7px] text-[#94887B]"
              >
                SALA
              </label>
              <div className="relative">
                <select
                  id="add-kid-room"
                  value={values.room}
                  onChange={(event) => handleChange('room', event.target.value)}
                  aria-invalid={errors.room ? true : undefined}
                  aria-describedby={errors.room ? 'add-kid-room-error' : undefined}
                  className={`w-full appearance-none rounded-[14px] border-[1.5px] bg-white px-4 py-[13px] text-[15px] font-bold text-ink focus:outline-none ${
                    errors.room ? 'border-accent' : 'border-[#EADFD0]'
                  }`}
                >
                  <option value="" disabled>
                    Seleccioná una sala
                  </option>
                  {ROOMS.map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2 text-[#B0A290]" />
              </div>
              {errors.room && (
                <p
                  id="add-kid-room-error"
                  className="mt-1.5 text-[13px] text-[#C5503A]"
                >
                  {errors.room}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
