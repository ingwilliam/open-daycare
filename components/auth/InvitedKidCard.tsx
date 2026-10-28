import { Kid } from '@/app/_data/kids';

interface InvitedKidCardProps {
  kid: Kid;
}

// Tarjeta que muestra al niño al que la familia fue invitada, en la pantalla de activación.
export function InvitedKidCard({ kid }: InvitedKidCardProps) {
  return (
    <div className="mb-5.5 flex items-center gap-3.5 rounded-2xl border-[1.5px] border-line bg-card px-4 py-3.5">
      <div
        className="font-head flex size-11 items-center justify-center rounded-full text-[19px] font-semibold"
        style={{ backgroundColor: kid.avatarBg, color: kid.avatarColor }}
      >
        {kid.initial}
      </div>
      <div>
        <div className="text-[13px] text-[#94887B]">Te invitaron a seguir a</div>
        <div className="font-head text-[17px] font-semibold text-ink">
          {kid.firstName} · Sala {kid.room}
        </div>
      </div>
    </div>
  );
}
