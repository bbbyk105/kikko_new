"use client";

import { useState, type FormEvent } from "react";
import { requestLoginLink } from "@/app/actions/customer";
import { siteConfig } from "@/app/data/site";
import { FormField, fieldA11yProps, fieldClassName } from "@/app/components/ui/form-field";
import { primaryButtonClass } from "@/app/components/reserve/buttons";

/** マイページのログイン（メールアドレス宛にログイン用リンクを送る） */
export default function LoginForm({ notice }: { notice?: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await requestLoginLink(email);
      if (result.success) {
        setSentTo(email.trim());
      } else {
        setError(result.error);
      }
    } catch {
      setError("送信に失敗しました。しばらく経ってからお試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white border border-[#E5E4DF] p-6 sm:p-10">
      <h2 className="font-[var(--font-cormorant)] text-2xl text-[#2C2C2C] mb-3">ログイン</h2>

      {notice && !sentTo && (
        <p role="alert" className="mb-6 p-4 bg-[#FDF2F2] border border-[#B85C5C] text-[#B85C5C] text-sm leading-relaxed">
          {notice}
        </p>
      )}

      {sentTo ? (
        <div role="status" className="text-sm text-[#6B6B6B] leading-relaxed space-y-3">
          <p className="text-[#2C2C2C]">
            {sentTo} でのご予約がある場合は、ログイン用のリンクをお送りしました。メール内のリンクを開いてください。
          </p>
          <p>
            数分たっても届かないときは、迷惑メールフォルダをご確認いただくか、お電話（
            <a
              href={`tel:${siteConfig.phone}`}
              className="whitespace-nowrap underline underline-offset-2 hover:text-[#2C2C2C]"
            >
              {siteConfig.phone}
            </a>
            ）でお問い合わせください。
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-[#6B6B6B] leading-relaxed mb-8">
            ご予約時のメールアドレスを入力してください。ログイン用のリンクをメールでお送りします（パスワードは不要です）。
          </p>
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <FormField id="login-email" label="メールアドレス" required error={error ?? undefined}>
              <input
                type="email"
                id="login-email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClassName(!!error)}
                placeholder="example@email.com"
                {...fieldA11yProps("login-email", error ?? undefined)}
              />
            </FormField>
            <button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className={`${primaryButtonClass} w-full`}
            >
              {isSubmitting ? "送信中..." : "ログイン用のリンクを送る"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
