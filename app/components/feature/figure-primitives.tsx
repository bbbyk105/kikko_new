import type { ReactNode } from "react";

/**
 * 設備セクションの製図風 SVG で共用する部品（hakuho の機械図面風イラストと同じ作り）。
 * Server Component のまま使えるよう、クライアント専用の処理は持たない。
 */

/** 注記・寸法の等幅フォント */
export const DIM_MONO = { fontFamily: "ui-monospace, SFMono-Regular, monospace" } as const;

/** 中心線の一点鎖線 */
export const CENTER = "16 5 3 5";

/** 線の色（currentColor で指定するための text-* クラス） */
export const INK = {
  line: "text-[#6B6B6B]",
  thin: "text-[#9A9A9A]",
  hatch: "text-[#D6D5D0]",
  accent: "text-[#5C6B5C]",
};

/** 文字の色・大きさ */
export const LABEL = {
  base: "fill-[#8A8A8A] text-[11px]",
  small: "fill-[#9A9A9A] text-[9px]",
  accent: "fill-[#5C6B5C] text-[11px]",
};

/** 寸法線の矢印（figure ごとに id を変える） */
export function ArrowMarker({ id }: { id: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX="8"
      refY="5"
      markerWidth="6.5"
      markerHeight="6.5"
      orient="auto-start-reverse"
    >
      <path d="M0 0L10 5L0 10z" fill="currentColor" />
    </marker>
  );
}

/** 断面の斜線ハッチ（clipId の範囲だけに描く） */
export function Hatch({
  clipId,
  from,
  to,
  y1,
  y2,
  step = 11,
  className = INK.hatch,
}: {
  clipId: string;
  from: number;
  to: number;
  y1: number;
  y2: number;
  step?: number;
  className?: string;
}) {
  const lines = [];
  for (let x = from; x <= to + (y2 - y1); x += step) {
    lines.push(<line key={x} x1={x} y1={y1} x2={x - (y2 - y1)} y2={y2} />);
  }
  return (
    <g clipPath={`url(#${clipId})`} stroke="currentColor" strokeWidth="0.7" className={className}>
      {lines}
    </g>
  );
}

/**
 * 図面シート（枠・右上の見出し・左下の図番）。
 * 親に .is-visible が付くと描き出しのアニメーションが始まる（app/globals.css の .feature-figure）
 */
export function Sheet({
  label,
  caption,
  ariaLabel,
  children,
}: {
  label: string;
  caption: string;
  ariaLabel: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 640 400"
      role="img"
      aria-label={ariaLabel}
      className={`feature-figure h-auto w-full ${INK.thin}`}
    >
      <rect
        x="16"
        y="16"
        width="608"
        height="368"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        className="figure-frame"
      />
      <text x="608" y="40" textAnchor="end" className={LABEL.base} style={DIM_MONO}>
        {label}
      </text>
      <text x="32" y="370" className={LABEL.small} style={DIM_MONO}>
        {caption}
      </text>
      {children}
    </svg>
  );
}
