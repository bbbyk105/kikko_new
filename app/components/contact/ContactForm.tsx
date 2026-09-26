"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useContactForm } from "@/app/hooks/use-contact-form";
import { Turnstile, TurnstileFailedNotice, useTurnstile } from "@/app/components/ui/turnstile";
import type { InquiryType } from "@/lib/routes";
import { inquiryTypeOptions } from "@/lib/validation/contact";
import { FormField, fieldA11yProps, fieldClassName } from "@/app/components/ui/form-field";

const selectArrowStyle = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B6B6B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "right 1rem center",
  backgroundSize: "1.25rem",
} as const;

interface ContactFormProps {
  /** 左カラムの案内（Server Component で描画して渡す） */
  aside: ReactNode;
  /** ?type= 付きで来たときのお問い合わせ種別 */
  initialType?: InquiryType;
}

export default function ContactForm({ aside, initialType }: ContactFormProps) {
  const human = useTurnstile();
  const {
    values,
    errors,
    submitError,
    isSubmitting,
    isSubmitted,
    handleChange,
    handleSubmit,
    reset,
  } = useContactForm(initialType, human);

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="mb-8">
          <svg
            className="w-16 h-16 mx-auto text-[#5C6B5C]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="font-[var(--font-cormorant)] text-3xl text-[#2C2C2C] mb-4">
          お問い合わせを受け付けました
        </h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-8">
          内容を確認の上、担当者より折り返しご連絡いたします。
          <br />
          しばらくお待ちくださいませ。
        </p>
        <button
          type="button"
          onClick={reset}
          className="text-sm text-[#5C6B5C] hover:text-[#4A5A4A] underline underline-offset-4 transition-colors"
        >
          新しいお問い合わせを送信
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
      {/* Left Column - Info */}
      {aside}

      {/* Right Column - Form */}
      <div>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <FormField id="name" label="お名前" required error={errors.name}>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
              className={fieldClassName(!!errors.name)}
              placeholder="山田 太郎"
              {...fieldA11yProps("name", errors.name)}
            />
          </FormField>

          <FormField id="email" label="メールアドレス" required error={errors.email}>
            <input
              type="email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              className={fieldClassName(!!errors.email)}
              placeholder="example@email.com"
              {...fieldA11yProps("email", errors.email)}
            />
          </FormField>

          <FormField id="phone" label="電話番号">
            <input
              type="tel"
              id="phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              className={fieldClassName()}
              placeholder="090-1234-5678"
            />
          </FormField>

          <FormField id="inquiryType" label="お問い合わせ種別" required error={errors.inquiryType}>
            <select
              id="inquiryType"
              name="inquiryType"
              value={values.inquiryType}
              onChange={handleChange}
              className={fieldClassName(!!errors.inquiryType, "appearance-none cursor-pointer")}
              style={selectArrowStyle}
              {...fieldA11yProps("inquiryType", errors.inquiryType)}
            >
              <option value="">お問い合わせ種別を選択</option>
              {inquiryTypeOptions.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField id="message" label="お問い合わせ内容" required error={errors.message}>
            <textarea
              id="message"
              name="message"
              value={values.message}
              onChange={handleChange}
              rows={6}
              className={fieldClassName(!!errors.message, "resize-none")}
              placeholder="ご質問やご相談内容をお気軽にご記入ください。"
              {...fieldA11yProps("message", errors.message)}
            />
          </FormField>

          {submitError && (
            <p className="text-sm text-[#B85C5C]" role="alert">
              {submitError}
            </p>
          )}

          <Turnstile action="contact" {...human.widgetProps} />
          {human.failed && <TurnstileFailedNotice />}

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !human.ready}
              className="w-full py-4 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] disabled:bg-[#8A8A8A] disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "送信中..." : "送信する"}
            </button>
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-[#8A8A8A] leading-relaxed">
            ご入力いただいた個人情報は、お問い合わせへの対応およびご連絡のためにのみ使用いたします。詳しくは
            <Link href="/privacy" className="underline underline-offset-2 hover:text-[#2C2C2C] transition-colors">
              プライバシーポリシー
            </Link>
            をご覧ください。
          </p>
        </form>
      </div>
    </div>
  );
}
