import { useLayoutEffect, useRef } from "react";

/** value が変わったらページ先頭へスクロールする（初回マウント時は動かさない） */
export function useScrollToTopOnChange(value: unknown) {
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [value]);
}
