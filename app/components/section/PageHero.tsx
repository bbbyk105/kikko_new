interface PageHeroProps {
  title: string;
  titleJa: string;
  description: string;
}

export default function PageHero({ title, titleJa, description }: PageHeroProps) {
  return (
    <section className="pt-32 pb-20 lg:pt-40 lg:pb-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-4 animate-fade-up">
            {title.toUpperCase()}
          </p>
          <h1 className="font-[var(--font-cormorant)] text-4xl md:text-5xl lg:text-6xl leading-tight tracking-wide text-[#2C2C2C] mb-6 animate-fade-up animation-delay-100">
            {titleJa}
          </h1>
          <p className="text-lg text-[#6B6B6B] leading-relaxed animate-fade-up animation-delay-200">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
