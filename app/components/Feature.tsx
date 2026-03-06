import Image from "next/image";
import { features } from "@/app/data/site";

export default function Feature() {
  return (
    <section
      className="py-32 lg:py-40"
      aria-labelledby="feature-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-20">
          <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-6">
            FEATURES
          </p>
          <h2
            id="feature-heading"
            className="font-[var(--font-cormorant)] text-3xl md:text-4xl lg:text-5xl leading-tight tracking-wide text-[#2C2C2C]"
          >
            仕事を支える、
            <br />
            充実の設備。
          </h2>
        </div>

        {/* Feature Grid - Asymmetric Layout */}
        <div className="space-y-24 lg:space-y-32">
          {/* Feature 1 - Large Left */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* 差し替え箇所: /public/images/feature-wifi.jpg に実際の写真を配置 */}
                <Image
                  src={features[0].image}
                  alt={features[0].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            </div>
            <div className="lg:col-span-5 lg:pl-8">
              <span
                className="font-[var(--font-cormorant)] text-6xl text-[#E5E4DF] block mb-4"
                aria-hidden="true"
              >
                01
              </span>
              <h3 className="text-xl font-medium text-[#2C2C2C] mb-4">
                {features[0].title}
              </h3>
              <p className="text-[#6B6B6B] leading-relaxed">
                {features[0].description}
              </p>
            </div>
          </div>

          {/* Feature 2 - Large Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 lg:pr-8 order-2 lg:order-1">
              <span
                className="font-[var(--font-cormorant)] text-6xl text-[#E5E4DF] block mb-4"
                aria-hidden="true"
              >
                02
              </span>
              <h3 className="text-xl font-medium text-[#2C2C2C] mb-4">
                {features[1].title}
              </h3>
              <p className="text-[#6B6B6B] leading-relaxed">
                {features[1].description}
              </p>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* 差し替え箇所: /public/images/feature-business.jpg に実際の写真を配置 */}
                <Image
                  src={features[1].image}
                  alt={features[1].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            </div>
          </div>

          {/* Features 3 & 4 - Two Column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
            {features.slice(2).map((feature, index) => (
              <div key={feature.id} className="group">
                <div className="relative aspect-[4/3] overflow-hidden mb-6">
                  {/* 差し替え箇所: /public/images/feature-*.jpg に実際の写真を配置 */}
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <span
                  className="font-[var(--font-cormorant)] text-4xl text-[#E5E4DF] block mb-3"
                  aria-hidden="true"
                >
                  0{index + 3}
                </span>
                <h3 className="text-lg font-medium text-[#2C2C2C] mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
