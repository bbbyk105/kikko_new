import Image from "next/image";
import { features } from "@/app/data/site";
import { SectionHeader, CardTitle, DecorativeNumber, LeadText } from "@/app/components/ui/typography";

export default function Feature() {
  return (
    <section
      className="py-36 lg:py-48"
      aria-labelledby="feature-heading"
    >
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          eyebrow="Features"
          title={
            <>
              <span className="block">仕事を支える、</span>
              <span className="block">充実の設備。</span>
            </>
          }
          titleId="feature-heading"
          size="large"
        />

        {/* Feature Grid - Asymmetric Layout */}
        <div className="space-y-28 lg:space-y-40">
          {/* Feature 1 - Large Left */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={features[0].image}
                  alt={features[0].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            </div>
            <div className="lg:col-span-5 lg:pl-4">
              <DecorativeNumber size="large" className="block mb-5">01</DecorativeNumber>
              <CardTitle className="mb-5">{features[0].title}</CardTitle>
              <LeadText>{features[0].description}</LeadText>
            </div>
          </div>

          {/* Feature 2 - Large Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <div className="lg:col-span-5 lg:pr-4 order-2 lg:order-1">
              <DecorativeNumber size="large" className="block mb-5">02</DecorativeNumber>
              <CardTitle className="mb-5">{features[1].title}</CardTitle>
              <LeadText>{features[1].description}</LeadText>
            </div>
            <div className="lg:col-span-7 order-1 lg:order-2">
              <div className="relative aspect-[16/10] overflow-hidden">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-14 lg:gap-20">
            {features.slice(2).map((feature, index) => (
              <div key={feature.id} className="group">
                <div className="relative aspect-[4/3] overflow-hidden mb-8">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <DecorativeNumber className="block mb-4">0{index + 3}</DecorativeNumber>
                <CardTitle className="mb-4">{feature.title}</CardTitle>
                <LeadText>{feature.description}</LeadText>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
