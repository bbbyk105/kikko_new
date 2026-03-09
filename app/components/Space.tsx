import Image from "next/image";
import { spaceCategories } from "@/app/data/site";
import { SectionHeader, CardTitle, DecorativeNumber, BlockLabel, LeadText } from "@/app/components/ui/typography";

export default function Space() {
  return (
    <section
      id="space"
      className="py-36 lg:py-48 bg-[#F7F6F3]"
      aria-labelledby="space-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          eyebrow="Space"
          title={
            <>
              <span className="block">多様なシーンに応える</span>
              <span className="block">柔軟な空間。</span>
            </>
          }
          description="日々の作業から、会議、セミナー、イベントまで。用途に合わせた使い方が可能です。"
          titleId="space-heading"
          size="large"
        />

        {/* Space Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 lg:gap-20">
          {spaceCategories.map((category, index) => (
            <article
              key={category.id}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden mb-8">
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
                <DecorativeNumber>{category.number}</DecorativeNumber>

                {/* Text */}
                <div className="flex-1 pt-1">
                  <CardTitle className="mb-2">{category.title}</CardTitle>
                  <BlockLabel className="mb-4">{category.titleJa}</BlockLabel>
                  <LeadText maxWidth="wide">{category.description}</LeadText>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
