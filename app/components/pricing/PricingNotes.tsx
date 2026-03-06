interface PricingNotesProps {
  notes: string[];
}

export default function PricingNotes({ notes }: PricingNotesProps) {
  return (
    <section className="py-20 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-sm tracking-wider text-[#6B6B6B] mb-6">
            ご利用にあたって
          </h3>
          <ul className="space-y-3">
            {notes.map((note, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-sm text-[#6B6B6B]"
              >
                <span className="text-[#5C6B5C] mt-1">•</span>
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
