import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { primaryActions } from "@/app/data/site";

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
        ご予約を受け付けました
      </h3>

      <p className="text-[#6B6B6B] leading-relaxed mb-6">
        お申し込みいただきありがとうございます。
        <br />
        内容を確認のうえ、担当者より確認のご連絡をいたします。
        <br />
        しばらくお待ちくださいませ。
      </p>

      <p className="text-sm text-[#6B6B6B] leading-relaxed mb-8">
        ご入力のメールアドレスに、予約受付メールをお送りしました。
        <br className="hidden sm:inline" />
        メール内のリンクか
        <Link href={primaryActions.mypage.href} className="underline underline-offset-2 hover:text-[#2C2C2C]">
          マイページ
        </Link>
        から、ご予約内容の確認・キャンセルができます。
      </p>

      {/* 横並びでは長いほうの文字幅に合わせて2つを同じ幅にする */}
      <div className="grid gap-4 sm:w-fit sm:mx-auto sm:grid-flow-col sm:auto-cols-fr">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] border border-transparent hover:bg-[#3D3D3D] transition-colors"
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
