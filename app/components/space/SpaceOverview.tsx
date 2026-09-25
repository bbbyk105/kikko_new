import { LeadText } from "@/app/components/ui/typography";

interface SpaceOverviewProps {
  catchcopy: string[];
  intro: string[];
  facts: { label: string; value: string }[];
}

export default function SpaceOverview({ catchcopy, intro, facts }: SpaceOverviewProps) {
  return (
    <section className="py-20 lg:py-28" aria-labelledby="overview-heading">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-4">OVERVIEW</p>
            <h2
              id="overview-heading"
              className="font-[var(--font-cormorant)] text-3xl md:text-4xl leading-tight tracking-wide text-[#2C2C2C]"
            >
              {catchcopy.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
          </div>

          <div className="lg:col-span-7">
            <div className="space-y-5 mb-14">
              {intro.map((paragraph) => (
                <LeadText key={paragraph} maxWidth="wide" className="max-w-none">
                  {paragraph}
                </LeadText>
              ))}
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-12 border-t border-[#E5E4DF]">
              {facts.map((fact) => (
                <div key={fact.label} className="border-l-2 border-[#E5E4DF] pl-4">
                  <dt className="text-xs text-[#6B6B6B] mb-1">{fact.label}</dt>
                  <dd className="text-sm text-[#2C2C2C]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
