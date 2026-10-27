import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Dictionary } from "../../i18n/ru";

interface FAQProps {
  dict: Dictionary;
}

export const FAQ: React.FC<FAQProps> = ({ dict }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="py-24 sm:py-32 px-4 sm:px-8 bg-surface border-t border-line"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-3">
          <p className="editorial-kicker text-sage-ink">{dict.faq.kicker}</p>
          <h2 className="headline-section font-bold text-ink">
            {dict.faq.title}
          </h2>
          <p className="text-base text-muted">{dict.faq.subtitle}</p>
        </div>

        <div className="divide-y divide-line border-t border-b border-line">
          {dict.faq.items.map((item, idx) => {
            const isOpen = openIndex === idx;
            const panelId = `faq-panel-${idx}`;
            const buttonId = `faq-button-${idx}`;

            return (
              <div key={idx} className="py-5">
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 text-left py-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-sage"
                  >
                    <span className="font-display text-base sm:text-lg font-medium text-ink">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-sage-ink shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="pt-3 pr-8 text-sm sm:text-base text-muted leading-relaxed"
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
