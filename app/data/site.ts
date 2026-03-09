export const siteConfig = {
  name: "橘香堂",
  nameEn: "worx mt.fuji",
  tagline: "働く場所から、仕事の質を整える。",
  description: "富士市吉原の、静かで上質なワークスペース。",
  phone: "0545-67-7400",
  email: "info@mtfuji-kikkou.com",
  address: {
    postal: "〒417-0051",
    full: "静岡県富士市吉原2丁目8番21-2号",
    short: "静岡県富士市吉原2-8-21-2",
  },
  hours: {
    regular: "9:00–18:00",
    lastEntry: "17:30",
    extended: "22:00（会員予約制）",
    days: "平日・土日祝",
  },
  capacity: {
    seated: 80,
    standing: 150,
  },
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.760906869442!2d138.68491027576485!3d35.16258317275916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x601a2b3b80616499%3A0x6c57d4d775647025!2z5qmY6aaZ5aCC6L-R6Jek6Yas5bGA77yId29yeCBtdC5mdWpp77yJ!5e0!3m2!1sja!2sjp!4v1772772222596!5m2!1sja!2sjp",
};

export const navigation = [
  { name: "Space", href: "/space" },
  { name: "Pricing", href: "/pricing" },
  { name: "FAQ", href: "/faq" },
  { name: "Access", href: "/#access" },
  { name: "Contact", href: "/contact" },
];

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
    image: "/images/slide1.webp",
  },
  {
    id: "business",
    title: "ビジネスサポート",
    description:
      "高性能プリンター・スキャナーを常設。急な印刷やスキャンにも対応。",
    image: "/images/slide2.webp",
  },
  {
    id: "address",
    title: "住所登録サービス",
    description:
      "法人登記、事業所住所として利用可能。郵便物の受け取りにも対応いたします。",
    image: "/images/slide3.webp",
  },
  {
    id: "flexible",
    title: "柔軟な利用形態",
    description:
      "会議やセミナー、小規模イベントまで。空間を自在にカスタマイズしてご利用いただけます。",
    image: "/images/yoga.jpg",
  },
];

export const pricingPlans = [
  {
    id: "visitor",
    name: "ビジター",
    nameEn: "Visitor",
    price: "¥550",
    unit: "/ 1時間",
    description: "お試し利用や、短時間のご利用に。",
    features: ["Wi-Fi利用可", "電源利用可", "フリードリンク"],
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
      description: "初めての方、短時間のご利用に最適。予約不要でお気軽にご利用いただけます。",
      features: [
        { text: "Wi-Fi利用可", included: true },
        { text: "電源利用可", included: true },
        { text: "フリードリンク", included: true },
        { text: "会議室利用", included: false },
        { text: "延長営業", included: false },
        { text: "住所登録", included: false },
      ],
    },
    {
      id: "member",
      name: "通常会員",
      nameEn: "Regular",
      price: "¥8,800",
      unit: "/ 月",
      description: "定期的に利用される方へ。時間を気にせず、集中して作業に取り組めます。",
      features: [
        { text: "営業時間内使い放題", included: true },
        { text: "Wi-Fi・電源・ドリンク", included: true },
        { text: "会議室優先予約", included: true },
        { text: "22:00まで延長可能", included: true },
        { text: "住所利用可（別途）", included: true },
        { text: "法人登記", included: false },
      ],
      highlighted: true,
    },
    {
      id: "corporate",
      name: "法人会員",
      nameEn: "Corporate",
      price: "¥16,500",
      unit: "/ 月〜",
      description: "チームでのご利用、法人登記をご希望の方へ。ビジネスの拠点としてお使いいただけます。",
      features: [
        { text: "複数名での利用可", included: true },
        { text: "法人登記対応", included: true },
        { text: "専用ロッカー", included: true },
        { text: "来客対応可", included: true },
        { text: "会議室無料枠付き", included: true },
        { text: "郵便物受け取り", included: true },
      ],
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

export const faqItems = [
  {
    question: "ビジター利用は可能ですか？",
    answer:
      "はい、可能です。予約不要で、1時間550円（税込）からご利用いただけます。初めての方もお気軽にお越しください。",
  },
  {
    question: "会員は何時まで利用できますか？",
    answer:
      "通常の営業時間は9:00〜18:00（最終入館17:30）ですが、会員の方は事前予約により22:00まで延長してご利用いただけます。",
  },
  {
    question: "法人契約はできますか？",
    answer:
      "はい、法人会員プランをご用意しております。複数名でのご利用、法人登記、郵便物の受け取りなどに対応しています。詳細はお問い合わせください。",
  },
  {
    question: "イベント利用は可能ですか？",
    answer:
      "はい、セミナー、ワークショップ、展示会など、様々なイベントにご利用いただけます。着席最大80名、スタンディング最大150名まで対応可能です。",
  },
  {
    question: "駐車場はありますか？",
    answer:
      "専用駐車場はございませんが、周辺にコインパーキングがございます。お車でお越しの際はそちらをご利用ください。",
  },
  {
    question: "住所登録サービスは使えますか？",
    answer:
      "はい、法人登記や事業所住所としてご利用いただける住所登録サービスを提供しています。郵便物の受け取りにも対応しております。",
  },
  {
    question: "支払い方法について教えてください。",
    answer:
      "現金、クレジットカード、各種キャッシュレス決済に対応しております。会員費は口座振替またはクレジットカードでのお支払いとなります。",
  },
  {
    question: "Wi-Fiは使えますか？",
    answer:
      "はい、高速Wi-Fiを全館で無料でご利用いただけます。安定した通信環境でリモートワークやオンライン会議にも対応しています。",
  },
  {
    question: "飲食の持ち込みはできますか？",
    answer:
      "はい、可能です。フリードリンクもご用意しておりますので、ご自由にご利用ください。",
  },
];

export const reserveData = {
  intro: {
    title: "Reserve",
    titleJa: "ご予約・お問い合わせ",
    description: "ご利用内容に合わせて、ご予約を承ります。",
  },
  steps: [
    { number: "01", title: "利用内容を選択", description: "ご希望の利用タイプをお選びください" },
    { number: "02", title: "日時と情報を入力", description: "ご希望の日時と連絡先をご入力ください" },
    { number: "03", title: "内容確認・送信", description: "入力内容をご確認のうえ送信してください" },
  ],
  types: [
    { value: "visitor", label: "ビジター利用", requiresPeople: false },
    { value: "coworking", label: "コワーキング利用", requiresPeople: false },
    { value: "kids", label: "キッズスペース利用", requiresPeople: false },
    { value: "meeting", label: "会議室予約", requiresPeople: false },
    { value: "private", label: "貸切利用", requiresPeople: true },
    { value: "event", label: "イベント・法人相談", requiresPeople: true },
  ],
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
  notes: [
    "ご予約確定後、担当者より確認のご連絡をいたします",
    "キャンセルは前日17:00までにご連絡ください",
    "当日のご予約変更は電話にてお問い合わせください",
  ],
};
