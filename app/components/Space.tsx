import Image from "next/image";
import { spaceCategories } from "@/app/data/site";

export default function Space() {
  return (
    <section
      id="space"
      className="py-32 lg:py-40 bg-[#F7F6F3]"
      aria-labelledby="space-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-20">
          <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-6">SPACE</p>
          <h2
            id="space-heading"
            className="font-[var(--font-cormorant)] text-3xl md:text-4xl lg:text-5xl leading-tight tracking-wide text-[#2C2C2C] mb-6"
          >
            多様なシーンに応える
            <br />
            柔軟な空間。
          </h2>
          <p className="text-[#6B6B6B] leading-relaxed">
            日々の作業から、会議、セミナー、イベントまで。
            用途に合わせた使い方が可能です。
          </p>
        </div>

        {/* Space Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {spaceCategories.map((category, index) => (
            <article
              key={category.id}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden mb-6">
                {/* 差し替え箇所: /public/images/space-*.jpg に実際の写真を配置 */}
                <Image
                  src={category.image}
                  alt={`${category.titleJa}スペースの様子`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              {/* Content */}
              <div className="flex gap-6">
                {/* Number */}
                <span
                  className="font-[var(--font-cormorant)] text-4xl text-[#E5E4DF] leading-none"
                  aria-hidden="true"
                >
                  {category.number}
                </span>

                {/* Text */}
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-[#2C2C2C] mb-1">
                    {category.title}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mb-3 tracking-wider">
                    {category.titleJa}
                  </p>
                  <p className="text-sm text-[#6B6B6B] leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
