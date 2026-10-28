import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getKidById } from '@/app/_data/kids';
import { mockInvitation } from '@/app/_data/invitations';
import { ActivateAccountForm } from '@/components/auth/ActivateAccountForm';
import { InvitedKidCard } from '@/components/auth/InvitedKidCard';
import { SunIcon } from '@/components/shared/icons';

// Pantalla de activación de cuenta: muestra al niño invitado y el formulario para crear la contraseña.
// Si la invitación apunta a un niño inexistente, responde 404 en lugar de mostrar datos incompletos.
export default function ActivateAccountPage() {
  const invitedKid = getKidById(mockInvitation.kidId);

  if (!invitedKid) {
    notFound();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas-warm p-10">
      <div className="w-full max-w-110">
        <div className="mb-5.5 flex size-14.5 items-center justify-center rounded-[18px] bg-linear-to-br from-[#F8C3A8] to-[#F2937A] shadow-[0_12px_26px_-10px_rgba(238,129,100,0.65)]">
          <SunIcon width={30} height={30} />
        </div>

        <h1 className="font-head mb-2 text-[32px] leading-[1.15] font-semibold text-ink">
          Bienvenida a OpenDayCare
        </h1>
        <p className="mb-6.5 text-[15.5px] leading-[1.55] text-[#94887B]">
          Te invitaron a seguir el día de tu hijo. Creá tu contraseña para activar la cuenta.
        </p>

        <InvitedKidCard kid={invitedKid} />

        <ActivateAccountForm />

        <p className="mt-5.5 text-center text-[14.5px] text-[#94887B]">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="font-extrabold text-[#C5503A]">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
