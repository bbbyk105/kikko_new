import Image from "next/image";

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
            <article key={category.id} className="group">
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden mb-6">
                {/* 差し替え箇所: 実際の施設写真に差し替えてください */}
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
                <span
                  className="font-[var(--font-cormorant)] text-4xl text-[#E5E4DF] leading-none"
                  aria-hidden="true"
                >
                  {category.number}
                </span>
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
