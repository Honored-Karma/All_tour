import React, { useState, useMemo } from "react";
import { Search, Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { tours, type Tour, type TourType } from "../../data/tours";
import { destinations, type DestinationId } from "../../data/destinations";
import type { Locale } from "../../lib/whatsapp";
import { buildWhatsAppBookingUrl } from "../../lib/whatsapp";
import { GlassPanel } from "../glass/GlassPanel";
import { GlassButton } from "../glass/GlassButton";
import { Link } from "react-router-dom";
import { matchesTourDuration, type DurationFilter } from "../../lib/tourFilters";
import type { Dictionary } from "../../i18n/ru";
import { getDictionary } from "../../i18n";

interface SmartTourFinderProps {
  locale: Locale;
  dict?: Dictionary;
  onSelectTour?: (tour: Tour) => void;
}

export const SmartTourFinder: React.FC<SmartTourFinderProps> = ({ locale, dict, onSelectTour }) => {
  const t = dict || getDictionary(locale);
  const [selectedDestination, setSelectedDestination] = useState<"all" | DestinationId>("all");
  const [selectedDuration, setSelectedDuration] = useState<DurationFilter>("all");
  const [selectedType, setSelectedType] = useState<"all" | TourType>("all");
  const [travelers, setTravelers] = useState<number>(2);

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      if (selectedDestination !== "all" && tour.destinationId !== selectedDestination) {
        return false;
      }
      if (selectedType !== "all" && tour.tourType !== selectedType) {
        return false;
      }
      return matchesTourDuration(tour, selectedDuration);
    });
  }, [selectedDestination, selectedDuration, selectedType]);

  const whatsappInquiryUrl = useMemo(() => {
    const destName =
      selectedDestination === "kyrgyzstan"
        ? (locale === "kz" ? "Қырғызстан" : "Кыргызстан")
        : selectedDestination === "georgia"
        ? "Грузия"
        : selectedDestination === "china"
        ? (locale === "kz" ? "Қытай" : "Китай")
        : (locale === "kz" ? "ALL TOUR бағыттары" : "Направления ALL TOUR");
    return buildWhatsAppBookingUrl({
      locale,
      destinationName: destName,
      travelersCount: travelers,
      comment: t.finder.whatsappComment,
    });
  }, [selectedDestination, travelers, locale, t]);

  return (
    <GlassPanel className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#0786c7] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t.finder.badge}</span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-white">
            {t.finder.title}
          </h3>
        </div>
        <span className="text-xs font-mono text-[#EDE6DA]/60 tabular-nums">
          {t.finder.foundCount.replace("{count}", String(filteredTours.length))}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="space-y-1.5">
          <label htmlFor="finder-destination" className="text-xs font-medium text-[#EDE6DA]/75">
            {t.finder.destinationLabel}
          </label>
          <select
            id="finder-destination"
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/8 border border-white/15 text-sm text-white focus:outline-none focus:border-[#0786c7]"
          >
            <option value="all" className="bg-[#121c21] text-white">
              {t.finder.allDestinations}
            </option>
            {destinations.map((dest) => (
              <option key={dest.id} value={dest.id} className="bg-[#121c21] text-white">
                {dest.name[locale]}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div className="space-y-1.5">
          <label htmlFor="finder-duration" className="text-xs font-medium text-[#EDE6DA]/75">
            {t.finder.durationLabel}
          </label>
          <select
            id="finder-duration"
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value as DurationFilter)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/8 border border-white/15 text-sm text-white focus:outline-none focus:border-[#0786c7]"
          >
            <option value="all" className="bg-[#121c21] text-white">
              {t.finder.durations.all}
            </option>
            <option value="short" className="bg-[#121c21] text-white">
              {t.finder.durations.short}
            </option>
            <option value="multi" className="bg-[#121c21] text-white">
              {t.finder.durations.multi}
            </option>
          </select>
        </div>

        {/* Tour Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#EDE6DA]/75">
            {t.finder.typeLabel}
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/8 border border-white/15 text-sm text-white focus:outline-none focus:border-[#0786c7]"
          >
            <option value="all" className="bg-[#121c21] text-white">
              {t.finder.types.all}
            </option>
            <option value="content_tour" className="bg-[#121c21] text-white">
              {t.finder.types.content_tour}
            </option>
            <option value="mountain_nature" className="bg-[#121c21] text-white">
              {t.finder.types.mountain_nature}
            </option>
            <option value="cultural_city" className="bg-[#121c21] text-white">
              {t.finder.types.cultural_city}
            </option>
          </select>
        </div>

        {/* Travelers */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#EDE6DA]/75">
            {t.finder.travelersLabel}
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 4, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setTravelers(num)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-medium transition-colors cursor-pointer border ${
                  travelers === num
                    ? "bg-[#0786c7] text-white border-[#0786c7]"
                    : "bg-white/5 border-white/15 text-[#EDE6DA]/75 hover:bg-white/10"
                }`}
              >
                {num === 6 ? "6+" : num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Strip */}
      <div className="pt-2 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          {filteredTours.slice(0, 3).map((tour) => (
            <Link
              key={tour.id}
              to={`/tours/${tour.slug}`}
              className="px-3.5 py-2 rounded-xl bg-white/6 hover:bg-white/12 border border-white/12 text-xs font-medium text-white transition-colors flex items-center gap-2"
            >
              <span>{tour.title[locale]}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0786c7]" />
            </Link>
          ))}
          {filteredTours.length > 3 && (
            <span className="text-xs text-[#EDE6DA]/60">
              {t.finder.moreTours.replace("{count}", String(filteredTours.length - 3))}
            </span>
          )}
        </div>

        <GlassButton
          variant="primary"
          href={whatsappInquiryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          <span>{t.finder.consultationBtn}</span>
        </GlassButton>
      </div>
    </GlassPanel>
  );
};
