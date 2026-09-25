import Image from "next/image";
import Link from "next/link";

interface SpaceDetailHeroProps {
  number: string;
  title: string;
  titleJa: string;
  description: string;
  image: string;
}

export default function SpaceDetailHero({
  number,
  title,
  titleJa,
  description,
  image,
}: SpaceDetailHeroProps) {
  return (
    <>
      <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="パンくずリスト" className="mb-10 animate-fade-up">
            <ol className="flex flex-wrap items-center gap-2 text-[11px] tracking-[0.15em] text-[#9A9A9A]">
              <li>
                <Link href="/" className="hover:text-[#2C2C2C] transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/space" className="hover:text-[#2C2C2C] transition-colors">
                  Space
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-[#6B6B6B]">
                {title}
              </li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 max-w-3xl">
              <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-4 animate-fade-up">
                SPACE {number} — {title.toUpperCase()}
              </p>
              <h1 className="font-[var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl leading-tight tracking-wide text-[#2C2C2C] mb-6 animate-fade-up animation-delay-100">
                {titleJa}
              </h1>
              <p className="text-lg text-[#6B6B6B] leading-relaxed animate-fade-up animation-delay-200">
                {description}
              </p>
            </div>
            <div className="hidden lg:block lg:col-span-4 text-right" aria-hidden="true">
              <span className="font-[var(--font-cormorant)] text-[9rem] leading-none tracking-tight text-[#E8E7E2]">
                {number}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Visual */}
      <section className="pb-20 lg:pb-28">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
          <div className="relative aspect-[16/9] md:aspect-[16/7] overflow-hidden">
            {/* 差し替え箇所: 各利用スタイルの実際の写真に差し替えてください */}
            <Image
              src={image}
              alt={`${titleJa}スペースの様子`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-[#2C2C2C]/10" />
          </div>
        </div>
      </section>
    </>
  );
}
