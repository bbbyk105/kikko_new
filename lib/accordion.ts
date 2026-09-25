export type AccordionType = "single" | "multiple";

/** 開いている項目の一覧を、value の開閉で更新する。single は同時に1つだけ開く */
export function toggleOpenItems(
  openItems: readonly string[],
  value: string,
  type: AccordionType,
): string[] {
  const isOpen = openItems.includes(value);
  if (type === "single") return isOpen ? [] : [value];
  return isOpen ? openItems.filter((item) => item !== value) : [...openItems, value];
}
