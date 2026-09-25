import type { Metadata } from "next";
import PageHero from "@/app/components/section/PageHero";
import BottomCTA from "@/app/components/section/BottomCTA";
import SectionIntro from "@/app/components/section/SectionIntro";
import { ArrowLink } from "@/app/components/ui/arrow-link";
import { BulletList } from "@/app/components/ui/bullet-list";
import { BlockLabel, CardTitle } from "@/app/components/ui/typography";
import { accessPageData, siteConfig, primaryActions } from "@/app/data/site";

export const metadata: Metadata = {
  title: "アクセス",
  description: `橘香堂（worx mt.fuji）へのアクセス。${siteConfig.address.full}。吉原中央駅バス停から徒歩5分、JR富士駅から車で約10分。`,
  alternates: { canonical: "/access" },
};

const infoRows = [
  {
    label: "所在地",
    value: (
      <>
        {siteConfig.address.postal}
        <br />
        {siteConfig.address.full}
      </>
    ),
  },
  {
    label: "営業時間",
    value: (
      <>
        {siteConfig.hours.days} {siteConfig.hours.regular}
        <span className="block text-[12px] text-[#9A9A9A] mt-1">
          最終入館 {siteConfig.hours.lastEntry} / 会員は事前予約で{siteConfig.hours.extendedUntil}まで
        </span>
      </>
    ),
  },
  {
    label: "電話番号",
    value: (
      <a href={`tel:${siteConfig.phone}`} className="hover:text-[#5C6B5C] transition-colors">
        {siteConfig.phone}
      </a>
    ),
  },
];

export default function AccessPage() {
  const { intro, routes, visitNotes } = accessPageData;

  return (
    <>
      <PageHero
        title={intro.title}
        titleJa={intro.titleJa}
        description={intro.description}
        breadcrumbs={[{ name: "Access", href: "/access" }]}
      />

      {/* Map */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="relative h-[360px] md:h-auto md:aspect-[16/7] overflow-hidden bg-[#F0EFE9]">
            <iframe
              src={siteConfig.googleMapsEmbed}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="橘香堂の所在地（Google マップ）"
              className="absolute inset-0 w-full h-full"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <ArrowLink href={siteConfig.googleMapsLink} external>
              Google マップで開く
            </ArrowLink>
          </div>
        </div>
      </section>

      {/* Info & Routes */}
      <section className="pb-28 lg:pb-36">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">
            {/* Info */}
            <div>
              <SectionIntro label="Information" title="所在地・営業時間" />
              <dl className="border-t border-[#E5E4DF]">
                {infoRows.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-6 py-6 border-b border-[#E5E4DF]"
                  >
                    <dt className="text-[12px] tracking-[0.1em] text-[#9A9A9A] sm:pt-0.5">{row.label}</dt>
                    <dd className="sm:col-span-3 text-[14px] leading-[1.9] tracking-[0.02em] text-[#2C2C2C]">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-14">
                <h3 className="text-sm tracking-wider text-[#6B6B6B] mb-6">ご来館にあたって</h3>
                <BulletList items={visitNotes} />
              </div>
            </div>

            {/* Routes */}
            <div>
              <SectionIntro label="How to get here" title="交通のご案内" />
              <ul className="space-y-6">
                {routes.map((route) => (
                  <li key={route.title} className="p-8 lg:p-10 bg-[#F7F6F3]">
                    <BlockLabel className="mb-3">{route.titleEn}</BlockLabel>
                    <CardTitle className="mb-4">{route.title}</CardTitle>
                    <ul className="space-y-2">
                      {route.lines.map((line) => (
                        <li
                          key={line}
                          className="text-[14px] leading-[1.9] tracking-[0.02em] text-[#6B6B6B]"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <BottomCTA
        title="ご来館をお待ちしています。"
        description="会議室・貸切のご利用は、予約フォームから日時をお選びいただけます。"
        primaryButton={{ text: primaryActions.reserve.label, href: primaryActions.reserve.href }}
        secondaryButton={{ text: primaryActions.contact.label, href: primaryActions.contact.href }}
      />
    </>
  );
}
