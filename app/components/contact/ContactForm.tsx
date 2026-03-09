"use client";

import { useState } from "react";
import { siteConfig } from "@/app/data/site";

type FormData = {
  name: string;
  email: string;
  phone: string;
  inquiryType: string;
  message: string;
};

type FormErrors = {
  [key in keyof FormData]?: string;
};

const inquiryTypes = [
  { value: "", label: "お問い合わせ種別を選択" },
  { value: "general", label: "一般的なご質問" },
  { value: "membership", label: "会員登録について" },
  { value: "corporate", label: "法人契約について" },
  { value: "event", label: "イベント利用について" },
  { value: "other", label: "その他" },
];

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "お名前を入力してください";
    }

    if (!formData.email.trim()) {
      newErrors.email = "メールアドレスを入力してください";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "正しいメールアドレスを入力してください";
    }

    if (!formData.inquiryType) {
      newErrors.inquiryType = "お問い合わせ種別を選択してください";
    }

    if (!formData.message.trim()) {
      newErrors.message = "お問い合わせ内容を入力してください";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

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
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              name: "",
              email: "",
              phone: "",
              inquiryType: "",
              message: "",
            });
          }}
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
      <div>
        <h2 className="font-[var(--font-cormorant)] text-2xl lg:text-3xl text-[#2C2C2C] mb-6">
          ご質問・ご相談
        </h2>
        <p className="text-[#6B6B6B] leading-relaxed mb-12">
          会員登録、法人契約、イベント利用など、
          <br className="hidden lg:block" />
          お気軽にお問い合わせください。
          <br />
          担当者より折り返しご連絡いたします。
        </p>

        {/* Contact Info */}
        <div className="space-y-6 pt-8 border-t border-[#E5E4DF]">
          <div>
            <p className="text-xs tracking-wider text-[#8A8A8A] mb-2">
              電話でのお問い合わせ
            </p>
            <a
              href={`tel:${siteConfig.phone}`}
              className="font-[var(--font-cormorant)] text-2xl text-[#2C2C2C] hover:text-[#5C6B5C] transition-colors"
            >
              {siteConfig.phone}
            </a>
            <p className="text-sm text-[#8A8A8A] mt-1">
              {siteConfig.hours.days} {siteConfig.hours.regular}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-wider text-[#8A8A8A] mb-2">所在地</p>
            <p className="text-[#2C2C2C]">
              {siteConfig.address.postal}
              <br />
              {siteConfig.address.full}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Form */}
      <div>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm text-[#2C2C2C] mb-2">
              お名前 <span className="text-[#B85C5C]">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.name ? "border-[#B85C5C]" : "border-[#E5E4DF]"
              } text-[#2C2C2C] placeholder-[#B0B0B0] focus:outline-none focus:border-[#5C6B5C] transition-colors`}
              placeholder="山田 太郎"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-sm text-[#B85C5C]">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm text-[#2C2C2C] mb-2"
            >
              メールアドレス <span className="text-[#B85C5C]">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.email ? "border-[#B85C5C]" : "border-[#E5E4DF]"
              } text-[#2C2C2C] placeholder-[#B0B0B0] focus:outline-none focus:border-[#5C6B5C] transition-colors`}
              placeholder="example@email.com"
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-sm text-[#B85C5C]">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm text-[#2C2C2C] mb-2"
            >
              電話番号
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white border border-[#E5E4DF] text-[#2C2C2C] placeholder-[#B0B0B0] focus:outline-none focus:border-[#5C6B5C] transition-colors"
              placeholder="090-1234-5678"
            />
          </div>

          {/* Inquiry Type */}
          <div>
            <label
              htmlFor="inquiryType"
              className="block text-sm text-[#2C2C2C] mb-2"
            >
              お問い合わせ種別 <span className="text-[#B85C5C]">*</span>
            </label>
            <select
              id="inquiryType"
              name="inquiryType"
              value={formData.inquiryType}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border ${
                errors.inquiryType ? "border-[#B85C5C]" : "border-[#E5E4DF]"
              } text-[#2C2C2C] focus:outline-none focus:border-[#5C6B5C] transition-colors appearance-none cursor-pointer`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B6B6B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 1rem center",
                backgroundSize: "1.25rem",
              }}
              aria-invalid={!!errors.inquiryType}
              aria-describedby={
                errors.inquiryType ? "inquiryType-error" : undefined
              }
            >
              {inquiryTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.inquiryType && (
              <p id="inquiryType-error" className="mt-1 text-sm text-[#B85C5C]">
                {errors.inquiryType}
              </p>
            )}
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm text-[#2C2C2C] mb-2"
            >
              お問い合わせ内容 <span className="text-[#B85C5C]">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              className={`w-full px-4 py-3 bg-white border ${
                errors.message ? "border-[#B85C5C]" : "border-[#E5E4DF]"
              } text-[#2C2C2C] placeholder-[#B0B0B0] focus:outline-none focus:border-[#5C6B5C] transition-colors resize-none`}
              placeholder="ご質問やご相談内容をお気軽にご記入ください。"
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-sm text-[#B85C5C]">
                {errors.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] disabled:bg-[#8A8A8A] disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "送信中..." : "送信する"}
            </button>
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-[#8A8A8A] leading-relaxed">
            ご入力いただいた個人情報は、お問い合わせへの対応およびご連絡のためにのみ使用いたします。
          </p>
        </form>
      </div>
    </div>
  );
}
