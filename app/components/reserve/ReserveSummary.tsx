interface SummaryData {
  name: string;
  email: string;
  phone?: string;
  type: string;
  date: string;
  time: string;
  numberOfPeople?: string;
  message: string;
}

interface ReserveSummaryProps {
  data: SummaryData;
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error?: string | null;
}

export default function ReserveSummary({
  data,
  onBack,
  onSubmit,
  isSubmitting,
  error,
}: ReserveSummaryProps) {
  const summaryItems = [
    { label: "お名前", value: data.name },
    { label: "メールアドレス", value: data.email },
    { label: "電話番号", value: data.phone || "−" },
    { label: "利用種別", value: data.type },
    { label: "希望日", value: data.date },
    { label: "希望時間", value: data.time },
    // 人数は入力がある場合のみ表示（貸切・イベント利用時）
    ...(data.numberOfPeople ? [{ label: "人数", value: data.numberOfPeople }] : []),
    { label: "お問い合わせ内容", value: data.message },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h3 className="font-[var(--font-cormorant)] text-2xl text-[#2C2C2C] mb-2">
          入力内容の確認
        </h3>
        <p className="text-sm text-[#6B6B6B]">
          以下の内容でよろしければ、送信ボタンを押してください。
        </p>
      </div>

      <dl className="border-t border-[#E5E4DF]">
        {summaryItems.map((item) => (
          <div
            key={item.label}
            className="py-4 border-b border-[#E5E4DF] grid grid-cols-3 gap-4"
          >
            <dt className="text-sm text-[#6B6B6B]">{item.label}</dt>
            <dd className="col-span-2 text-sm text-[#2C2C2C] whitespace-pre-wrap">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {error && (
        <div className="mt-6 p-4 bg-[#FDF2F2] border border-[#B85C5C] text-[#B85C5C] text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mt-10">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 text-sm tracking-wider text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8] transition-colors"
        >
          入力画面に戻る
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="flex-1 py-4 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] disabled:bg-[#8A8A8A] disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "送信中..." : "この内容で送信する"}
        </button>
      </div>
    </div>
  );
}
