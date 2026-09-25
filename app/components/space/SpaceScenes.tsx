interface SpaceScenesProps {
  scenes: string[];
  recommendedFor: string[];
}

export default function SpaceScenes({ scenes, recommendedFor }: SpaceScenesProps) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Use Cases */}
          <div>
            <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-4">USE CASES</p>
            <h2 className="font-[var(--font-cormorant)] text-3xl md:text-4xl leading-tight tracking-wide text-[#2C2C2C] mb-10">
              利用シーン
            </h2>
            <ul className="flex flex-wrap gap-3">
              {scenes.map((scene) => (
                <li
                  key={scene}
                  className="px-4 py-2 text-sm text-[#6B6B6B] border border-[#E5E4DF] bg-white"
                >
                  {scene}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended For */}
          <div>
            <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-4">RECOMMENDED FOR</p>
            <h2 className="font-[var(--font-cormorant)] text-3xl md:text-4xl leading-tight tracking-wide text-[#2C2C2C] mb-10">
              こんな方に
            </h2>
            <ul className="space-y-4">
              {recommendedFor.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 pb-4 text-sm text-[#2C2C2C] border-b border-[#EEEDE8]"
                >
                  <span className="text-[#5C6B5C]" aria-hidden="true">
                    —
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
