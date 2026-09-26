import { siteConfig } from "@/app/data/site";
import { ArrowMarker, CENTER, DIM_MONO, Hatch, INK, LABEL, Sheet } from "./figure-primitives";

/** 床（断面ハッチ付き）。どの図も同じ高さに置く */
function Floor({ clipId, y = 316 }: { clipId: string; y?: number }) {
  return (
    <>
      <defs>
        <clipPath id={clipId}>
          <rect x="40" y={y} width="560" height="14" />
        </clipPath>
      </defs>
      <Hatch clipId={clipId} from={40} to={600} y1={y} y2={y + 14} step={10} />
      <line x1="40" y1={y} x2="600" y2={y} stroke="currentColor" strokeWidth="1.5" className={INK.line} />
    </>
  );
}

/** 寸法線（両端の引き出し線と矢印・中央の注記） */
function Dimension({
  x1,
  x2,
  y,
  from,
  label,
  markerId,
}: {
  x1: number;
  x2: number;
  y: number;
  /** 引き出し線の始まり（図形の端） */
  from: number;
  label: string;
  markerId: string;
}) {
  const top = Math.min(from, y) - 4;
  const bottom = Math.max(from, y) + 4;
  return (
    <>
      <g stroke="currentColor" strokeWidth="0.75">
        <line x1={x1} y1={top} x2={x1} y2={bottom} />
        <line x1={x2} y1={top} x2={x2} y2={bottom} />
        <line x1={x1} y1={y} x2={x2} y2={y} markerStart={`url(#${markerId})`} markerEnd={`url(#${markerId})`} />
      </g>
      <text x={(x1 + x2) / 2} y={y - 6} textAnchor="middle" className={LABEL.base} style={DIM_MONO}>
        {label}
      </text>
    </>
  );
}

/** 01 高速Wi-Fiと快適な設備: デスク・チェア・PC と天井のアクセスポイント（側面図） */
export function WorkspaceFigure() {
  return (
    <Sheet
      label="WORKSPACE"
      caption="FIG. 01 — DESK & NETWORK — SCALE 1:20"
      ariaLabel="デスクとチェア、天井の Wi-Fi アクセスポイントを描いた図面"
    >
      <defs>
        <ArrowMarker id="kf1-arrow" />
        <clipPath id="kf1-desk">
          <rect x="236" y="214" width="260" height="10" />
        </clipPath>
      </defs>

      {/* 天井とアクセスポイント */}
      <line x1="40" y1="64" x2="600" y2="64" stroke="currentColor" strokeWidth="0.75" />
      <line x1="330" y1="40" x2="330" y2="150" stroke="currentColor" strokeWidth="0.6" strokeDasharray={CENTER} />
      <rect x="296" y="64" width="68" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" className={INK.line} />
      <g fill="none" stroke="currentColor" strokeWidth="1.5" className={INK.accent}>
        <path className="loop wifi-arc" d="M311.6 91.4 A24 24 0 0 0 348.4 91.4" />
        <path className="loop wifi-arc wifi-arc-2" d="M297.8 103 A42 42 0 0 0 362.2 103" />
        <path className="loop wifi-arc wifi-arc-3" d="M284 114.6 A60 60 0 0 0 376 114.6" />
      </g>
      <line x1="376" y1="114" x2="420" y2="100" stroke="currentColor" strokeWidth="0.75" className={INK.accent} />
      <text x="424" y="104" className={LABEL.accent} style={DIM_MONO}>
        HIGH-SPEED Wi-Fi
      </text>

      <Floor clipId="kf1-floor" />

      {/* デスク（天板は断面ハッチ） */}
      <Hatch clipId="kf1-desk" from={236} to={496} y1={214} y2={224} step={8} />
      <g fill="none" stroke="currentColor" strokeWidth="1.5" className={INK.line}>
        <rect x="236" y="214" width="260" height="10" />
        <rect x="250" y="224" width="8" height="92" />
        <rect x="474" y="224" width="8" height="92" />
        {/* ノート PC（奥に画面） */}
        <rect x="300" y="207" width="96" height="7" />
        <polygon points="390,207 408,146 414,148 396,207" />
        {/* カップ */}
        <rect x="436" y="192" width="18" height="22" />
        <path d="M454 197 q8 0 8 7 q0 7 -8 7" />
        {/* 電源 */}
        <rect x="426" y="236" width="30" height="12" rx="2" />
      </g>
      <g stroke="currentColor" strokeWidth="1" className={INK.line}>
        <line x1="435" y1="240" x2="435" y2="244" />
        <line x1="447" y1="240" x2="447" y2="244" />
      </g>
      <line x1="456" y1="242" x2="516" y2="262" stroke="currentColor" strokeWidth="0.75" />
      <text x="520" y="266" className={LABEL.base} style={DIM_MONO}>
        POWER
      </text>

      {/* チェア */}
      <g fill="none" stroke="currentColor" strokeWidth="1.5" className={INK.line}>
        <rect x="150" y="250" width="84" height="9" rx="2" />
        <polygon points="150,250 136,178 146,176 160,250" />
        <line x1="170" y1="226" x2="222" y2="226" />
        <line x1="216" y1="226" x2="216" y2="250" />
        <rect x="188" y="259" width="8" height="38" />
        <line x1="150" y1="300" x2="234" y2="300" strokeWidth="2" />
        <circle cx="154" cy="308" r="5" />
        <circle cx="230" cy="308" r="5" />
      </g>
      <line x1="140" y1="190" x2="92" y2="160" stroke="currentColor" strokeWidth="0.75" />
      <text x="56" y="154" className={LABEL.base} style={DIM_MONO}>
        CHAIR
      </text>

      <Dimension x1={236} x2={496} y={352} from={330} label="WORK DESK" markerId="kf1-arrow" />
    </Sheet>
  );
}

/** 02 ビジネスサポート: 複合機（正面図）と、印刷・スキャンの流れ */
export function PrintScanFigure() {
  return (
    <Sheet
      label="BUSINESS SUPPORT"
      caption="FIG. 02 — PRINT & SCAN — SCALE 1:10"
      ariaLabel="複合機と、書類の印刷・スキャンの流れを描いた図面"
    >
      <defs>
        <ArrowMarker id="kf2-arrow" />
        <clipPath id="kf2-lid">
          <rect x="200" y="132" width="192" height="18" />
        </clipPath>
      </defs>

      <line x1="296" y1="84" x2="296" y2="330" stroke="currentColor" strokeWidth="0.6" strokeDasharray={CENTER} />
      <Floor clipId="kf2-floor" />

      {/* 複合機 */}
      <Hatch clipId="kf2-lid" from={200} to={392} y1={132} y2={150} step={9} />
      <g fill="none" stroke="currentColor" strokeWidth="1.5" className={INK.line}>
        <rect x="200" y="132" width="192" height="18" />
        <rect x="206" y="150" width="180" height="96" />
        <rect x="196" y="246" width="200" height="70" />
        <line x1="196" y1="270" x2="396" y2="270" />
        <line x1="196" y1="293" x2="396" y2="293" />
        <line x1="226" y1="196" x2="366" y2="196" />
        <line x1="216" y1="226" x2="376" y2="226" />
        <rect x="338" y="156" width="40" height="18" rx="2" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1" className={INK.line}>
        <rect x="236" y="188" width="112" height="8" />
        <circle cx="348" cy="165" r="2.5" />
        <circle cx="357" cy="165" r="2.5" />
        <rect x="364" y="160" width="10" height="10" />
        <line x1="286" y1="258" x2="306" y2="258" />
        <line x1="286" y1="281" x2="306" y2="281" />
        <line x1="286" y1="304" x2="306" y2="304" />
      </g>
      <rect x="204" y="136" width="5" height="10" fill="currentColor" className={`loop scan-bar ${INK.accent}`} />
      <Dimension x1={200} x2={392} y={112} from={128} label="MULTIFUNCTION PRINTER" markerId="kf2-arrow" />

      {/* 書類 */}
      <g fill="none" stroke="currentColor" strokeWidth="1.5" className={INK.line}>
        <path d="M454 150 L530 150 L550 170 L550 278 L454 278 Z" />
        <path d="M530 150 L530 170 L550 170" strokeWidth="1" />
      </g>
      <line x1="468" y1="176" x2="512" y2="176" stroke="currentColor" strokeWidth="2" className={INK.thin} />
      <g stroke="currentColor" strokeWidth="1" className={INK.thin}>
        {[196, 208, 220, 232, 244, 256].map((y, i) => (
          <line key={y} x1="468" y1={y} x2={i % 3 === 2 ? 510 : 536} y2={y} className="loop print-line" />
        ))}
      </g>

      {/* 印刷・スキャンの流れ */}
      <g fill="none" stroke="currentColor" strokeWidth="1.25" className={INK.accent}>
        <path
          d="M352 192 C400 192 410 214 450 214"
          strokeDasharray="6 5"
          markerEnd="url(#kf2-arrow)"
          className="loop flow-line"
        />
        <path
          d="M500 146 C496 118 442 114 398 128"
          strokeDasharray="6 5"
          markerEnd="url(#kf2-arrow)"
          className="loop flow-line"
        />
      </g>
      <text x="394" y="186" className={LABEL.accent} style={DIM_MONO}>
        PRINT
      </text>
      <text x="446" y="112" className={LABEL.accent} style={DIM_MONO}>
        SCAN
      </text>
      <text x="48" y="232" className={LABEL.base} style={DIM_MONO}>
        COPY · PRINT · SCAN
      </text>
      <line x1="184" y1="228" x2="206" y2="228" stroke="currentColor" strokeWidth="0.75" />
    </Sheet>
  );
}

/** 03 住所登録サービス: 建物の外観・郵便受け・郵便物（立面図） */
export function AddressFigure() {
  return (
    <Sheet
      label="ADDRESS SERVICE"
      caption="FIG. 03 — REGISTERED OFFICE & MAIL"
      ariaLabel="建物の外観と住所表示、郵便受けと郵便物を描いた図面"
    >
      <defs>
        <ArrowMarker id="kf3-arrow" />
        <clipPath id="kf3-parapet">
          <rect x="64" y="110" width="256" height="10" />
        </clipPath>
      </defs>

      <Floor clipId="kf3-floor" />

      {/* 建物 */}
      <Hatch clipId="kf3-parapet" from={64} to={320} y1={110} y2={120} step={8} />
      <g fill="none" stroke="currentColor" strokeWidth="1.5" className={INK.line}>
        <rect x="64" y="110" width="256" height="10" />
        <rect x="72" y="120" width="240" height="196" />
        <rect x="96" y="144" width="56" height="44" />
        <rect x="168" y="144" width="56" height="44" />
        <rect x="240" y="144" width="48" height="44" />
        <rect x="160" y="236" width="64" height="80" />
        <rect x="132" y="210" width="120" height="18" />
        <rect x="240" y="252" width="64" height="26" />
      </g>
      <g stroke="currentColor" strokeWidth="1" className={INK.thin}>
        <line x1="124" y1="144" x2="124" y2="188" />
        <line x1="196" y1="144" x2="196" y2="188" />
        <line x1="264" y1="144" x2="264" y2="188" />
        <line x1="192" y1="236" x2="192" y2="316" />
        <line x1="186" y1="272" x2="186" y2="282" />
        <line x1="198" y1="272" x2="198" y2="282" />
      </g>
      <text x="192" y="223" textAnchor="middle" className={LABEL.small} style={DIM_MONO}>
        {siteConfig.nameEn.toUpperCase()}
      </text>
      <text x="272" y="269" textAnchor="middle" className={LABEL.small} style={DIM_MONO}>
        {siteConfig.address.postal}
      </text>

      {/* 郵便受け */}
      <g fill="none" stroke="currentColor" strokeWidth="1.5" className={INK.line}>
        <rect x="378" y="252" width="6" height="64" />
        <rect x="352" y="214" width="58" height="38" rx="3" />
        <line x1="364" y1="226" x2="398" y2="226" />
      </g>

      {/* 郵便物 */}
      <g className="loop envelope">
        <g fill="none" stroke="currentColor" strokeWidth="1.5" className={INK.line}>
          <rect x="452" y="120" width="128" height="80" />
          <path d="M452 120 L516 160 L580 120" strokeWidth="1" />
        </g>
        <g stroke="currentColor" strokeWidth="1" className={INK.thin}>
          <line x1="476" y1="178" x2="556" y2="178" />
          <line x1="476" y1="188" x2="536" y2="188" />
        </g>
      </g>
      <path
        d="M452 170 C420 172 404 190 400 208"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="6 5"
        markerEnd="url(#kf3-arrow)"
        className={`loop flow-line ${INK.accent}`}
      />
      <text x="412" y="166" className={LABEL.accent} style={DIM_MONO}>
        MAIL
      </text>

      {/* 登録済みのスタンプ */}
      <g fill="none" stroke="currentColor" className={INK.accent}>
        <circle cx="516" cy="258" r="28" strokeWidth="1.25" strokeDasharray="5 4" />
        <path d="M503 259 L513 269 L530 247" strokeWidth="2.5" className="loop stamp-check" />
      </g>
      <text x="516" y="302" textAnchor="middle" className={LABEL.accent} style={DIM_MONO}>
        REGISTERED
      </text>

      <Dimension x1={72} x2={312} y={352} from={330} label="OFFICE ADDRESS" markerId="kf3-arrow" />
    </Sheet>
  );
}

/** 04 柔軟な利用形態: 平面図（セミナー・会議・ラウンジの配置） */
export function FloorPlanFigure() {
  const seminarChairs = [];
  for (let col = 0; col < 6; col++) {
    for (let row = 0; row < 8; row++) {
      seminarChairs.push(<rect key={`${col}-${row}`} x={132 + col * 24} y={110 + row * 22} width="12" height="10" />);
    }
  }
  const meetingChairs = [388, 412, 436, 460, 484].flatMap((x) => [
    <rect key={`t${x}`} x={x} y="136" width="12" height="10" />,
    <rect key={`b${x}`} x={x} y="206" width="12" height="10" />,
  ]);

  return (
    <Sheet
      label="FLEXIBLE SPACE"
      caption="FIG. 04 — FLOOR PLAN — SEMINAR / MEETING / EVENT"
      ariaLabel="セミナー・会議・ラウンジの配置を描いた平面図"
    >
      <defs>
        <ArrowMarker id="kf4-arrow" />
        <clipPath id="kf4-wall">
          <path d="M72 76 H568 V316 H72 Z M80 84 V308 H560 V84 Z" clipRule="evenodd" />
        </clipPath>
      </defs>

      {/* 壁（断面ハッチ） */}
      <Hatch clipId="kf4-wall" from={72} to={568} y1={76} y2={316} step={8} />
      <g fill="none" stroke="currentColor" strokeWidth="1.5" className={INK.line}>
        <rect x="72" y="76" width="496" height="240" className="figure-long" />
        <rect x="80" y="84" width="480" height="224" className="figure-long" />
      </g>
      {/* 出入口（壁を抜いて扉の開きを描く） */}
      <rect x="292" y="305" width="40" height="13" fill="#FFFFFF" />
      <path d="M292 308 L292 268 A40 40 0 0 1 332 308" fill="none" stroke="currentColor" strokeWidth="1" />

      {/* セミナー */}
      <line x1="96" y1="132" x2="96" y2="260" stroke="currentColor" strokeWidth="3" className={INK.accent} />
      <rect x="106" y="186" width="12" height="20" fill="none" stroke="currentColor" strokeWidth="1.25" className={INK.line} />
      <g fill="none" stroke="currentColor" strokeWidth="1" className={INK.line}>
        {seminarChairs}
      </g>
      <text x="132" y="102" className={LABEL.base} style={DIM_MONO}>
        SEMINAR
      </text>

      {/* 可動の仕切り */}
      <line
        x1="308"
        y1="88"
        x2="308"
        y2="262"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeDasharray="6 4"
        className={`loop partition ${INK.accent}`}
      />
      <text x="308" y="72" textAnchor="middle" className={LABEL.small} style={DIM_MONO}>
        ← MOVABLE →
      </text>

      {/* 会議 */}
      <g fill="none" stroke="currentColor" strokeWidth="1.25" className={INK.line}>
        <rect x="380" y="152" width="120" height="50" />
        <rect x="364" y="171" width="10" height="12" />
        <rect x="506" y="171" width="10" height="12" />
      </g>
      <g fill="none" stroke="currentColor" strokeWidth="1" className={INK.line}>
        {meetingChairs}
      </g>
      <text x="380" y="126" className={LABEL.base} style={DIM_MONO}>
        MEETING
      </text>

      {/* ラウンジ */}
      <g fill="none" stroke="currentColor" strokeWidth="1.25" className={INK.line}>
        <circle cx="396" cy="266" r="12" />
        <circle cx="446" cy="266" r="12" />
        <circle cx="496" cy="266" r="12" />
      </g>
      <text x="380" y="244" className={LABEL.base} style={DIM_MONO}>
        LOUNGE
      </text>

      {/* 方位 */}
      <g className={INK.line}>
        <circle cx="596" cy="104" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
        <path d="M596 90 L601 110 L596 106 L591 110 Z" fill="currentColor" />
      </g>
      <text x="596" y="84" textAnchor="middle" className={LABEL.small} style={DIM_MONO}>
        N
      </text>

      <Dimension x1={72} x2={568} y={60} from={76} label="FLOOR PLAN" markerId="kf4-arrow" />
      <text x="72" y="344" className={LABEL.accent} style={DIM_MONO}>
        SEATED {siteConfig.capacity.seated} / STANDING {siteConfig.capacity.standing}
      </text>
    </Sheet>
  );
}

/** features の id と図の対応 */
export const featureFigures = {
  wifi: WorkspaceFigure,
  business: PrintScanFigure,
  address: AddressFigure,
  flexible: FloorPlanFigure,
} as const;

export type FeatureFigureId = keyof typeof featureFigures;
