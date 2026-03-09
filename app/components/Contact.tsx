import Link from "next/link";
import { siteConfig } from "@/app/data/site";
import { Eyebrow, SectionHeading, LeadText, BlockLabel } from "@/app/components/ui/typography";

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-36 lg:py-48"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Left Column - Reserve */}
          <div className="bg-[#F7F6F3] p-10 lg:p-14">
            <Eyebrow className="mb-5">Reserve</Eyebrow>
            <SectionHeading as="h3" size="compact" className="mb-5">
              ご予約
            </SectionHeading>
            <LeadText className="mb-10">
              ビジター利用、会議室予約、
              <br className="hidden sm:block" />
              貸切利用のご予約を承ります。
            </LeadText>
            <Link
              href="/reserve"
              className="inline-flex items-center gap-2 px-8 py-4 text-[12px] tracking-[0.12em] text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] transition-colors"
            >
              <span>予約する</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
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
            <Eyebrow className="mb-5">Contact</Eyebrow>
            <SectionHeading as="h3" id="contact-heading" size="compact" className="mb-5">
              お問い合わせ
            </SectionHeading>
            <LeadText className="mb-10">
              ご質問、法人契約、イベント利用など、
              <br className="hidden sm:block" />
              お気軽にお問い合わせください。
            </LeadText>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 text-[12px] tracking-[0.12em] text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8] transition-colors mb-14"
            >
              <span>お問い合わせ</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
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
            <div className="space-y-8 pt-10 border-t border-[#E5E4DF]">
              <div>
                <BlockLabel className="mb-3">電話でのお問い合わせ</BlockLabel>
                <a
                  href={`tel:${siteConfig.phone}`}
                  className="font-[var(--font-cormorant)] text-[1.625rem] text-[#2C2C2C] hover:text-[#5C6B5C] transition-colors tracking-wide"
                >
                  {siteConfig.phone}
                </a>
                <p className="text-[12px] tracking-[0.03em] text-[#9A9A9A] mt-2">
                  {siteConfig.hours.days} {siteConfig.hours.regular}
                </p>
              </div>
              <div>
                <BlockLabel className="mb-3">所在地</BlockLabel>
                <p className="text-[14px] leading-[1.9] tracking-[0.02em] text-[#2C2C2C]">
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
