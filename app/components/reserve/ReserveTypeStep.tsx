import { reserveData } from "@/app/data/site";
import { primaryButtonClass } from "./buttons";

interface ReserveTypeStepProps {
  selectedType: string;
  onSelect: (type: string) => void;
  onNext: () => void;
}

/** ステップ1: 利用種別の選択 */
export default function ReserveTypeStep({ selectedType, onSelect, onNext }: ReserveTypeStepProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="font-[var(--font-cormorant)] text-2xl text-[#2C2C2C] mb-2">
          ご利用種別を選択
        </h3>
        <p className="text-sm text-[#6B6B6B]">ご希望の利用タイプをお選びください</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reserveData.types.map((type) => {
          const selected = selectedType === type.value;
          return (
            <button
              key={type.value}
              type="button"
              onClick={() => onSelect(type.value)}
              aria-pressed={selected}
              className={`p-6 text-left transition-all border ${
                selected
                  ? "border-[#2C2C2C] bg-[#2C2C2C] text-white"
                  : "border-[#E5E4DF] bg-white hover:border-[#5C6B5C] text-[#2C2C2C]"
              }`}
            >
              <span className="block text-base font-medium mb-1">{type.label}</span>
              <span className={`block text-xs ${selected ? "text-white/70" : "text-[#8A8A8A]"}`}>
                {type.description}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-center mt-10">
        <button type="button" onClick={onNext} disabled={!selectedType} className={primaryButtonClass}>
          次へ進む
        </button>
      </div>
    </div>
  );
}
