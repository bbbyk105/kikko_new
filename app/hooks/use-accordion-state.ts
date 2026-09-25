import { useCallback, useState } from "react";
import { toggleOpenItems, type AccordionType } from "@/lib/accordion";

/** アコーディオンの開閉状態。single は同時に1つだけ開く */
export function useAccordionState(
  type: AccordionType = "single",
  defaultValue?: string | string[],
) {
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (defaultValue === undefined) return [];
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
  });

  const toggle = useCallback(
    (value: string) => setOpenItems((prev) => toggleOpenItems(prev, value, type)),
    [type],
  );

  const isOpen = useCallback((value: string) => openItems.includes(value), [openItems]);

  return { openItems, isOpen, toggle };
}
