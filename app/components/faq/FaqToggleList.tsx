"use client";

import { useAccordionState } from "@/app/hooks/use-accordion-state";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqToggleListProps {
  items: FaqItem[];
  /** 最初から開いておく質問の id */
  defaultOpenId?: string;
}

/** トップページ用の FAQ 一覧（＋アイコンで開閉。同時に開くのは1つだけ） */
export default function FaqToggleList({ items, defaultOpenId }: FaqToggleListProps) {
  const { isOpen, toggle } = useAccordionState("single", defaultOpenId);

  return (
    <div className="divide-y divide-[#E5E4DF]">
      {items.map((item) => {
        const open = isOpen(item.id);
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full py-7 text-left flex items-start justify-between gap-6 group"
              aria-expanded={open}
            >
              <span className="text-[#2C2C2C] text-[14px] md:text-[15px] leading-[1.9] tracking-[0.02em] pr-4">
                {item.question}
              </span>
              <span
                className={`flex-shrink-0 w-5 h-5 flex items-center justify-center text-[#9A9A9A] group-hover:text-[#2C2C2C] transition-transform duration-200 ${
                  open ? "rotate-45" : ""
                }`}
                aria-hidden="true"
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
                open ? "max-h-96 pb-8" : "max-h-0"
              }`}
            >
              <p className="text-[13px] md:text-[14px] text-[#6B6B6B] leading-[2] tracking-[0.02em] pl-0 pr-10">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
