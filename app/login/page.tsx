import Link from 'next/link';
import { BrandPanel } from '@/components/auth/BrandPanel';
import { LoginForm } from '@/components/auth/LoginForm';

// Pantalla de inicio de sesión: panel de marca (solo desktop) y formulario.
export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-canvas-warm md:grid-cols-[1.05fr_1fr]">
      <BrandPanel />

      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-98">
          <h2 className="font-head mb-1.5 text-[30px] font-semibold text-ink">
            Iniciar sesión
          </h2>
          <p className="mb-7 text-[15px] text-[#94887B]">
            Ingresá para ver el día de hoy.
          </p>

          <LoginForm />

          <p className="mt-6 text-center text-[14.5px] text-[#94887B]">
            ¿Te invitó la guardería?{' '}
            <Link
              href="/activate-account"
              className="font-extrabold text-[#C5503A]"
            >
              Activá tu cuenta
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
