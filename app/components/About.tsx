import Image from "next/image";
import { images } from "@/app/data/site";
import { Eyebrow, SectionHeading, LeadText, BlockLabel } from "@/app/components/ui/typography";

export default function About() {
  return (
    <section
      id="about"
      className="py-36 lg:py-48"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={images.about}
                alt="橘香堂の落ち着いた雰囲気の作業スペース"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {/* Accent Element */}
            <div
              className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#F0EFE9] -z-10"
              aria-hidden="true"
            />
          </div>

          {/* Text Content */}
          <div className="lg:pl-4">
            {/* Section Label */}
            <Eyebrow>About</Eyebrow>

            {/* Heading */}
            <SectionHeading id="about-heading" size="large">
              <span className="block">集中、つながり、</span>
              <span className="block">自由な働き方を。</span>
            </SectionHeading>

            {/* Description */}
            <div className="space-y-5 mt-8">
              <LeadText maxWidth="wide">
                橘香堂は、ただ作業をする場所ではありません。
                集中して仕事に向き合い、必要なときには人とつながり、
                用途に応じて空間を自在に使える——
                そんな、新しい働き方のための場所です。
              </LeadText>
              <LeadText maxWidth="wide">
                富士市吉原の静かな環境の中で、
                起業家、フリーランス、リモートワーカーの皆さまの
                日々の仕事と成長をサポートいたします。
              </LeadText>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mt-16 pt-12 border-t border-[#E5E4DF]">
              <div>
                <p className="font-[var(--font-cormorant)] text-[clamp(2.5rem,5vw,3.5rem)] text-[#2C2C2C] leading-none tracking-tight mb-3">
                  80<span className="text-base ml-1 tracking-normal">名</span>
                </p>
                <BlockLabel>着席最大収容</BlockLabel>
              </div>
              <div>
                <p className="font-[var(--font-cormorant)] text-[clamp(2.5rem,5vw,3.5rem)] text-[#2C2C2C] leading-none tracking-tight mb-3">
                  150<span className="text-base ml-1 tracking-normal">名</span>
                </p>
                <BlockLabel>スタンディング最大</BlockLabel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
