"use client";

import { useState } from "react";
import Link from "next/link";
import { faqItems } from "@/app/data/site";

const displayFaqItems = faqItems.slice(0, 5);

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-[clamp(5rem,10vw,8rem)] bg-[#FAFAF8]">
      <div className="mx-auto max-w-[1280px] px-[clamp(1.5rem,5vw,4rem)]">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <p className="text-xs tracking-[0.3em] text-[#6B6B6B] mb-3">FAQ</p>
          <h2 className="font-[var(--font-cormorant)] text-3xl lg:text-4xl text-[#2C2C2C] mb-4">
            よくある質問
          </h2>
          <p className="text-sm text-[#6B6B6B] max-w-xl mx-auto">
            ご利用にあたってよくいただくご質問をまとめました
          </p>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto">
          <div className="divide-y divide-[#E5E4DF]">
            {displayFaqItems.map((item, index) => (
              <div key={index} className="py-0">
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full py-6 text-left flex items-start justify-between gap-4 group"
                  aria-expanded={openIndex === index}
                >
                  <span className="text-[#2C2C2C] text-sm lg:text-base leading-relaxed pr-4">
                    {item.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-5 h-5 flex items-center justify-center text-[#6B6B6B] group-hover:text-[#2C2C2C] transition-transform duration-200 ${
                      openIndex === index ? "rotate-45" : ""
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
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
                    openIndex === index ? "max-h-96 pb-6" : "max-h-0"
                  }`}
                >
                  <p className="text-sm text-[#6B6B6B] leading-relaxed pl-0 pr-8">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm text-[#5C6B5C] hover:text-[#2C2C2C] transition-colors"
          >
            <span>すべての質問を見る</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
