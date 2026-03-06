interface SectionIntroProps {
  label?: string;
  title: string;
  description?: string;
  centered?: boolean;
}

export default function SectionIntro({
  label,
  title,
  description,
  centered = false,
}: SectionIntroProps) {
  return (
    <div className={`max-w-2xl mb-16 lg:mb-20 ${centered ? "mx-auto text-center" : ""}`}>
      {label && (
        <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-4">
          {label.toUpperCase()}
        </p>
      )}
      <h2 className="font-[var(--font-cormorant)] text-3xl md:text-4xl leading-tight tracking-wide text-[#2C2C2C] mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-[#6B6B6B] leading-relaxed">{description}</p>
      )}
    </div>
  );
}
