import Image from "next/image";
import Link from "next/link";
import { siteConfig, heroFeatures, images } from "@/app/data/site";
import { Eyebrow, DisplayHeading, LeadText } from "@/app/components/ui/typography";

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-20" aria-labelledby="hero-heading">
      {/* Main Content */}
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[calc(100vh-5rem)]">
          {/* Text Content */}
          <div className="order-2 lg:order-1 py-16 lg:py-0">
            <div className="hero-header">
              {/* Eyebrow - 静かな前置き */}
              <div className="animate-fade-up">
                <Eyebrow className="hero-eyebrow">
                  Coworking Space in Fuji City
                </Eyebrow>
              </div>

              {/* Main Copy - 余白との緊張感で魅せる */}
              <div className="animate-fade-up animation-delay-100">
                <DisplayHeading id="hero-heading">
                  <span className="block">働く場所から、</span>
                  <span className="block mt-1">仕事の質を整える。</span>
                </DisplayHeading>
              </div>

              {/* Lead Text - 抑制された説明文 */}
              <div className="animate-fade-up animation-delay-200">
                <LeadText className="hero-lead">
                  {siteConfig.description}
                </LeadText>
              </div>

              {/* CTA Buttons - 見出しとの距離を保つ */}
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-up animation-delay-300">
                <Link
                  href="/reserve"
                  className="inline-flex items-center justify-center px-10 py-4 text-[13px] tracking-[0.12em] text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] transition-colors"
                >
                  ご予約
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center px-10 py-4 text-[13px] tracking-[0.12em] text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8] transition-colors"
                >
                  料金を見る
                </Link>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative aspect-[4/3] lg:aspect-[3/4] w-full overflow-hidden">
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

      {/* Feature Strip - 控えめなアクセント */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#F7F6F3] border-t border-[#E5E4DF]">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <ul className="flex flex-wrap justify-center lg:justify-between items-center gap-6 lg:gap-8 py-6">
            {heroFeatures.map((feature, index) => (
              <li
                key={feature.label}
                className="flex items-center gap-3 text-[12px] tracking-[0.08em] text-[#7A7A7A] animate-fade-up"
                style={{ animationDelay: `${400 + index * 100}ms` }}
              >
                <span className="w-[3px] h-[3px] bg-[#5C6B5C] rounded-full" aria-hidden="true" />
                <span>{feature.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
