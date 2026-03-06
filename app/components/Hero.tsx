import Image from "next/image";
import Link from "next/link";
import { siteConfig, heroFeatures, images } from "@/app/data/site";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-20" aria-labelledby="hero-heading">
      {/* Main Content */}
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[calc(100vh-5rem)]">
          {/* Text Content */}
          <div className="order-2 lg:order-1 py-12 lg:py-0">
            <div className="max-w-xl">
              {/* Brand Tag */}
              <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-6 animate-fade-up">
                COWORKING SPACE IN FUJI CITY
              </p>

              {/* Main Copy */}
              <h1
                id="hero-heading"
                className="font-[var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl leading-tight tracking-wide text-[#2C2C2C] mb-6 animate-fade-up animation-delay-100"
              >
                働く場所から、
                <br />
                仕事の質を整える。
              </h1>

              {/* Sub Copy */}
              <p className="text-base md:text-lg text-[#6B6B6B] leading-relaxed mb-10 animate-fade-up animation-delay-200">
                {siteConfig.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
                <Link
                  href="#contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] transition-colors"
                >
                  ご予約
                </Link>
                <Link
                  href="#pricing"
                  className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-wider text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8] transition-colors"
                >
                  料金を見る
                </Link>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/3] lg:aspect-[3/4] w-full overflow-hidden">
              {/* 
                差し替え箇所: 
                1. /public/images/hero-main.jpg に実際の写真を配置
                2. data/site.ts の images.hero を更新
              */}
              <Image
                src={images.hero}
                alt="橘香堂の明るく開放的なコワーキングスペース"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#F7F6F3] border-t border-[#E5E4DF]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <ul className="flex flex-wrap justify-center lg:justify-between items-center gap-6 lg:gap-8 py-6">
            {heroFeatures.map((feature, index) => (
              <li
                key={feature.label}
                className="flex items-center gap-3 text-sm text-[#6B6B6B] animate-fade-up"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <span className="w-1.5 h-1.5 bg-[#5C6B5C] rounded-full" aria-hidden="true" />
                <span>{feature.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
