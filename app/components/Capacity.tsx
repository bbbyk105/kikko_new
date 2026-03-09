import Image from "next/image";
import { siteConfig, images } from "@/app/data/site";
import { Eyebrow, SectionHeading, LeadText, BlockLabel } from "@/app/components/ui/typography";

export default function Capacity() {
  return (
    <section
      className="py-36 lg:py-48 bg-[#2C2C2C] text-[#FAFAF8]"
      aria-labelledby="capacity-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">
          {/* Text Content */}
          <div>
            <Eyebrow theme="dark">Capacity</Eyebrow>
            <SectionHeading id="capacity-heading" theme="dark" size="large">
              <span className="block">小規模から大規模まで</span>
              <span className="block">対応可能。</span>
            </SectionHeading>
            <LeadText theme="dark" maxWidth="wide" className="mt-8 mb-14">
              少人数の打ち合わせから、セミナー、展示会、パーティーまで。
              様々な規模・用途に合わせて空間をアレンジできます。
            </LeadText>

            {/* Capacity Numbers */}
            <div className="grid grid-cols-2 gap-8">
              <div className="border-l-2 border-[#5C6B5C] pl-6">
                <p className="font-[var(--font-cormorant)] text-[clamp(3rem,6vw,4rem)] leading-none tracking-tight mb-3">
                  {siteConfig.capacity.seated}
                  <span className="text-lg ml-1 tracking-normal">名</span>
                </p>
                <BlockLabel theme="dark">着席最大</BlockLabel>
              </div>
              <div className="border-l-2 border-[#5C6B5C] pl-6">
                <p className="font-[var(--font-cormorant)] text-[clamp(3rem,6vw,4rem)] leading-none tracking-tight mb-3">
                  {siteConfig.capacity.standing}
                  <span className="text-lg ml-1 tracking-normal">名</span>
                </p>
                <BlockLabel theme="dark">スタンディング最大</BlockLabel>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mt-16 pt-12 border-t border-[#404040]">
              <BlockLabel theme="dark" className="mb-5">対応可能なシーン</BlockLabel>
              <ul className="flex flex-wrap gap-3">
                {[
                  "少人数ミーティング",
                  "セミナー・研修",
                  "展示会",
                  "ワークショップ",
                  "懇親会・パーティー",
                ].map((useCase) => (
                  <li
                    key={useCase}
                    className="px-4 py-2.5 text-[12px] tracking-[0.05em] text-[#9A9A9A] border border-[#404040]"
                  >
                    {useCase}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={images.capacity}
                alt="イベント利用時のスペースレイアウト例"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
