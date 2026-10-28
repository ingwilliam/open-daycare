import { CheckIcon } from '@/components/shared/icons';

interface PhotoConsentCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// Checkbox de autorización para tomar y compartir fotos del niño.
// Usa un <input> real dentro del <label> para que el clic en el texto también alterne el estado.
export function PhotoConsentCheckbox({
  checked,
  onChange,
}: PhotoConsentCheckboxProps) {
  return (
    <label className="mb-6 flex cursor-pointer items-start gap-3 rounded-[14px] bg-[#FBF1D6] px-4 py-3.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className={`mt-px flex size-6 shrink-0 items-center justify-center rounded-lg peer-focus-visible:ring-2 peer-focus-visible:ring-accent-soft ${
          checked ? 'bg-[#5FB97E]' : 'border-[1.5px] border-[#D8C9B5] bg-white'
        }`}
      >
        {checked && <CheckIcon width={15} height={15} strokeWidth={3} />}
      </span>
      <span className="text-sm leading-[1.45] text-[#8A7234]">
        Autorizo a la guardería a tomar y compartir fotos de mi hijo dentro de
        la app.
      </span>
    </label>
  );
}
