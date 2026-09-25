import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/app/components/section/PageHero";
import BottomCTA from "@/app/components/section/BottomCTA";
import SectionIntro from "@/app/components/section/SectionIntro";
import { ArrowLink } from "@/app/components/ui/arrow-link";
import {
  BlockLabel,
  CardTitle,
  DecorativeNumber,
  Eyebrow,
  LeadText,
  SectionHeading,
} from "@/app/components/ui/typography";
import { aboutPageData, images, primaryActions } from "@/app/data/site";

export const metadata: Metadata = {
  title: "橘香堂について",
  description:
    "富士市吉原のコワーキングスペース「橘香堂（worx mt.fuji）」のコンセプトと施設概要。集中、つながり、自由な働き方のための場所です。",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const { intro, concept, values, audiences, overview } = aboutPageData;

  return (
    <>
      <PageHero
        title={intro.title}
        titleJa={intro.titleJa}
        description={intro.description}
        breadcrumbs={[{ name: "About", href: "/about" }]}
      />

      {/* Concept */}
      <section className="pb-28 lg:pb-40" aria-labelledby="concept-heading">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={images.about}
                  alt="橘香堂の落ち着いた雰囲気の作業スペース"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div
                className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#F0EFE9] -z-10"
                aria-hidden="true"
              />
            </div>

            <div className="lg:pl-4">
              <Eyebrow>Concept</Eyebrow>
              <SectionHeading id="concept-heading" size="large">
                {concept.heading.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </SectionHeading>
              <div className="space-y-5 mt-8">
                {concept.paragraphs.map((paragraph) => (
                  <LeadText key={paragraph} maxWidth="wide">
                    {paragraph}
                  </LeadText>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-28 lg:py-40 bg-[#F7F6F3]" aria-labelledby="values-heading">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <header className="section-header">
            <Eyebrow>Values</Eyebrow>
            <SectionHeading id="values-heading">橘香堂が大切にしていること</SectionHeading>
          </header>

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-14 lg:gap-16">
            {values.map((value, index) => (
              <li key={value.title} className="pt-8 border-t border-[#E5E4DF]">
                <DecorativeNumber size="large" className="block mb-6">
                  {String(index + 1).padStart(2, "0")}
                </DecorativeNumber>
                <BlockLabel className="mb-3">{value.titleEn}</BlockLabel>
                <CardTitle className="mb-4">{value.title}</CardTitle>
                <LeadText>{value.description}</LeadText>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* For whom */}
      <section className="py-28 lg:py-40" aria-labelledby="audience-heading">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Eyebrow>For You</Eyebrow>
              <SectionHeading id="audience-heading">こんな方のための場所です</SectionHeading>
            </div>
            <ul className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-x-12">
              {audiences.map((audience) => (
                <li key={audience.title} className="py-7 border-t border-[#E5E4DF]">
                  <CardTitle className="mb-2">{audience.title}</CardTitle>
                  <LeadText maxWidth="wide">{audience.description}</LeadText>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Visual */}
      <section className="pb-28 lg:pb-40" aria-hidden="true">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="relative aspect-[16/9] md:aspect-[16/7] overflow-hidden">
            <Image
              src={images.capacity}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[#2C2C2C]/10" />
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="pb-28 lg:pb-40" aria-labelledby="overview-heading">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <SectionIntro label="Overview" title="施設概要" />
            </div>
            <div className="lg:col-span-8">
              <dl className="border-t border-[#E5E4DF]">
                {overview.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-1 sm:grid-cols-4 gap-1 sm:gap-6 py-5 border-b border-[#E5E4DF]"
                  >
                    <dt className="text-[12px] tracking-[0.1em] text-[#9A9A9A] sm:pt-0.5">{row.label}</dt>
                    <dd className="sm:col-span-3 text-[14px] leading-[1.9] tracking-[0.02em] text-[#2C2C2C]">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="flex flex-wrap gap-x-10 gap-y-5 mt-12">
                <ArrowLink href="/space">空間と利用シーンを見る</ArrowLink>
                <ArrowLink href="/pricing">料金プランを見る</ArrowLink>
                <ArrowLink href="/access">アクセスを見る</ArrowLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <BottomCTA
        title="まずは一度、空間を体験してください。"
        description="ビジター利用は1時間から。会議室や貸切のご予約も承ります。"
        primaryButton={{ text: primaryActions.reserve.label, href: primaryActions.reserve.href }}
        secondaryButton={{ text: primaryActions.contact.label, href: primaryActions.contact.href }}
      />
    </>
  );
}
