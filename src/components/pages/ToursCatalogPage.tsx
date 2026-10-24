import React, { useState, useMemo } from "react";
import { SlidersHorizontal, Heart, Search, X, MessageCircle } from "lucide-react";
import { tours, type Tour, type TourType } from "../../data/tours";
import { destinations, type DestinationId } from "../../data/destinations";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { buildWhatsAppBookingUrl } from "../../lib/whatsapp";
import { TourCard } from "../tours/TourCard";
import { SmartTourFinder } from "../tours/SmartTourFinder";
import { TourCompareModal } from "../tours/TourCompareModal";
import { GlassPanel } from "../glass/GlassPanel";
import { GlassButton } from "../glass/GlassButton";

interface ToursCatalogPageProps {
  dict: Dictionary;
  locale: Locale;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  comparedTours: string[];
  onToggleCompare: (id: string) => void;
  onClearCompared: () => void;
  onBookTour: (tour: Tour) => void;
}

export const ToursCatalogPage: React.FC<ToursCatalogPageProps> = ({
  dict,
  locale,
  favorites,
  onToggleFavorite,
  comparedTours,
  onToggleCompare,
  onClearCompared,
  onBookTour,
}) => {
  const [selectedDestination, setSelectedDestination] = useState<"all" | DestinationId>("all");
  const [selectedType, setSelectedType] = useState<"all" | TourType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc">("default");
  const [showFinder, setShowFinder] = useState(false);

  const filteredTours = useMemo(() => {
    let list = [...tours];

    if (showOnlyFavorites) {
      list = list.filter((t) => favorites.includes(t.id));
    }

    if (selectedDestination !== "all") {
      list = list.filter((t) => t.destinationId === selectedDestination);
    }

    if (selectedType !== "all") {
      list = list.filter((t) => t.tourType === selectedType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title[locale].toLowerCase().includes(q) ||
          t.summary[locale].toLowerCase().includes(q) ||
          t.subtitle[locale].toLowerCase().includes(q)
      );
    }

    if (sortBy === "price_asc") {
      list.sort((a, b) => (a.posterReferencePriceKzt || 999999) - (b.posterReferencePriceKzt || 999999));
    } else if (sortBy === "price_desc") {
      list.sort((a, b) => (b.posterReferencePriceKzt || 0) - (a.posterReferencePriceKzt || 0));
    }

    return list;
  }, [selectedDestination, selectedType, searchQuery, showOnlyFavorites, favorites, sortBy, locale]);

  const generalWhatsAppUrl = buildWhatsAppBookingUrl({ locale });

  return (
    <div className="min-h-screen bg-[#0d1518] text-[#EDE6DA] pt-28 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Editorial Page Header */}
        <div className="space-y-4 max-w-3xl border-b border-white/10 pb-8">
          <p className="editorial-kicker text-[#0786c7]">
            {locale === "kz" ? "АЛМАТЫДАН ТУРЛАР КАТАЛОГЫ" : "КАТАЛОГ МАРШРУТОВ ALL TOUR"}
          </p>
          <h1 className="headline-section font-bold text-white">
            {locale === "kz" ? "Барлық саяхаттар мен контент-турлар." : "Все путешествия и авторские программы."}
          </h1>
          <p className="text-base sm:text-lg text-[#EDE6DA]/80 leading-relaxed">
            {locale === "kz"
              ? "Алматыдан Қырғызстан, Қытай және Грузияға шығатын нақты бағыттар. Ресми афишалар бойынша бағдарламаларды таңдап, күндерді менеджермен нақтылаңыз."
              : "Настоящие маршруты с отправлением из Алматы: контент-туры в Кыргызстан, 6-дневный тур в Урумчи, 3-дневный тур в Китай и путешествия в Грузию. Все цены подтверждаются менеджером."}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowFinder((prev) => !prev)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white transition-colors cursor-pointer border border-white/15"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#0786c7]" />
              <span>{showFinder ? "Скрыть быстрый поиск" : "Открыть Smart Tour Finder"}</span>
            </button>

            {comparedTours.length > 0 && (
              <button
                type="button"
                onClick={() => setCompareModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0786c7] text-white text-xs font-semibold transition-transform hover:scale-105 cursor-pointer shadow-md"
              >
                <span>Сравнить выбранные ({comparedTours.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Smart Tour Finder */}
        {showFinder && (
          <div className="animate-fadeIn">
            <SmartTourFinder locale={locale} />
          </div>
        )}

        {/* Filter & Control Bar */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
            {/* Country Tabs */}
            <div
              role="group"
              aria-label="Фильтр по стране"
              className="liquid-glass-subtle p-1.5 rounded-2xl inline-flex flex-wrap items-center gap-1 self-start"
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedDestination("all");
                  setShowOnlyFavorites(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                  selectedDestination === "all" && !showOnlyFavorites
                    ? "bg-[#EDE6DA] text-[#111d22] font-semibold shadow-sm"
                    : "text-[#EDE6DA]/75 hover:text-white hover:bg-white/5"
                }`}
              >
                {dict.tours.filters.all}
              </button>
              {destinations.map((dest) => (
                <button
                  key={dest.id}
                  type="button"
                  onClick={() => {
                    setSelectedDestination(dest.id);
                    setShowOnlyFavorites(false);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                    selectedDestination === dest.id && !showOnlyFavorites
                      ? "bg-[#EDE6DA] text-[#111d22] font-semibold shadow-sm"
                      : "text-[#EDE6DA]/75 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {dest.name[locale]}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowOnlyFavorites((prev) => !prev)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                  showOnlyFavorites
                    ? "bg-[#d11d35] text-white font-semibold shadow-sm"
                    : "text-[#EDE6DA]/75 hover:text-white hover:bg-white/5"
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? "fill-current" : ""}`} />
                <span>Избранное ({favorites.length})</span>
              </button>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={locale === "kz" ? "Тур атауы бойынша іздеу..." : "Поиск по названию..."}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/6 border border-white/12 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#0786c7]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3.5 py-2 rounded-xl bg-white/6 border border-white/12 text-xs text-white focus:outline-none focus:border-[#0786c7] cursor-pointer"
              >
                <option value="default" className="bg-[#121c21] text-white">
                  По умолчанию
                </option>
                <option value="price_asc" className="bg-[#121c21] text-white">
                  Сначала доступнее
                </option>
                <option value="price_desc" className="bg-[#121c21] text-white">
                  Сначала масштабнее
                </option>
              </select>
            </div>
          </div>

          {/* Tour Type Sub-filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#EDE6DA]/70 pt-1">
            <span className="text-white/40">Формат:</span>
            {[
              { id: "all", label: "Все форматы" },
              { id: "content_tour", label: "Контент-туры (фото/видео)" },
              { id: "mountain_nature", label: "Горные и озёрные" },
              { id: "cultural_city", label: "Городские и культурные" },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedType(fmt.id as any)}
                className={`px-3 py-1 rounded-lg border transition-colors cursor-pointer ${
                  selectedType === fmt.id
                    ? "bg-white/15 text-white border-white/30"
                    : "bg-transparent text-[#EDE6DA]/60 border-white/10 hover:text-white"
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tours Grid */}
        {filteredTours.length === 0 ? (
          <GlassPanel className="p-12 text-center space-y-4">
            <p className="text-base text-white/80">
              По вашим фильтрам ничего не найдено.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedDestination("all");
                setSelectedType("all");
                setSearchQuery("");
                setShowOnlyFavorites(false);
              }}
              className="text-xs text-[#0786c7] hover:underline"
            >
              Сбросить все фильтры
            </button>
          </GlassPanel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                dict={dict}
                locale={locale}
                directLink={true}
                useCatalogImage={true}
                isFavorite={favorites.includes(tour.id)}
                onToggleFavorite={onToggleFavorite}
                isCompared={comparedTours.includes(tour.id)}
                onToggleCompare={onToggleCompare}
                onBookTour={onBookTour}
              />
            ))}
          </div>
        )}

        {/* Bottom Conversion & WhatsApp consultation block */}
        <div className="pt-8">
          <GlassPanel className="p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                Нужна помощь в выборе или нестандартная дата?
              </h3>
              <p className="text-sm text-[#EDE6DA]/75 leading-relaxed">
                Напишите нашему менеджеру в WhatsApp — проверим расписание выездов из Алматы, расскажем о свободных местах и поможем спланировать поездку.
              </p>
            </div>
            <GlassButton
              variant="primary"
              href={generalWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>Написать в WhatsApp ↗</span>
            </GlassButton>
          </GlassPanel>
        </div>
      </div>

      <TourCompareModal
        open={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        selectedTourIds={comparedTours}
        onRemoveTour={onToggleCompare}
        locale={locale}
      />
    </div>
  );
};
