import Image from "next/image";
import { siteConfig, images } from "@/app/data/site";

export default function Capacity() {
  return (
    <section
      className="py-32 lg:py-40 bg-[#2C2C2C] text-[#FAFAF8]"
      aria-labelledby="capacity-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text Content */}
          <div>
            <p className="text-xs tracking-[0.3em] text-[#8A8A8A] mb-6">
              CAPACITY
            </p>
            <h2
              id="capacity-heading"
              className="font-[var(--font-cormorant)] text-3xl md:text-4xl lg:text-5xl leading-tight tracking-wide mb-8"
            >
              小規模から大規模まで
              <br />
              対応可能。
            </h2>
            <p className="text-[#B0B0B0] leading-relaxed mb-12">
              少人数の打ち合わせから、セミナー、展示会、パーティーまで。
              様々な規模・用途に合わせて空間をアレンジできます。
            </p>

            {/* Capacity Numbers */}
            <div className="grid grid-cols-2 gap-8">
              <div className="border-l-2 border-[#5C6B5C] pl-6">
                <p className="font-[var(--font-cormorant)] text-5xl lg:text-6xl mb-2">
                  {siteConfig.capacity.seated}
                  <span className="text-xl ml-1">名</span>
                </p>
                <p className="text-sm text-[#8A8A8A]">着席最大</p>
              </div>
              <div className="border-l-2 border-[#5C6B5C] pl-6">
                <p className="font-[var(--font-cormorant)] text-5xl lg:text-6xl mb-2">
                  {siteConfig.capacity.standing}
                  <span className="text-xl ml-1">名</span>
                </p>
                <p className="text-sm text-[#8A8A8A]">スタンディング最大</p>
              </div>
            </div>

            {/* Use Cases */}
            <div className="mt-12 pt-12 border-t border-[#404040]">
              <p className="text-sm text-[#8A8A8A] mb-4">対応可能なシーン</p>
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
                    className="px-4 py-2 text-sm text-[#B0B0B0] border border-[#404040]"
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
              {/* 
                差し替え箇所: 
                1. /public/images/capacity-space.jpg に実際の写真を配置
                2. data/site.ts の images.capacity を更新
              */}
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
