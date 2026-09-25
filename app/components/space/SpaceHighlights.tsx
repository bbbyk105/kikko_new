import SectionIntro from "@/app/components/section/SectionIntro";
import { CardTitle, DecorativeNumber, LeadText } from "@/app/components/ui/typography";

interface SpaceHighlightsProps {
  titleJa: string;
  highlights: { title: string; description: string }[];
}

export default function SpaceHighlights({ titleJa, highlights }: SpaceHighlightsProps) {
  return (
    <section className="py-20 lg:py-28 bg-[#F7F6F3]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <SectionIntro label="Features" title={`${titleJa}の特長`} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 lg:gap-x-24 lg:gap-y-16">
          {highlights.map((highlight, index) => (
            <div
              key={highlight.title}
              className="flex gap-6 pt-8 border-t border-[#E5E4DF]"
            >
              <DecorativeNumber>{String(index + 1).padStart(2, "0")}</DecorativeNumber>
              <div className="flex-1 pt-1">
                <CardTitle className="mb-3">{highlight.title}</CardTitle>
                <LeadText maxWidth="wide">{highlight.description}</LeadText>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
