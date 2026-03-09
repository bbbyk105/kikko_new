"use client";

import { useState } from "react";
import Link from "next/link";
import { faqItems } from "@/app/data/site";
import { SectionHeader } from "@/app/components/ui/typography";

const displayFaqItems = faqItems.slice(0, 5);

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-36 lg:py-48 bg-[#FAFAF8]">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-8">
        {/* Section Header */}
        <SectionHeader
          eyebrow="FAQ"
          title="よくある質問"
          description="ご利用にあたってよくいただくご質問をまとめました"
          align="center"
          titleId="faq-heading"
        />

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          <div className="divide-y divide-[#E5E4DF]">
            {displayFaqItems.map((item, index) => (
              <div key={index} className="py-0">
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full py-7 text-left flex items-start justify-between gap-6 group"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-[#2C2C2C] text-[14px] md:text-[15px] leading-[1.9] tracking-[0.02em] pr-4">
                    {item.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-5 h-5 flex items-center justify-center text-[#9A9A9A] group-hover:text-[#2C2C2C] transition-transform duration-200 ${
                      openIndex === index ? "rotate-45" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    openIndex === index ? "max-h-96 pb-8" : "max-h-0"
                  }`}
                >
                  <p className="text-[13px] md:text-[14px] text-[#6B6B6B] leading-[2] tracking-[0.02em] pl-0 pr-10">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-14">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-[12px] tracking-[0.1em] text-[#5C6B5C] hover:text-[#2C2C2C] transition-colors"
          >
            <span>すべての質問を見る</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
