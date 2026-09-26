import Image from "next/image";
import Link from "next/link";
import SectionIntro from "@/app/components/section/SectionIntro";
import { ParallaxPhoto } from "@/app/components/ui/parallax-photo";

interface SpaceCategory {
  id: string;
  number: string;
  title: string;
  titleJa: string;
  image: string;
}

interface SpaceOtherTypesProps {
  categories: SpaceCategory[];
}

export default function SpaceOtherTypes({ categories }: SpaceOtherTypesProps) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <SectionIntro label="Other Spaces" title="ほかの利用スタイル" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
          {categories.map((category) => (
            <Link key={category.id} href={`/space/${category.id}`} className="group block">
              <ParallaxPhoto className="aspect-[4/3] mb-6">
                <Image
                  src={category.image}
                  alt={`${category.titleJa}スペースの様子`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </ParallaxPhoto>
              <div className="flex gap-5">
                <span
                  className="w-[1.2em] shrink-0 font-[var(--font-cormorant)] text-4xl text-[#E5E4DF] leading-none"
                  aria-hidden="true"
                >
                  {category.number}
                </span>
                <div className="flex-1">
                  <h3 className="text-base font-medium text-[#2C2C2C] mb-1 group-hover:text-[#5C6B5C] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-xs text-[#6B6B6B] tracking-wider">{category.titleJa}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
