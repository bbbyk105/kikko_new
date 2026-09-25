import { useCallback, useState } from "react";
import {
  canNavigateToStep,
  previousStep,
  stepNumberOf,
  stepOfNumber,
  type ReserveStep,
} from "@/lib/reserve-flow";
import { useScrollToTopOnChange } from "@/app/hooks/use-scroll-to-top-on-change";

/**
 * 予約フォームのステップ遷移。
 * 確認ステップへ進むときは validateForm（react-hook-form の trigger など）を通す。
 */
export function useReserveSteps({
  initialStep = "type",
  hasType,
  dateTimeReady,
  validateForm,
}: {
  /** 利用種別が決まった状態で開いたときは "calendar" から始める */
  initialStep?: ReserveStep;
  hasType: boolean;
  dateTimeReady: boolean;
  validateForm: () => Promise<boolean>;
}) {
  const [step, setStep] = useState<ReserveStep>(initialStep);
  useScrollToTopOnChange(step);

  const canNavigate = useCallback(
    (target: number) => canNavigateToStep(target, { step, hasType, dateTimeReady }),
    [step, hasType, dateTimeReady],
  );

  const navigate = useCallback(
    (target: number) => {
      if (!canNavigate(target)) return;
      const next = stepOfNumber(target);
      if (next === "confirm") {
        void validateForm().then((ok) => {
          if (ok) setStep("confirm");
        });
        return;
      }
      if (next) setStep(next);
    },
    [canNavigate, validateForm],
  );

  const back = useCallback(() => setStep((current) => previousStep(current) ?? current), []);

  return { step, setStep, currentNumber: stepNumberOf(step), canNavigate, navigate, back };
}
