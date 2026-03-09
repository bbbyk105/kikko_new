import Image from "next/image";
import Link from "next/link";
import { images } from "@/app/data/site";

export default function FinalCTA() {
  return (
    <section
      id="contact"
      className="relative py-32 lg:py-40"
      aria-labelledby="cta-heading"
    >
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        {/* 
          差し替え箇所: 
          1. /public/images/cta-background.jpg に実際の写真を配置
          2. data/site.ts の images.cta を更新
        */}
        <Image
          src={images.cta}
          alt=""
          fill
          className="object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-[#2C2C2C]/70" />
      </div>

      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center text-[#FAFAF8]">
          {/* Heading */}
          <h2
            id="cta-heading"
            className="font-[var(--font-cormorant)] text-3xl md:text-4xl lg:text-5xl leading-tight tracking-wide mb-6"
          >
            空間を、
            <br className="sm:hidden" />
            実際にご覧ください。
          </h2>

          {/* Sub Text */}
          <p className="text-[#B0B0B0] leading-relaxed mb-12">
            お問い合わせはお気軽にどうぞ。
            <br />
            お電話またはフォームよりご連絡ください。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="mailto:info@mtfuji-kikkou.com"
              className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-wider text-[#2C2C2C] bg-[#FAFAF8] hover:bg-[#F0EFE9] transition-colors"
            >
              ご予約
            </Link>
            <a
              href="tel:0545-67-7400"
              className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-wider text-[#FAFAF8] border border-[#FAFAF8] hover:bg-[#FAFAF8] hover:text-[#2C2C2C] transition-colors"
            >
              電話でお問い合わせ
            </a>
          </div>

          {/* Phone Number */}
          <p className="mt-8 text-sm text-[#8A8A8A]">
            TEL: 0545-67-7400（9:00–18:00）
          </p>
        </div>
      </div>
    </section>
  );
}
