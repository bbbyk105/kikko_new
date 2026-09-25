import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/**
 * ページが threshold(px) より下までスクロールされているか。
 * useSyncExternalStore で購読するので、途中の位置で再読み込みしても初回から正しい値になる。
 */
export function useScrolled(threshold = 50): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
}
