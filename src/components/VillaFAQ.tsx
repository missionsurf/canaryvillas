"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FAQItem } from "@/lib/villaFAQData";

export type { FAQItem };
export { getVillaFAQs, VILLA_FAQS, DEFAULT_FAQS } from "@/lib/villaFAQData";

interface Props {
  faqs: FAQItem[];
}

export default function VillaFAQ({ faqs }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-100 border border-gray-200 rounded-2xl overflow-hidden">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-900">{faq.question}</span>
            <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} />
          </button>
          {open === i && (
            <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{faq.answer}</div>
          )}
        </div>
      ))}
    </div>
  );
}
