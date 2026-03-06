import Link from "next/link";
import { CheckCircle } from "lucide-react";

interface ReserveCompleteProps {
  onReset: () => void;
}

export default function ReserveComplete({ onReset }: ReserveCompleteProps) {
  return (
    <div className="max-w-xl mx-auto text-center">
      <div className="mb-8">
        <CheckCircle className="w-16 h-16 mx-auto text-[#5C6B5C]" strokeWidth={1} />
      </div>

      <h3 className="font-[var(--font-cormorant)] text-3xl text-[#2C2C2C] mb-4">
        送信が完了しました
      </h3>

      <p className="text-[#6B6B6B] leading-relaxed mb-8">
        お問い合わせいただきありがとうございます。
        <br />
        内容を確認のうえ、担当者より折り返しご連絡いたします。
        <br />
        しばらくお待ちくださいませ。
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] transition-colors"
        >
          トップページへ
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-wider text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8] transition-colors"
        >
          新しい予約をする
        </button>
      </div>
    </div>
  );
}
