import React from "react";
import type { DestinationId } from "../../data/destinations";
import type { Tour } from "../../data/tours";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { BookingForm } from "../booking/BookingForm";

interface HowToBookProps {
  dict: Dictionary;
  locale: Locale;
  preselectedDestinationId?: DestinationId;
  preselectedTour?: Tour | null;
}

export const HowToBook: React.FC<HowToBookProps> = ({
  dict,
  locale,
  preselectedDestinationId,
  preselectedTour,
}) => {
  return (
    <section
      id="how-to-book"
      className="py-24 sm:py-32 px-4 sm:px-8 bg-[#0d1518] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <p className="editorial-kicker text-[#6BAFB3]">
            {dict.howToBook.kicker}
          </p>
          <h2 className="headline-section font-bold text-white">
            {dict.howToBook.title}
          </h2>
          <p className="text-base text-[#EDE6DA]/75 leading-relaxed">
            {dict.howToBook.subtitle}
          </p>
        </div>

        {/* 3 Clear Editorial Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {dict.howToBook.steps.map((step) => (
            <div
              key={step.number}
              className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/12 flex flex-col justify-between space-y-6"
            >
              <span className="font-display text-3xl font-bold text-[#6BAFB3] tabular-nums">
                {step.number}
              </span>
              <div className="space-y-2">
                <h3 className="font-display text-lg font-semibold text-white">
                  {step.title}
                </h3>
                <p className="text-sm text-[#EDE6DA]/75 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Glass Booking Form */}
        <BookingForm
          dict={dict}
          locale={locale}
          preselectedDestinationId={preselectedDestinationId}
          preselectedTour={preselectedTour}
        />
      </div>
    </section>
  );
};
