import Image from "next/image";
import { images } from "@/app/data/site";

export default function About() {
  return (
    <section
      id="about"
      className="py-32 lg:py-40"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden">
              {/* 
                差し替え箇所: 
                1. /public/images/about-space.jpg に実際の写真を配置
                2. data/site.ts の images.about を更新
              */}
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
          <div className="lg:pl-8">
            {/* Section Label */}
            <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-6">
              ABOUT
            </p>

            {/* Heading */}
            <h2
              id="about-heading"
              className="font-[var(--font-cormorant)] text-3xl md:text-4xl lg:text-5xl leading-tight tracking-wide text-[#2C2C2C] mb-8"
            >
              集中、つながり、
              <br />
              自由な働き方を。
            </h2>

            {/* Description */}
            <div className="space-y-6 text-[#6B6B6B] leading-relaxed">
              <p>
                橘香堂は、ただ作業をする場所ではありません。
                集中して仕事に向き合い、必要なときには人とつながり、
                用途に応じて空間を自在に使える——
                そんな、新しい働き方のための場所です。
              </p>
              <p>
                富士市吉原の静かな環境の中で、
                起業家、フリーランス、リモートワーカーの皆さまの
                日々の仕事と成長をサポートいたします。
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mt-12 pt-12 border-t border-[#E5E4DF]">
              <div>
                <p className="font-[var(--font-cormorant)] text-4xl text-[#2C2C2C] mb-2">
                  80<span className="text-lg ml-1">名</span>
                </p>
                <p className="text-sm text-[#6B6B6B]">着席最大収容</p>
              </div>
              <div>
                <p className="font-[var(--font-cormorant)] text-4xl text-[#2C2C2C] mb-2">
                  150<span className="text-lg ml-1">名</span>
                </p>
                <p className="text-sm text-[#6B6B6B]">スタンディング最大</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
