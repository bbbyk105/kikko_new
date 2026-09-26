"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

/** 写真が動く最大幅（枠に対する割合）。内側の層を枠より 3% ずつ大きくしてあるので、これより小さければ端が見えない */
const DRIFT = 0.025;

/**
 * リンクにカーソルを乗せると、中の写真がカーソルと逆向きにわずかに動く（枠が窓になって奥行きが出る）。
 * 拡大はしない。カーソルを乗せる範囲は写真を包むリンク全体（なければ写真の枠）。
 * マウス操作の端末で、動きを減らす設定になっていないときだけ動かす
 */
export function ParallaxPhoto({ children, className }: { children: ReactNode; className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const layer = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const frameEl = frame.current;
      const layerEl = layer.current;
      if (!frameEl || !layerEl) return;

      const trigger: HTMLElement = frameEl.closest("a") ?? frameEl;
      const xTo = gsap.quickTo(layerEl, "x", { duration: 1.1, ease: "power3.out" });
      const yTo = gsap.quickTo(layerEl, "y", { duration: 1.1, ease: "power3.out" });
      const clamp = gsap.utils.clamp(-0.5, 0.5);

      const onMove = (event: PointerEvent) => {
        const area = trigger.getBoundingClientRect();
        const { width, height } = frameEl.getBoundingClientRect();
        const px = clamp((event.clientX - area.left) / area.width - 0.5);
        const py = clamp((event.clientY - area.top) / area.height - 0.5);
        xTo(-px * 2 * width * DRIFT);
        yTo(-py * 2 * height * DRIFT);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      trigger.addEventListener("pointermove", onMove);
      trigger.addEventListener("pointerleave", onLeave);
      return () => {
        trigger.removeEventListener("pointermove", onMove);
        trigger.removeEventListener("pointerleave", onLeave);
      };
    });
    return () => mm.revert();
  });

  return (
    <div ref={frame} className={cn("relative overflow-hidden", className)}>
      <div ref={layer} className="absolute -inset-[3%]">
        {children}
      </div>
    </div>
  );
}
