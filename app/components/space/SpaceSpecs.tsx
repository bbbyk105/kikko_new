interface Spec {
  label: string;
  value: string;
}

interface SpaceSpecsProps {
  specs: Spec[];
  useCases: string[];
}

export default function SpaceSpecs({ specs, useCases }: SpaceSpecsProps) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Specs */}
          <div>
            <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-4">
              SPECIFICATIONS
            </p>
            <h2 className="font-[var(--font-cormorant)] text-3xl md:text-4xl leading-tight tracking-wide text-[#2C2C2C] mb-10">
              設備・仕様
            </h2>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {specs.map((spec) => (
                <div
                  key={spec.label}
                  className="border-l-2 border-[#E5E4DF] pl-4"
                >
                  <dt className="text-xs text-[#6B6B6B] mb-1">{spec.label}</dt>
                  <dd className="text-sm text-[#2C2C2C]">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Use Cases */}
          <div>
            <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-4">
              USE CASES
            </p>
            <h2 className="font-[var(--font-cormorant)] text-3xl md:text-4xl leading-tight tracking-wide text-[#2C2C2C] mb-10">
              利用シーン
            </h2>

            <div className="flex flex-wrap gap-3">
              {useCases.map((useCase) => (
                <span
                  key={useCase}
                  className="px-4 py-2 text-sm text-[#6B6B6B] border border-[#E5E4DF] bg-white"
                >
                  {useCase}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
