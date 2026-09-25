import type { Metadata } from "next";
import PageHero from "@/app/components/section/PageHero";
import { privacyPolicy, siteConfig, primaryActions } from "@/app/data/site";
import { ArrowLink } from "@/app/components/ui/arrow-link";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "橘香堂（worx mt.fuji）における個人情報の取り扱いについて。",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        title="Privacy Policy"
        titleJa="プライバシーポリシー"
        description="個人情報の取り扱いについて"
        breadcrumbs={[{ name: "Privacy Policy", href: "/privacy" }]}
      />

      <section className="pb-28 lg:pb-36">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <article className="max-w-3xl">
            <p className="text-[14px] md:text-[15px] leading-[2.1] tracking-[0.02em] text-[#6B6B6B] mb-16">
              {privacyPolicy.preamble}
            </p>

            <ol className="space-y-14">
              {privacyPolicy.sections.map((section, index) => (
                <li key={section.title} className="pt-8 border-t border-[#E5E4DF]">
                  <h2 className="flex items-baseline gap-4 mb-5 text-[15px] md:text-base font-medium tracking-[0.04em] text-[#2C2C2C]">
                    <span className="font-[var(--font-cormorant)] text-xl text-[#B5B4AE]" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </h2>
                  <div className="space-y-4 text-[14px] leading-[2] tracking-[0.02em] text-[#6B6B6B]">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {"list" in section && section.list && (
                      <ul className="space-y-2 pl-1">
                        {section.list.map((item) => (
                          <li key={item} className="flex items-baseline gap-3">
                            <span className="text-[#5C6B5C]" aria-hidden="true">
                              •
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              ))}

              {/* お問い合わせ窓口 */}
              <li className="pt-8 border-t border-[#E5E4DF]">
                <h2 className="flex items-baseline gap-4 mb-5 text-[15px] md:text-base font-medium tracking-[0.04em] text-[#2C2C2C]">
                  <span className="font-[var(--font-cormorant)] text-xl text-[#B5B4AE]" aria-hidden="true">
                    {String(privacyPolicy.sections.length + 1).padStart(2, "0")}
                  </span>
                  お問い合わせ窓口
                </h2>
                <p className="text-[14px] leading-[2] tracking-[0.02em] text-[#6B6B6B] mb-6">
                  個人情報の取り扱いに関するお問い合わせは、下記までご連絡ください。
                </p>
                <dl className="p-8 bg-[#F7F6F3] space-y-3 text-[14px] leading-[1.9] tracking-[0.02em]">
                  <div className="flex flex-col sm:flex-row sm:gap-6">
                    <dt className="sm:w-24 shrink-0 text-[12px] text-[#9A9A9A] sm:pt-0.5">名称</dt>
                    <dd className="text-[#2C2C2C]">
                      {siteConfig.name}（{siteConfig.nameEn}）
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-6">
                    <dt className="sm:w-24 shrink-0 text-[12px] text-[#9A9A9A] sm:pt-0.5">所在地</dt>
                    <dd className="text-[#2C2C2C]">
                      {siteConfig.address.postal} {siteConfig.address.full}
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-6">
                    <dt className="sm:w-24 shrink-0 text-[12px] text-[#9A9A9A] sm:pt-0.5">電話番号</dt>
                    <dd>
                      <a href={`tel:${siteConfig.phone}`} className="text-[#2C2C2C] hover:text-[#5C6B5C] transition-colors">
                        {siteConfig.phone}
                      </a>
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:gap-6">
                    <dt className="sm:w-24 shrink-0 text-[12px] text-[#9A9A9A] sm:pt-0.5">メール</dt>
                    <dd>
                      <a href={`mailto:${siteConfig.email}`} className="text-[#2C2C2C] hover:text-[#5C6B5C] transition-colors">
                        {siteConfig.email}
                      </a>
                    </dd>
                  </div>
                </dl>
                <div className="mt-8">
                  <ArrowLink href={primaryActions.contact.href}>お問い合わせフォームへ</ArrowLink>
                </div>
              </li>
            </ol>

            <p className="mt-16 text-[12px] tracking-[0.05em] text-[#9A9A9A]">
              制定日：{privacyPolicy.enactedAt}
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
