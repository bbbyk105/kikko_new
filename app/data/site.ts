import { contactHref, MYPAGE_PATH, reserveHref, type ReserveType } from "@/lib/routes";

export const siteConfig = {
  name: "橘香堂",
  nameEn: "worx mt.fuji",
  /** 正式名称。施設概要・プライバシーポリシー・メール署名など、事業者として名乗る箇所だけに使う */
  officialName: "worx mt.fuji 橘香堂（近藤薬局）",
  url: "https://worxmtfuji.com",
  tagline: "働く場所から、仕事の質を整える。",
  description: "富士市吉原の、静かで上質なワークスペース。",
  phone: "0545-67-7400",
  email: "info@worxmtfuji.com",
  address: {
    postal: "〒417-0051",
    full: "静岡県富士市吉原2丁目8番21-2号",
    short: "静岡県富士市吉原2-8-21-2",
  },
  hours: {
    regular: "9:00–18:00",
    lastEntry: "17:30",
    extended: "22:00（会員予約制）",
    /** 会員の延長利用の終了時刻（文中に埋め込む用） */
    extendedUntil: "22:00",
    days: "平日・土日祝",
  },
  capacity: {
    seated: 80,
    standing: 150,
  },
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.760906869442!2d138.68491027576485!3d35.16258317275916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601a2b3b80616499%3A0x6c57d4d775647025!2z5qmY6aaZ5aCC6L-R6Jek6Yas5bGA77yId29yeCBtdC5mdWpp77yJ!5e0!3m2!1sja!2sjp!4v1772772222596!5m2!1sja!2sjp",
  /** Google マップのアプリ・新しいタブで開く用（Google 上の登録名「橘香堂近藤薬局」＋住所で検索する） */
  googleMapsLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("橘香堂近藤薬局 静岡県富士市吉原2丁目8番21-2号")}`,
};

export interface NavItem {
  name: string;
  nameJa: string;
  href: string;
}

/** ヘッダー・フッター共通のメインメニュー */
export const navigation: NavItem[] = [
  { name: "About", nameJa: "橘香堂について", href: "/about" },
  { name: "Space", nameJa: "空間", href: "/space" },
  { name: "Pricing", nameJa: "料金", href: "/pricing" },
  { name: "Access", nameJa: "アクセス", href: "/access" },
  { name: "FAQ", nameJa: "よくある質問", href: "/faq" },
  { name: "Contact", nameJa: "お問い合わせ", href: "/contact" },
];

/** 予約・問い合わせの導線（ヘッダーのボタン、フッターなどで共用） */
export const primaryActions = {
  reserve: { label: "ご予約", href: reserveHref() },
  contact: { label: "お問い合わせ", href: contactHref() },
  mypage: { label: "マイページ", href: MYPAGE_PATH },
};

export const heroFeatures = [
  { label: "高速Wi-Fi" },
  { label: "住所登録対応" },
  { label: "印刷設備" },
  { label: "周辺駐車場あり" },
];

// 施設写真
export const images = {
  hero: "/images/slide1.webp",
  about: "/images/slide2.webp",
  capacity: "/images/slide3.webp",
  cta: "/images/slide1.webp",
  spaceHero: "/images/slide2.webp",
  pricingHero: "/images/slide3.webp",
};

export const spaceCategories = [
  {
    id: "coworking",
    number: "01",
    title: "Coworking",
    titleJa: "コワーキング",
    description:
      "集中できる静かな環境で、日々の仕事に取り組む。高速Wi-Fiと快適な設備を完備した、プロフェッショナルのためのワークスペース。",
    image: "/images/slide1.webp",
  },
  {
    id: "meeting",
    number: "02",
    title: "Meeting / Seminar",
    titleJa: "会議・セミナー",
    description:
      "少人数の打ち合わせから、セミナーや研修まで。用途に応じた柔軟なレイアウトで、ビジネスシーンをサポート。",
    image: "/images/slide2.webp",
  },
  {
    id: "address",
    number: "03",
    title: "Address Registration",
    titleJa: "住所登録",
    description:
      "法人登記や事業所住所として利用可能。ビジネスの拠点として、信頼性のある住所をご提供。",
    image: "/images/slide3.webp",
  },
  {
    id: "event",
    number: "04",
    title: "Event / Multi-purpose",
    titleJa: "イベント・多目的",
    description:
      "展示会、ワークショップ、小規模イベントなど。着席80名、スタンディング150名まで対応可能な多目的スペース。",
    image: "/images/yoga.jpg",
  },
];

export const features = [
  {
    id: "wifi",
    title: "高速Wi-Fiと快適な設備",
    description:
      "安定した高速インターネット環境と、集中して作業できる快適なデスク・チェアを完備。",
  },
  {
    id: "business",
    title: "ビジネスサポート",
    description:
      "高性能プリンター・スキャナーを常設。急な印刷やスキャンにも対応。",
  },
  {
    id: "address",
    title: "住所登録サービス",
    description:
      "法人登記、事業所住所として利用可能。郵便物の受け取りにも対応いたします。",
  },
  {
    id: "flexible",
    title: "柔軟な利用形態",
    description:
      "会議やセミナー、小規模イベントまで。空間を自在にカスタマイズしてご利用いただけます。",
  },
];

export interface LinkAction {
  label: string;
  href: string;
}

/**
 * 料金プランのボタン。
 * 日時を決めて使うプランは予約フォーム（種別を選んだ状態）へ、契約の相談が必要な法人会員はお問い合わせへ。
 */
const planCtas = {
  visitor: { label: "ビジター利用を予約する", href: reserveHref("visitor") },
  member: { label: "コワーキング利用を予約する", href: reserveHref("coworking") },
  corporate: { label: "法人契約を相談する", href: contactHref("corporate") },
} satisfies Record<string, LinkAction>;

export const pricingPlans = [
  {
    id: "visitor",
    name: "ビジター",
    nameEn: "Visitor",
    price: "¥550",
    unit: "/ 1時間",
    description: "お試し利用や、短時間のご利用に。",
    features: ["Wi-Fi利用可", "電源利用可", "フリードリンク"],
    cta: planCtas.visitor,
  },
  {
    id: "member",
    name: "通常会員",
    nameEn: "Regular",
    price: "¥8,800",
    unit: "/ 月",
    description: "定期的にご利用される方へ。",
    features: [
      "営業時間内使い放題",
      "会議室優先予約",
      "22:00まで延長可能",
      "住所利用可（別途）",
    ],
    highlighted: true,
    cta: planCtas.member,
  },
  {
    id: "corporate",
    name: "法人会員",
    nameEn: "Corporate",
    price: "¥16,500",
    unit: "/ 月〜",
    description: "チームでのご利用、法人登記をご希望の方へ。",
    features: [
      "複数名利用可",
      "法人登記対応",
      "専用ロッカー",
      "来客対応可",
      "会議室無料枠",
    ],
    cta: planCtas.corporate,
  },
];

export const accessInfo = {
  station: "JR富士駅から車で約10分",
  parking: "周辺にコインパーキングあり",
  bus: "吉原中央駅バス停から徒歩5分",
};

// ====================================
// Page-specific data
// ====================================

export const pricingPageData = {
  intro: {
    title: "Pricing",
    titleJa: "料金プラン",
    description: "利用スタイルに合わせて選べる、シンプルな料金プラン。",
    lead: "ビジター利用から法人契約まで、幅広いニーズにお応えします。まずはお気軽にお試しください。",
  },
  notes: [
    "価格はすべて税込表示です",
    "営業時間: 平日・土日祝 9:00–18:00",
    "最終入館: 17:30",
    "会員は事前予約で22:00まで延長営業可能",
    "法人会員は利用人数により料金が変動します",
    "住所登録サービスは別途オプションとなります",
  ],
  detailedPlans: [
    {
      id: "visitor",
      name: "ビジター",
      nameEn: "Visitor",
      price: "¥550",
      unit: "/ 1時間",
      description:
        "初めての方、短時間のご利用に最適。予約不要でお気軽にご利用いただけます。",
      features: [
        { text: "Wi-Fi利用可", included: true },
        { text: "電源利用可", included: true },
        { text: "フリードリンク", included: true },
        { text: "会議室利用", included: false },
        { text: "延長営業", included: false },
        { text: "住所登録", included: false },
      ],
      cta: planCtas.visitor,
    },
    {
      id: "member",
      name: "通常会員",
      nameEn: "Regular",
      price: "¥8,800",
      unit: "/ 月",
      description:
        "定期的に利用される方へ。時間を気にせず、集中して作業に取り組めます。",
      features: [
        { text: "営業時間内使い放題", included: true },
        { text: "Wi-Fi・電源・ドリンク", included: true },
        { text: "会議室優先予約", included: true },
        { text: "22:00まで延長可能", included: true },
        { text: "住所利用可（別途）", included: true },
        { text: "法人登記", included: false },
      ],
      highlighted: true,
      cta: planCtas.member,
    },
    {
      id: "corporate",
      name: "法人会員",
      nameEn: "Corporate",
      price: "¥16,500",
      unit: "/ 月〜",
      description:
        "チームでのご利用、法人登記をご希望の方へ。ビジネスの拠点としてお使いいただけます。",
      features: [
        { text: "複数名での利用可", included: true },
        { text: "法人登記対応", included: true },
        { text: "専用ロッカー", included: true },
        { text: "来客対応可", included: true },
        { text: "会議室無料枠付き", included: true },
        { text: "郵便物受け取り", included: true },
      ],
      cta: planCtas.corporate,
    },
  ],
};

export const spacePageData = {
  intro: {
    title: "Space",
    titleJa: "空間と利用シーン",
    description: "集中、対話、発信。用途に応じて使える、静かで柔軟な空間。",
  },
  specs: [
    { label: "高速Wi-Fi", value: "全館完備" },
    { label: "印刷設備", value: "プリンター・スキャナー常設" },
    { label: "駐車場", value: "周辺にコインパーキングあり" },
    { label: "着席最大", value: "80名" },
    { label: "スタンディング最大", value: "150名" },
    { label: "対応用途", value: "会議・セミナー・イベント" },
    { label: "住所登録", value: "法人登記対応" },
    { label: "営業時間", value: "9:00–18:00" },
  ],
  useCases: [
    "日々の仕事",
    "打ち合わせ",
    "セミナー・研修",
    "小規模イベント",
    "法人利用",
    "住所登録",
  ],
  gallery: [
    {
      src: "/images/slide1.webp",
      alt: "開放的なコワーキングエリア",
      size: "large" as const,
    },
    {
      src: "/images/slide2.webp",
      alt: "落ち着いた作業スペース",
      size: "small" as const,
    },
    {
      src: "/images/slide3.webp",
      alt: "会議室",
      size: "small" as const,
    },
    {
      src: "/images/yoga.jpg",
      alt: "多目的スペース",
      size: "tall" as const,
    },
    {
      src: "/images/slide1.webp",
      alt: "イベントスペース",
      size: "wide" as const,
    },
  ],
};

/** Web でのキャンセル締切（利用日の前日のこの時刻・日本時間） */
const CANCEL_DEADLINE_TIME = "17:00";

export const faqItems = [
  {
    id: "visitor",
    question: "ビジター利用は可能ですか？",
    answer:
      "はい、可能です。予約不要で、1時間550円（税込）からご利用いただけます。初めての方もお気軽にお越しください。",
  },
  {
    id: "hours",
    question: "会員は何時まで利用できますか？",
    answer:
      "通常の営業時間は9:00〜18:00（最終入館17:30）ですが、会員の方は事前予約により22:00まで延長してご利用いただけます。",
  },
  {
    id: "corporate",
    question: "法人契約はできますか？",
    answer:
      "はい、法人会員プランをご用意しております。複数名でのご利用、法人登記、郵便物の受け取りなどに対応しています。詳細はお問い合わせください。",
  },
  {
    id: "event",
    question: "イベント利用は可能ですか？",
    answer:
      "はい、セミナー、ワークショップ、展示会など、様々なイベントにご利用いただけます。着席最大80名、スタンディング最大150名まで対応可能です。",
  },
  {
    id: "parking",
    question: "駐車場はありますか？",
    answer:
      "専用駐車場はございませんが、周辺にコインパーキングがございます。お車でお越しの際はそちらをご利用ください。",
  },
  {
    id: "address",
    question: "住所登録サービスは使えますか？",
    answer:
      "はい、法人登記や事業所住所としてご利用いただける住所登録サービスを提供しています。郵便物の受け取りにも対応しております。",
  },
  {
    id: "payment",
    question: "支払い方法について教えてください。",
    answer:
      "現金、クレジットカード、各種キャッシュレス決済に対応しております。会員費は口座振替またはクレジットカードでのお支払いとなります。",
  },
  {
    id: "wifi",
    question: "Wi-Fiは使えますか？",
    answer:
      "はい、高速Wi-Fiを全館で無料でご利用いただけます。安定した通信環境でリモートワークやオンライン会議にも対応しています。",
  },
  {
    id: "food",
    question: "飲食の持ち込みはできますか？",
    answer:
      "はい、可能です。フリードリンクもご用意しておりますので、ご自由にご利用ください。",
  },
  {
    id: "cancel",
    question: "予約のキャンセルや変更はできますか？",
    answer: `キャンセルは、ご利用日の前日${CANCEL_DEADLINE_TIME}まで、予約受付メールに記載のリンクまたはマイページから承ります。マイページには、ご予約時のメールアドレスでログインできます（パスワードは不要です）。前日${CANCEL_DEADLINE_TIME}以降のキャンセルや日時の変更は、お電話（${siteConfig.phone}）でご連絡ください。`,
  },
];

export const reserveData = {
  intro: {
    title: "Reserve",
    titleJa: "ご予約・お問い合わせ",
    description: "ご利用内容に合わせて、ご予約を承ります。",
  },
  steps: [
    {
      number: "01",
      title: "利用内容を選択",
      description: "ご希望の利用タイプをお選びください",
    },
    {
      number: "02",
      title: "日時と情報を入力",
      description: "ご希望の日時と連絡先をご入力ください",
    },
    {
      number: "03",
      title: "内容確認・送信",
      description: "入力内容をご確認のうえ送信してください",
    },
  ],
  types: [
    { value: "visitor", label: "ビジター利用", description: "お試し利用", requiresPeople: false },
    { value: "coworking", label: "コワーキング利用", description: "定期利用", requiresPeople: false },
    { value: "kids", label: "キッズスペース利用", description: "お子様連れでのご利用", requiresPeople: false },
    { value: "meeting", label: "会議室予約", description: "打ち合わせ・セミナー", requiresPeople: false },
    { value: "private", label: "貸切利用", description: "終日貸切・80名まで", requiresPeople: true },
    { value: "event", label: "イベント・法人相談", description: "イベント・法人利用相談", requiresPeople: true },
  ] satisfies { value: ReserveType; label: string; description: string; requiresPeople: boolean }[],
  timeSlots: [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ],
  /** 会議室の終了時刻（開始より後） */
  meetingEndHourOptions: [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ],
  cancelDeadlineTime: CANCEL_DEADLINE_TIME,
  notes: [
    "ご予約確定後、担当者より確認のご連絡をいたします",
    `キャンセルは前日${CANCEL_DEADLINE_TIME}まで、予約受付メールのリンクまたはマイページから承ります。それ以降はお電話でご連絡ください`,
    "日時の変更はお電話にて承ります",
  ],
  /** ご予約の確認・キャンセルページ、マイページの注意書き */
  manageNotes: [
    `Web でのキャンセルは、ご利用日の前日${CANCEL_DEADLINE_TIME}まで承ります`,
    `前日${CANCEL_DEADLINE_TIME}以降のキャンセルや、日時の変更はお電話（${siteConfig.phone}）でご連絡ください`,
    "マイページには、ご予約時のメールアドレスでログインできます（パスワードは不要です）",
  ],
};

// ====================================
// Space detail pages (/space/[slug])
// ====================================

export interface SpaceDetail {
  /** 概要セクションの見出し（1要素 = 1行） */
  catchcopy: string[];
  /** 概要本文（1要素 = 1段落） */
  intro: string[];
  facts: { label: string; value: string }[];
  highlights: { title: string; description: string }[];
  scenes: string[];
  recommendedFor: string[];
  /** pricingPlans の id。空なら見積り案内のみ表示 */
  planIds: string[];
  /** プランが無いときの「お見積りを依頼する」の行き先 */
  estimateHref?: string;
  pricingNote: string;
  flow: { number: string; title: string; description: string }[];
  /** faqItems の id */
  faqIds: string[];
  cta: {
    title: string;
    description: string;
    primaryButton: { text: string; href: string };
    secondaryButton?: { text: string; href: string };
  };
}

export const spaceDetails: Record<string, SpaceDetail> = {
  coworking: {
    catchcopy: ["静けさの中で、", "自分の仕事に向き合う。"],
    intro: [
      "自宅では気が散る、カフェでは長居しづらい。そんなときに、腰を据えて仕事ができる場所です。",
      "全館に高速Wi-Fiを備え、電源とフリードリンクもご用意しています。オンライン会議から資料づくりまで、一日の仕事をここで進められます。",
      "初めての方は1時間単位のビジター利用から。定期的に使う方には、営業時間内使い放題の通常会員プランがあります。",
    ],
    facts: [
      {
        label: "営業時間",
        value: `${siteConfig.hours.regular}（最終入館 ${siteConfig.hours.lastEntry}）`,
      },
      { label: "延長利用", value: siteConfig.hours.extended },
      { label: "料金", value: "ビジター ¥550 / 1時間〜" },
      { label: "設備", value: "高速Wi-Fi・電源・フリードリンク" },
      { label: "印刷", value: "プリンター・スキャナー常設" },
      { label: "飲食", value: "持ち込み可" },
    ],
    highlights: [
      {
        title: "高速Wi-Fiと電源",
        description:
          "全館で高速Wi-Fiを無料でお使いいただけます。オンライン会議やクラウドでの作業にも対応します。",
      },
      {
        title: "フリードリンク・持ち込み可",
        description:
          "フリードリンクをご用意しています。飲食物の持ち込みもできるので、昼食をはさんで一日じっくり作業できます。",
      },
      {
        title: "印刷・スキャンがその場で",
        description:
          "高性能プリンター・スキャナーを常設。契約書の印刷や書類の取り込みも、外に出ずに済ませられます。",
      },
      {
        title: "会員は22:00まで",
        description:
          "会員の方は事前予約で22:00まで延長してご利用いただけます。日中は打ち合わせ、夜は作業という使い方も。",
      },
    ],
    scenes: [
      "日々のデスクワーク",
      "リモートワーク",
      "オンライン会議",
      "資料・企画書づくり",
      "勉強・自己学習",
    ],
    recommendedFor: [
      "自宅だと集中しにくいリモートワーカー",
      "決まった拠点を持たずに働くフリーランス",
      "移動や外出の合間に作業したい方",
      "週に数日だけ使える作業場所を探している方",
    ],
    planIds: ["visitor", "member"],
    pricingNote:
      "ビジター利用は予約不要です。通常会員なら、営業時間内は時間を気にせずご利用いただけます。",
    flow: [
      {
        number: "01",
        title: "利用方法を選ぶ",
        description: "ビジター（1時間単位）か通常会員（月額）かをお選びください",
      },
      {
        number: "02",
        title: "ご来館・ご予約",
        description: "ビジターは予約不要です。日時指定のご予約はフォームから承ります",
      },
      {
        number: "03",
        title: "ご利用開始",
        description: "Wi-Fi・電源・ドリンクをご自由にお使いください",
      },
    ],
    faqIds: ["visitor", "hours", "wifi", "food", "payment"],
    cta: {
      title: "まずは1時間、使ってみてください。",
      description: "ビジター利用は予約不要です。お気軽にお立ち寄りください。",
      primaryButton: { text: "ビジター利用を予約する", href: reserveHref("visitor") },
      secondaryButton: { text: "料金プランを見る", href: "/pricing" },
    },
  },
  meeting: {
    catchcopy: ["打ち合わせから研修まで、", "人数に合わせて整える。"],
    intro: [
      "数名の打ち合わせから、数十名規模のセミナーや研修まで。人数と内容に合わせて、レイアウトを変えてご利用いただけます。",
      "着席なら最大80名まで対応します。Wi-Fiと印刷設備が揃っているので、資料の準備も会場でそのまま行えます。",
      "ご予約は1時間単位で承ります。通常会員の方は優先予約、法人会員の方は無料枠をご利用いただけます。",
    ],
    facts: [
      {
        label: "収容人数",
        value: `少人数〜着席最大${siteConfig.capacity.seated}名`,
      },
      { label: "利用時間", value: siteConfig.hours.regular },
      { label: "予約単位", value: "1時間単位" },
      { label: "設備", value: "高速Wi-Fi・プリンター・スキャナー" },
      { label: "会員特典", value: "優先予約（通常会員）／無料枠（法人会員）" },
      { label: "料金", value: "ご利用内容に応じてご案内" },
    ],
    highlights: [
      {
        title: "人数に合わせたレイアウト",
        description:
          `少人数の打ち合わせから着席${siteConfig.capacity.seated}名のセミナーまで、用途に合わせて空間を組み替えられます。`,
      },
      {
        title: "1時間単位で予約",
        description:
          "必要な時間だけ、1時間単位でご予約いただけます。開始・終了時刻はフォームから選べます。",
      },
      {
        title: "資料の印刷もその場で",
        description:
          "プリンター・スキャナーを常設。配布資料の追加印刷など、直前の準備にも対応できます。",
      },
      {
        title: "会員は優先予約・無料枠",
        description:
          "通常会員は会議室を優先して予約でき、法人会員には無料枠が付きます。定例会議の場所としても。",
      },
    ],
    scenes: [
      "打ち合わせ・商談",
      "社内会議",
      "セミナー・研修",
      "採用面接・説明会",
      "勉強会",
    ],
    recommendedFor: [
      "来客との打ち合わせ場所を探している方",
      "社外で会議や研修を行いたい企業",
      "セミナー・勉強会を主催する方",
      "定例ミーティングの場所を確保したいチーム",
    ],
    planIds: ["member", "corporate"],
    pricingNote:
      "会議室の料金は、人数・時間・ご利用内容に応じてご案内します。会員の方は優先予約や無料枠をご利用いただけます。",
    flow: reserveData.steps,
    faqIds: ["corporate", "event", "wifi", "parking"],
    cta: {
      title: "会議・セミナーのご予約を承ります。",
      description: "日時や人数が決まっていなくても、まずはご相談ください。",
      primaryButton: { text: "会議室を予約する", href: reserveHref("meeting") },
      secondaryButton: { text: "お問い合わせ", href: contactHref("general") },
    },
  },
  address: {
    catchcopy: ["富士市吉原に、", "事業の拠点を。"],
    intro: [
      "法人登記や、名刺・Webサイトに載せる事業所住所として、橘香堂の住所をご利用いただけます。自宅の住所を公開したくない方にも。",
      "郵便物の受け取りに対応しているほか、法人会員の方は来客対応も可能です。住所だけでなく、実際に働ける場所があるのが特長です。",
      "通常会員はオプションで住所利用、法人会員は法人登記に対応しています。料金の詳細はお問い合わせください。",
    ],
    facts: [
      {
        label: "登録住所",
        value: `${siteConfig.address.postal} ${siteConfig.address.full}`,
      },
      { label: "法人登記", value: "対応（法人会員）" },
      { label: "郵便物", value: "受け取り対応" },
      { label: "来客対応", value: "可（法人会員）" },
      { label: "作業スペース", value: "会員は営業時間内利用可" },
      { label: "料金", value: "別途オプション（お問い合わせ）" },
    ],
    highlights: [
      {
        title: "法人登記に対応",
        description:
          "法人会員プランでは、橘香堂の住所で法人登記ができます。富士市での開業・起業の拠点として。",
      },
      {
        title: "郵便物の受け取り",
        description:
          "事業所宛ての郵便物をお預かりします。住所を公開しても、自宅に郵便物が届くことはありません。",
      },
      {
        title: "来客にも対応",
        description:
          "法人会員の方は来客対応も承ります。取引先との打ち合わせは、館内の会議スペースで。",
      },
      {
        title: "住所と働く場所をひとつに",
        description:
          "登録した住所で、そのまま仕事ができます。住所だけのバーチャルオフィスとの違いです。",
      },
    ],
    scenes: [
      "法人登記",
      "事業所住所",
      "名刺・Webサイトへの記載",
      "郵便物の受け取り",
      "取引先との打ち合わせ",
    ],
    recommendedFor: [
      "富士市で起業・開業する方",
      "自宅住所を公開したくない個人事業主",
      "静岡県内に拠点を置きたい県外の企業",
      "登記と作業場所をまとめたい方",
    ],
    planIds: ["member", "corporate"],
    pricingNote:
      "住所登録サービスは別途オプションです。ご利用の形に合わせて料金をご案内しますので、お気軽にお問い合わせください。",
    flow: [
      {
        number: "01",
        title: "お問い合わせ",
        description: "フォームまたはお電話でご連絡ください",
      },
      {
        number: "02",
        title: "プランのご案内",
        description: "ご利用の形に合わせて内容と料金をご説明します",
      },
      {
        number: "03",
        title: "ご利用開始",
        description: "お手続き完了後、住所をご利用いただけます",
      },
    ],
    faqIds: ["address", "corporate", "payment"],
    cta: {
      title: "住所登録のご相談を承ります。",
      description: "登記や郵便物の扱いなど、わからないことがあればお問い合わせください。",
      primaryButton: { text: "住所登録について問い合わせる", href: contactHref("address") },
      secondaryButton: { text: "料金プランを見る", href: "/pricing" },
    },
  },
  event: {
    catchcopy: ["人が集まる場を、", "かたちにする。"],
    intro: [
      `展示会、ワークショップ、懇親会まで。着席で最大${siteConfig.capacity.seated}名、スタンディングなら最大${siteConfig.capacity.standing}名まで対応できる多目的スペースです。`,
      "机や椅子の配置は、イベントの内容に合わせて調整できます。貸切でのご利用も承ります。",
      "日程や人数、内容が固まっていない段階でも構いません。まずはやりたいことをお聞かせください。",
    ],
    facts: [
      { label: "着席", value: `最大${siteConfig.capacity.seated}名` },
      { label: "スタンディング", value: `最大${siteConfig.capacity.standing}名` },
      { label: "貸切", value: "対応" },
      { label: "設備", value: "高速Wi-Fi・プリンター・スキャナー" },
      { label: "アクセス", value: accessInfo.bus },
      { label: "料金", value: "内容に応じてお見積り" },
    ],
    highlights: [
      {
        title: `最大${siteConfig.capacity.standing}名の収容力`,
        description:
          `着席${siteConfig.capacity.seated}名、スタンディング${siteConfig.capacity.standing}名。小さな集まりから、地域のイベントまで対応します。`,
      },
      {
        title: "内容に合わせたレイアウト",
        description:
          "展示・講演・ワークショップなど、目的に合わせて空間をつくれます。",
      },
      {
        title: "貸切での利用",
        description:
          "スペースを貸し切ってご利用いただけます。周りを気にせず、イベントに集中できます。",
      },
      {
        title: "吉原の中心部から",
        description:
          "吉原中央駅バス停から徒歩5分。周辺にはコインパーキングもあります。",
      },
    ],
    scenes: [
      "展示会",
      "ワークショップ",
      "セミナー・講演会",
      "懇親会・パーティー",
      "ヨガ・各種教室",
    ],
    recommendedFor: [
      "地域でイベントや展示会を開きたい方",
      "ワークショップや教室の会場を探している方",
      "社内イベント・懇親会を企画している企業",
      "貸切できるスペースを探している方",
    ],
    planIds: [],
    estimateHref: contactHref("event"),
    pricingNote:
      "イベント・貸切の料金は、日時・人数・内容をうかがったうえでお見積りします。",
    flow: [
      {
        number: "01",
        title: "ご相談",
        description: "日程・人数・内容をフォームでお知らせください",
      },
      {
        number: "02",
        title: "お見積り・打ち合わせ",
        description: "レイアウトと料金をご提案します",
      },
      {
        number: "03",
        title: "当日のご利用",
        description: "確定した内容で、スペースをご利用いただけます",
      },
    ],
    faqIds: ["event", "parking", "payment"],
    cta: {
      title: "イベント・貸切のご相談を承ります。",
      description: "日程や人数が未定でも構いません。まずはお気軽にご相談ください。",
      primaryButton: { text: "イベントを相談する", href: contactHref("event") },
      secondaryButton: { text: "貸切の日程を予約する", href: reserveHref("private") },
    },
  },
};

// ====================================
// About page (/about)
// ====================================

export const aboutPageData = {
  intro: {
    title: "About",
    titleJa: "橘香堂について",
    description: "富士市吉原の、静かで上質なワークスペース。",
  },
  concept: {
    heading: ["集中、つながり、", "自由な働き方を。"],
    paragraphs: [
      "橘香堂は、ただ作業をする場所ではありません。集中して仕事に向き合い、必要なときには人とつながり、用途に応じて空間を自在に使える——そんな、新しい働き方のための場所です。",
      "富士市吉原の静かな環境の中で、起業家、フリーランス、リモートワーカーの皆さまの日々の仕事と成長をサポートいたします。",
    ],
  },
  values: [
    {
      titleEn: "Focus",
      title: "集中する",
      description:
        "静かな空間に、高速Wi-Fi・電源・フリードリンク。自分の仕事に向き合うための環境を、最初から整えています。",
    },
    {
      titleEn: "Connect",
      title: "つながる",
      description:
        "打ち合わせや商談、セミナーや勉強会。人と会い、話すための場所としてもお使いいただけます。",
    },
    {
      titleEn: "Flexible",
      title: "自在に使う",
      description: `1時間のビジター利用から月額会員、法人登記、最大${siteConfig.capacity.standing}名のイベントまで。働き方に合わせて使い方を選べます。`,
    },
  ],
  audiences: [
    {
      title: "起業家",
      description: "富士市での開業・起業の拠点に。法人登記にも対応しています。",
    },
    {
      title: "フリーランス",
      description: "決まった拠点を持たずに働く方の、日々の仕事場に。",
    },
    {
      title: "リモートワーカー",
      description: "自宅では集中しにくいときの、もうひとつの仕事場に。",
    },
    {
      title: "企業・団体",
      description: "社外での会議や研修、地域でのイベントの会場に。",
    },
  ],
  overview: [
    { label: "名称", value: siteConfig.officialName },
    { label: "所在地", value: `${siteConfig.address.postal} ${siteConfig.address.full}` },
    {
      label: "営業時間",
      value: `${siteConfig.hours.days} ${siteConfig.hours.regular}（最終入館 ${siteConfig.hours.lastEntry}）`,
    },
    { label: "延長利用", value: siteConfig.hours.extended },
    {
      label: "収容人数",
      value: `着席最大${siteConfig.capacity.seated}名 / スタンディング最大${siteConfig.capacity.standing}名`,
    },
    { label: "設備", value: "高速Wi-Fi・電源・フリードリンク・プリンター・スキャナー" },
    { label: "サービス", value: "コワーキング・会議室・貸切・住所登録（法人登記対応）" },
    { label: "電話番号", value: siteConfig.phone },
  ],
};

// ====================================
// Access page (/access)
// ====================================

export const accessPageData = {
  intro: {
    title: "Access",
    titleJa: "アクセス",
    description: `吉原の中心部、${accessInfo.bus}です。`,
  },
  routes: [
    {
      titleEn: "By Car",
      title: "お車でお越しの方",
      lines: [
        accessInfo.station,
        "専用駐車場はございません。周辺のコインパーキングをご利用ください。",
      ],
    },
    {
      titleEn: "By Bus",
      title: "バスでお越しの方",
      lines: [accessInfo.bus],
    },
  ],
  visitNotes: [
    "ビジター利用は予約不要です。営業時間内にそのままお越しください",
    `最終入館は${siteConfig.hours.lastEntry}です`,
    "会員の方は事前予約で22:00までご利用いただけます",
    "会議室・貸切のご利用は、事前にご予約ください",
  ],
};

// ====================================
// Privacy policy (/privacy)
// ====================================

export const privacyPolicy = {
  enactedAt: "2026年9月25日",
  revisedAt: "2026年9月26日",
  preamble: `${siteConfig.officialName}（以下「当施設」といいます）は、お客様の個人情報を適切に取り扱うことを重要な責務と考え、以下のとおりプライバシーポリシーを定めます。`,
  sections: [
    {
      title: "取得する個人情報",
      body: [
        "当施設は、ご予約・お問い合わせフォーム、お電話、ご来館時のお手続きなどを通じて、お名前、メールアドレス、電話番号、ご予約内容（利用日時・人数など）、お問い合わせ内容を取得します。",
      ],
    },
    {
      title: "利用目的",
      body: ["取得した個人情報は、次の目的の範囲内で利用します。"],
      list: [
        "ご予約の受付・確認・変更・キャンセルへの対応",
        "お問い合わせへの回答およびご連絡",
        "会員契約・法人契約・住所登録サービスのお手続きと提供",
        "施設の運営およびサービスの改善",
        "ウェブサイトへの不正な送信・アクセスの防止",
        "法令に基づく対応",
      ],
    },
    {
      title: "第三者への提供",
      body: ["当施設は、次の場合を除き、ご本人の同意なく個人情報を第三者に提供しません。"],
      list: [
        "法令に基づく場合",
        "人の生命・身体または財産の保護のために必要で、ご本人の同意を得ることが難しい場合",
        "国の機関や地方公共団体などが法令の定める事務を行うことに協力する必要がある場合",
      ],
    },
    {
      title: "業務の委託",
      body: [
        "当施設は、予約情報の保管やメールの送信などの業務を外部の事業者に委託することがあります。その場合は委託先を適切に選び、個人情報が安全に管理されるよう必要な監督を行います。",
      ],
    },
    {
      title: "Cookie とボット対策",
      body: [
        "当施設のウェブサイトでは、マイページにログインした状態を保つために Cookie を使用します。この Cookie はログインの確認のためだけに使い、広告や閲覧行動の追跡には使用しません。ブラウザで Cookie を無効にしている場合は、マイページにログインできません。",
        "ご予約・お問い合わせ・マイページのログインの各フォームでは、機械的な不正送信を防ぐため、Cloudflare, Inc. の「Cloudflare Turnstile」を使用しています。その際、IP アドレスやブラウザの情報などが同社に送信されます。同社での取り扱いは、同社のプライバシーポリシー（https://www.cloudflare.com/privacypolicy/）をご確認ください。",
      ],
    },
    {
      title: "安全管理",
      body: [
        "個人情報への不正アクセス、紛失、漏えいなどを防ぐため、必要かつ適切な安全管理措置を講じます。",
      ],
    },
    {
      title: "開示・訂正・削除のご請求",
      body: [
        "ご本人から個人情報の開示・訂正・利用停止・削除のご請求があった場合は、ご本人であることを確認したうえで、法令に従い速やかに対応します。",
      ],
    },
    {
      title: "本ポリシーの改定",
      body: [
        "本ポリシーは、法令の変更などに応じて改定することがあります。改定後の内容は、本ページに掲載した時点から効力を生じます。",
      ],
    },
  ],
};
