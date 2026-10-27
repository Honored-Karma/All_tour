import React from "react";
import type { TourItineraryStep } from "../../data/tours";
import type { Locale } from "../../lib/whatsapp";

interface TourItineraryProps {
  steps: TourItineraryStep[];
  locale: Locale;
  title: string;
  notice: string;
}

export const TourItinerary: React.FC<TourItineraryProps> = ({
  steps,
  locale,
  title,
  notice,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-line pb-3">
        <h4 className="font-display text-base sm:text-lg font-semibold text-ink">
          {title}
        </h4>
        <span className="text-xs text-sage-ink">{notice}</span>
      </div>

      {steps.length === 0 ? (
        <p className="text-sm text-muted py-4">{notice}</p>
      ) : (
        <ol className="relative space-y-6 md:space-y-8 md:before:content-[''] md:before:absolute md:before:top-3 md:before:bottom-3 md:before:left-6 md:before:w-px md:before:bg-surface-soft">
          {steps.map((step, index) => {
            const stepNum = String(index + 1).padStart(2, "0");
            return (
              <li
                key={index}
                className="relative md:pl-16 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start"
              >
                {/* Step index on timeline */}
                <div className="md:absolute md:left-0 md:top-0 w-12 h-12 rounded-xl bg-surface-soft border border-line flex items-center justify-center font-display text-sm font-semibold text-ink tabular-nums shrink-0">
                  {stepNum}
                </div>

                <div className="flex-1 space-y-1.5">
                  {step.time && (
                    <span className="text-xs font-mono text-muted tabular-nums">
                      {step.time}
                    </span>
                  )}
                  <h5 className="text-base font-semibold text-ink">
                    {step.title[locale]}
                  </h5>
                  <p className="text-sm text-muted leading-relaxed">
                    {step.description[locale]}
                  </p>
                </div>

                {step.image && (
                  <div className="hidden sm:block w-28 h-20 rounded-xl overflow-hidden border border-line shrink-0 bg-surface-soft">
                    <img
                      src={step.image}
                      alt={step.title[locale]}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};
