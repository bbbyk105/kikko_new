interface Step {
  number: string;
  title: string;
  description: string;
}

interface BookingStepsProps {
  steps: Step[];
}

export default function BookingSteps({ steps }: BookingStepsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
      {steps.map((step, index) => (
        <div key={step.number} className="relative">
          {index < steps.length - 1 && (
            <div
              className="hidden md:block absolute top-6 left-full w-full h-px bg-[#E5E4DF] -translate-x-1/2"
              aria-hidden="true"
            />
          )}
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <span className="font-[var(--font-cormorant)] text-4xl text-[#E5E4DF] mb-3">
              {step.number}
            </span>
            <h3 className="text-base font-medium text-[#2C2C2C] mb-2">
              {step.title}
            </h3>
            <p className="text-sm text-[#6B6B6B]">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
