import React, { useState, useMemo } from "react";
import { Search, Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { tours, type Tour, type TourType } from "../../data/tours";
import type { DestinationId } from "../../data/destinations";
import type { Locale } from "../../lib/whatsapp";
import { buildWhatsAppBookingUrl } from "../../lib/whatsapp";
import { GlassPanel } from "../glass/GlassPanel";
import { GlassButton } from "../glass/GlassButton";
import { Link } from "react-router-dom";

interface SmartTourFinderProps {
  locale: Locale;
  onSelectTour?: (tour: Tour) => void;
}

export const SmartTourFinder: React.FC<SmartTourFinderProps> = ({ locale, onSelectTour }) => {
  const [selectedDestination, setSelectedDestination] = useState<"all" | DestinationId>("all");
  const [selectedDuration, setSelectedDuration] = useState<"all" | "short" | "multi">("all");
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
      if (selectedDuration === "short") {
        // 1-3 days
        if (tour.slug.includes("6d") || tour.id.includes("urumqi")) return false;
      } else if (selectedDuration === "multi") {
        // Multi-day
        if (tour.id === "kyrgyzstan-content-tour") return false;
      }
      return true;
    });
  }, [selectedDestination, selectedDuration, selectedType]);

  const whatsappInquiryUrl = useMemo(() => {
    const destName =
      selectedDestination === "kyrgyzstan"
        ? "Кыргызстан"
        : selectedDestination === "georgia"
        ? "Грузия"
        : selectedDestination === "china"
        ? "Китай"
        : "Направления ALL TOUR";
    return buildWhatsAppBookingUrl({
      locale,
      destinationName: destName,
      travelersCount: travelers,
      comment: "Подобрано через Smart Tour Finder на сайте",
    });
  }, [selectedDestination, travelers, locale]);

  return (
    <GlassPanel className="p-6 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#0786c7] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Tour Finder</span>
          </div>
          <h3 className="font-display text-lg sm:text-xl font-bold text-white">
            {locale === "kz" ? "Турды жылдам таңдау" : "Быстрый поиск тура под ваши планы"}
          </h3>
        </div>
        <span className="text-xs font-mono text-[#EDE6DA]/60 tabular-nums">
          {locale === "kz" ? `Табылғаны: ${filteredTours.length} тур` : `Подходит: ${filteredTours.length} предложений`}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Destination */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#EDE6DA]/75">
            {locale === "kz" ? "Бағыт" : "Направление"}
          </label>
          <select
            value={selectedDestination}
            onChange={(e) => setSelectedDestination(e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/8 border border-white/15 text-sm text-white focus:outline-none focus:border-[#0786c7]"
          >
            <option value="all" className="bg-[#121c21] text-white">
              {locale === "kz" ? "Барлық бағыттар" : "Все направления"}
            </option>
            <option value="kyrgyzstan" className="bg-[#121c21] text-white">
              {locale === "kz" ? "Қырғызстан" : "Кыргызстан"}
            </option>
            <option value="china" className="bg-[#121c21] text-white">
              {locale === "kz" ? "Қытай" : "Китай"}
            </option>
            <option value="georgia" className="bg-[#121c21] text-white">
              {locale === "kz" ? "Грузия" : "Грузия"}
            </option>
          </select>
        </div>

        {/* Duration */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#EDE6DA]/75">
            {locale === "kz" ? "Ұзақтығы" : "Длительность"}
          </label>
          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/8 border border-white/15 text-sm text-white focus:outline-none focus:border-[#0786c7]"
          >
            <option value="all" className="bg-[#121c21] text-white">
              {locale === "kz" ? "Кез келген" : "Любая длительность"}
            </option>
            <option value="short" className="bg-[#121c21] text-white">
              {locale === "kz" ? "1-3 күн (қысқа сапарлар)" : "1-3 дня (выходные и короткие)"}
            </option>
            <option value="multi" className="bg-[#121c21] text-white">
              {locale === "kz" ? "Көпкүндік (5-6 күн)" : "Многодневные туры (5-6 дней)"}
            </option>
          </select>
        </div>

        {/* Tour Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#EDE6DA]/75">
            {locale === "kz" ? "Формат" : "Формат поездки"}
          </label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-white/8 border border-white/15 text-sm text-white focus:outline-none focus:border-[#0786c7]"
          >
            <option value="all" className="bg-[#121c21] text-white">
              {locale === "kz" ? "Барлық форматтар" : "Все форматы"}
            </option>
            <option value="content_tour" className="bg-[#121c21] text-white">
              {locale === "kz" ? "Контент-турлар (фото/видео)" : "Контент-туры (фото/видео)"}
            </option>
            <option value="mountain_nature" className="bg-[#121c21] text-white">
              {locale === "kz" ? "Тау және табиғат" : "Горные и природные"}
            </option>
            <option value="cultural_city" className="bg-[#121c21] text-white">
              {locale === "kz" ? "Қалалық және мәдени" : "Культурные и городские"}
            </option>
          </select>
        </div>

        {/* Travelers */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-[#EDE6DA]/75">
            {locale === "kz" ? "Саяхатшылар саны" : "Количество человек"}
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
              +{filteredTours.length - 3} ещё
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
          <span>{locale === "kz" ? "Менеджермен WhatsApp-та кеңесу ↗" : "Получить консультацию в WhatsApp ↗"}</span>
        </GlassButton>
      </div>
    </GlassPanel>
  );
};
