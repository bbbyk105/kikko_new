import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ParallaxPhoto } from "@/app/components/ui/parallax-photo";

interface SpaceCategory {
  id: string;
  number: string;
  title: string;
  titleJa: string;
  description: string;
  image: string;
}

interface SpaceTypesProps {
  categories: SpaceCategory[];
}

export default function SpaceTypes({ categories }: SpaceTypesProps) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="max-w-2xl mb-16">
          <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-4">
            SPACE TYPES
          </p>
          <h2 className="font-[var(--font-cormorant)] text-3xl md:text-4xl leading-tight tracking-wide text-[#2C2C2C]">
            4つの利用スタイル
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {categories.map((category) => (
            <article key={category.id} className="group flex flex-col">
              <Link href={`/space/${category.id}`} className="flex flex-1 flex-col">
                {/* Image */}
                <ParallaxPhoto className="aspect-[16/10] mb-6">
                  {/* 差し替え箇所: 実際の施設写真に差し替えてください */}
                  <Image
                    src={category.image}
                    alt={`${category.titleJa}スペースの様子`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </ParallaxPhoto>

                {/* Content */}
                <div className="flex flex-1 gap-6">
                  <span
                    className="w-[1.2em] shrink-0 font-[var(--font-cormorant)] text-4xl text-[#E5E4DF] leading-none"
                    aria-hidden="true"
                  >
                    {category.number}
                  </span>
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-lg font-medium text-[#2C2C2C] mb-1">
                      {category.title}
                    </h3>
                    <p className="text-xs text-[#6B6B6B] mb-3 tracking-wider">
                      {category.titleJa}
                    </p>
                    <p className="text-sm text-[#6B6B6B] leading-relaxed">
                      {category.description}
                    </p>
                    <div className="mt-auto pt-5">
                      <span className="inline-flex items-center gap-2 pb-1 text-[12px] tracking-[0.12em] text-[#2C2C2C] border-b border-[#2C2C2C] group-hover:text-[#5C6B5C] group-hover:border-[#5C6B5C] transition-colors">
                        詳しく見る
                        <ArrowRight
                          className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
