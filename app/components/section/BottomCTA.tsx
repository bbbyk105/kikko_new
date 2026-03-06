import Link from "next/link";

interface BottomCTAProps {
  title: string;
  description?: string;
  primaryButton: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
}

export default function BottomCTA({
  title,
  description,
  primaryButton,
  secondaryButton,
}: BottomCTAProps) {
  return (
    <section className="py-24 lg:py-32 bg-[#F7F6F3]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-[var(--font-cormorant)] text-2xl md:text-3xl lg:text-4xl leading-tight tracking-wide text-[#2C2C2C] mb-4">
            {title}
          </h2>
          {description && (
            <p className="text-[#6B6B6B] leading-relaxed mb-10">{description}</p>
          )}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href={primaryButton.href}
              className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-wider text-[#FAFAF8] bg-[#2C2C2C] hover:bg-[#3D3D3D] transition-colors"
            >
              {primaryButton.text}
            </Link>
            {secondaryButton && (
              <Link
                href={secondaryButton.href}
                className="inline-flex items-center justify-center px-8 py-4 text-sm tracking-wider text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#2C2C2C] hover:text-[#FAFAF8] transition-colors"
              >
                {secondaryButton.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
