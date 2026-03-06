import Link from "next/link";
import { siteConfig } from "@/app/data/site";

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-32 lg:py-40"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Reserve */}
          <div className="bg-[#F7F6F3] p-8 lg:p-12">
            <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-4">
              RESERVE
            </p>
            <h3 className="font-[var(--font-cormorant)] text-2xl lg:text-3xl text-[#2C2C2C] mb-4">
              ご予約
            </h3>
            <p className="text-[#6B6B6B] leading-relaxed mb-8">
              見学、ビジター利用、会議室予約、
              <br className="hidden sm:block" />
              貸切利用のご予約を承ります。
            </p>
            <Link
              href="/reserve"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] transition-colors"
            >
              <span>予約する</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* Right Column - Contact */}
          <div>
            <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-4">
              CONTACT
            </p>
            <h3
              id="contact-heading"
              className="font-[var(--font-cormorant)] text-2xl lg:text-3xl text-[#2C2C2C] mb-4"
            >
              お問い合わせ
            </h3>
            <p className="text-[#6B6B6B] leading-relaxed mb-8">
              ご質問、法人契約、イベント利用など、
              <br className="hidden sm:block" />
              お気軽にお問い合わせください。
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-sm tracking-wider text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8] transition-colors mb-12"
            >
              <span>お問い合わせ</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>

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
                <p className="text-xs tracking-wider text-[#8A8A8A] mb-2">
                  所在地
                </p>
                <p className="text-[#2C2C2C]">
                  {siteConfig.address.postal}
                  <br />
                  {siteConfig.address.full}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
