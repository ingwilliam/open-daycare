'use client';

import { useState } from 'react';
import { ROOMS, kids, type Kid } from '@/app/_data/kids';
import { createKid } from '@/app/_lib/createKid';
import type { AddKidFormValues } from '@/app/_lib/validation';
import { Sidebar } from '@/components/shared/Sidebar';
import { MobileNav } from '@/components/shared/MobileNav';
import { PlusIcon, SearchIcon } from '@/components/shared/icons';
import { KidCard } from '@/components/kids/KidCard';
import { AddKidDialog } from '@/components/kids/AddKidDialog';

function normalize(str: string): string {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export default function KidsPage() {
  const [query, setQuery] = useState('');
  const [kidList, setKidList] = useState<Kid[]>(kids);
  const [createdIds, setCreatedIds] = useState<string[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filtered = kidList.filter((kid) =>
    normalize(kid.fullName).includes(normalize(query))
  );

  // Se agrupa por sala y se omiten las salas sin niños (Luna aparece al agregar el primero).
  const groups = ROOMS.map((room) => ({
    room,
    kids: filtered.filter((kid) => kid.room === room),
  })).filter((group) => group.kids.length > 0);

  // Alta en memoria: se agrega a la lista y se recuerda el id como no navegable.
  function handleSave(values: AddKidFormValues) {
    const newKid = createKid(
      values,
      kidList.map((kid) => kid.id)
    );

    setKidList((current) => [...current, newKid]);
    setCreatedIds((current) => [...current, newKid.id]);
    setIsDialogOpen(false);
  }

  return (
    <div className="flex flex-1 min-h-screen bg-canvas">
      <Sidebar pathname="/kids" />
      <MobileNav pathname="/kids" />
      <main className="flex-1 min-w-0 h-screen overflow-y-auto">
        <div className="max-w-[880px] w-full mx-auto px-5 md:px-10 pt-16 md:pt-[34px] pb-20">
          <div className="flex items-end justify-between gap-4 mb-[22px]">
            <div>
              <div className="text-[12.5px] font-extrabold tracking-[0.8px] text-accent mb-1">
                GESTIÓN
              </div>
              <h1 className="font-head font-semibold text-[30px] text-ink m-0">
                Niños
              </h1>
            </div>
            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 px-[18px] py-[11px] rounded-[14px] bg-gradient-to-b from-[#F4977E] to-[#EE8164] text-white font-extrabold text-[14.5px] shadow-[0_8px_18px_-8px_rgba(238,129,100,0.7)] cursor-pointer"
            >
              <PlusIcon className="w-[17px] h-[17px]" />
              Agregar niño
            </button>
          </div>

          <div className="flex items-center gap-[11px] bg-card border border-line rounded-[14px] px-4 py-3 mb-[22px]">
            <SearchIcon className="w-[18px] h-[18px] text-[#B0A290]" />
            <input
              placeholder="Buscar niño…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border-none bg-none text-[15px] text-ink placeholder-[#B6A99999] outline-none"
            />
          </div>

          <div className="space-y-[26px]">
            {groups.map((group) => (
              <section key={group.room}>
                <div className="flex items-center gap-3 mb-[14px]">
                  <span className="text-[12.5px] font-extrabold tracking-[0.8px] text-ink">
                    SALA {group.room.toUpperCase()}
                  </span>
                  <span className="text-[13px] text-muted">
                    {group.kids.length} niños
                  </span>
                  <span className="flex-1 h-px bg-[#E7DAC8]" />
                </div>

                <div className="grid grid-cols-2 gap-[14px]">
                  {group.kids.map((kid) => (
                    <KidCard
                      key={kid.id}
                      kid={kid}
                      navigable={!createdIds.includes(kid.id)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      {isDialogOpen && (
        <AddKidDialog
          onClose={() => setIsDialogOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
