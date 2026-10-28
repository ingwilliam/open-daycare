import { SunIcon } from '@/components/shared/icons';

// Panel decorativo de la pantalla de login: marca, mensaje y nombre de la sala.
// Se oculta en viewports menores a `md`; en mobile solo queda el formulario.
export function BrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-[linear-gradient(155deg,#F6A98E_0%,#F2937A_45%,#EC7E62_100%)] p-14 text-white md:flex">
      <div
        aria-hidden="true"
        className="absolute -top-35 -right-30 size-105 rounded-full bg-white/12"
      />
      <div
        aria-hidden="true"
        className="absolute -bottom-27.5 -left-20 size-75 rounded-full bg-white/10"
      />

      <div className="relative flex items-center gap-3.25">
        <div className="flex size-11.5 items-center justify-center rounded-[14px] bg-white/22">
          <SunIcon width={26} height={26} />
        </div>
        <span className="font-head text-[21px] font-semibold tracking-[0.5px]">
          OpenDayCare
        </span>
      </div>

      <div className="relative">
        <h1 className="font-head mb-4.5 text-[42px] leading-[1.12] font-semibold">
          El día de cada niño,
          <br />
          compartido con su familia.
        </h1>
        <p className="max-w-107.5 text-[17px] leading-[1.6] text-white/92">
          Publicá momentos, gestioná las salas y mantené a las familias cerca,
          desde un solo lugar.
        </p>
      </div>

      <div className="relative text-sm text-white/90">Guardería Sala Soles</div>
    </div>
  );
}
