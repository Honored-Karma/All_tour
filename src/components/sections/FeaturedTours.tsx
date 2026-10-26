import React from "react";
import type { DestinationId } from "../../data/destinations";
import { tours, type Tour } from "../../data/tours";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { TourCard } from "../tours/TourCard";

interface FeaturedToursProps {
  dict: Dictionary;
  locale: Locale;
  selectedFilter: "all" | DestinationId;
  onFilterChange: (filter: "all" | DestinationId) => void;
  onOpenTourDetails: (tour: Tour) => void;
  onBookTour: (tour: Tour) => void;
  onCursorEnter?: () => void;
  onCursorLeave?: () => void;
}

export const FeaturedTours: React.FC<FeaturedToursProps> = ({
  dict,
  locale,
  selectedFilter,
  onFilterChange,
  onOpenTourDetails,
  onBookTour,
  onCursorEnter,
  onCursorLeave,
}) => {
  const filterOptions: Array<{ id: "all" | DestinationId; label: string }> = [
    { id: "all", label: dict.tours.filters.all },
    { id: "kyrgyzstan", label: dict.tours.filters.kyrgyzstan },
    { id: "georgia", label: dict.tours.filters.georgia },
    { id: "china", label: dict.tours.filters.china },
  ];

  const filteredTours =
    selectedFilter === "all"
      ? tours
      : tours.filter((t) => t.destinationId === selectedFilter);

  return (
    <section
      id="tours"
      className="relative py-24 sm:py-32 px-4 sm:px-8 bg-[#0d1518] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Editorial Header & Interactive Filter Segmented Control */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <p className="editorial-kicker text-[#6BAFB3]">{dict.tours.kicker}</p>
            <h2 className="headline-section font-bold text-white">
              {dict.tours.title}
            </h2>
            <p className="text-base text-[#EDE6DA]/75 leading-relaxed">
              {dict.tours.subtitle}
            </p>
          </div>

          {/* Interactive Filter Controls */}
          <div
            role="group"
            aria-label="Filter tours by destination"
            className="liquid-glass-subtle p-1.5 rounded-2xl inline-flex flex-wrap items-center gap-1 self-start lg:self-end"
          >
            {filterOptions.map((option) => {
              const active = selectedFilter === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  data-testid={`tour-filter-${option.id}`}
                  aria-pressed={active}
                  onClick={() => onFilterChange(option.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? "bg-[#EDE6DA] text-[#111d22] font-semibold shadow-sm"
                      : "text-[#EDE6DA]/75 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Asymmetric Editorial Tour Grid */}
        <div
          data-testid="tour-grid"
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {filteredTours.map((tour) => (
            <TourCard
              key={tour.id}
              tour={tour}
              dict={dict}
              locale={locale}
              onOpenDetails={onOpenTourDetails}
              directLink={false}
              onBookTour={onBookTour}
              onCursorEnter={onCursorEnter}
              onCursorLeave={onCursorLeave}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
