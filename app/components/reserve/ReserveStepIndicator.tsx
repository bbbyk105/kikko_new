import { RESERVE_STEP_ITEMS } from "@/lib/reserve-flow";

interface ReserveStepIndicatorProps {
  currentNumber: number;
  canNavigate: (target: number) => boolean;
  onNavigate: (target: number) => void;
}

/** 予約ステップ（1〜4）の表示。移動できるステップだけ押せる */
export default function ReserveStepIndicator({
  currentNumber,
  canNavigate,
  onNavigate,
}: ReserveStepIndicatorProps) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-y-2 gap-x-2 sm:gap-4"
      role="navigation"
      aria-label="予約ステップ"
    >
      {RESERVE_STEP_ITEMS.map((s, index) => {
        const disabled = !canNavigate(s.num);
        const isActive = currentNumber === s.num;
        const isReached = currentNumber >= s.num;
        return (
          <div key={s.num} className="flex items-center">
            <button
              type="button"
              onClick={() => onNavigate(s.num)}
              disabled={disabled}
              aria-current={isActive ? "step" : undefined}
              aria-disabled={disabled}
              className={`flex items-center gap-2 rounded-sm text-left transition-colors disabled:cursor-not-allowed ${
                !disabled
                  ? "hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5C6B5C]"
                  : ""
              }`}
            >
              <span
                className={`w-8 h-8 shrink-0 flex items-center justify-center text-sm font-medium tabular-nums ${
                  isReached
                    ? "bg-[#2C2C2C] text-white"
                    : "bg-[#E5E4DF] text-[#2C2C2C] border border-[#C8C7C2]"
                }`}
              >
                {s.num}
              </span>
              <span
                className={`text-xs hidden sm:inline ${
                  isReached ? "text-[#2C2C2C]" : "text-[#6B6B6B]"
                }`}
              >
                {s.label}
              </span>
            </button>
            {index < RESERVE_STEP_ITEMS.length - 1 && (
              <div
                className={`w-6 sm:w-10 h-px mx-2 sm:mx-3 shrink-0 ${
                  currentNumber > s.num ? "bg-[#2C2C2C]" : "bg-[#E5E4DF]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
