import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Heart, Search, X, MessageCircle } from "lucide-react";
import { tours, type Tour } from "../../data/tours";
import {
  defaultTourPlan,
  matchesTourPlan,
  readTourPlan,
  writeTourPlan,
  type TourPlan,
} from "../../lib/tourPlanner";
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
  onBookTour?: (tour: Tour) => void;
  onClearCompared?: () => void;
  onOpenCompareModal?: () => void;
}

export const ToursCatalogPage: React.FC<ToursCatalogPageProps> = ({
  dict,
  locale,
  favorites,
  onToggleFavorite,
  comparedTours,
  onToggleCompare,
  onBookTour,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const showOnlyFavorites = searchParams.get("favorites") === "true";
  const setShowOnlyFavorites = (show: boolean) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (show) next.set("favorites", "true");
      else next.delete("favorites");
      return next;
    });
  };
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc">(
    "default",
  );
  const plan = useMemo(() => readTourPlan(searchParams), [searchParams]);
  const updatePlan = (next: TourPlan) =>
    setSearchParams(writeTourPlan(next, searchParams), { replace: true });
  const resetFilters = () => {
    const params = writeTourPlan({ ...defaultTourPlan }, searchParams);
    params.delete("favorites");
    setSearchParams(params, { replace: true });
    setSearchQuery("");
  };

  const filteredTours = useMemo(() => {
    let list = tours.filter((tour) => matchesTourPlan(tour, plan));

    if (showOnlyFavorites) {
      list = list.filter((t) => favorites.includes(t.id));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.title[locale].toLowerCase().includes(q) ||
          t.summary[locale].toLowerCase().includes(q) ||
          t.subtitle[locale].toLowerCase().includes(q),
      );
    }

    if (sortBy === "price_asc") {
      list.sort(
        (a, b) =>
          (a.posterReferencePriceKzt || 999999) -
          (b.posterReferencePriceKzt || 999999),
      );
    } else if (sortBy === "price_desc") {
      list.sort(
        (a, b) =>
          (b.posterReferencePriceKzt || 0) - (a.posterReferencePriceKzt || 0),
      );
    }

    return list;
  }, [plan, searchQuery, showOnlyFavorites, favorites, sortBy, locale]);

  const generalWhatsAppUrl = buildWhatsAppBookingUrl({ locale });

  return (
    <div className="min-h-screen bg-canvas text-ink pt-28 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-7">
        {/* Editorial Page Header */}
        <div data-reveal className="space-y-3 max-w-4xl">
          <p className="editorial-kicker text-sage-ink">
            {dict.catalog.kicker}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-ink tracking-tight">
            {dict.catalog.title}
          </h1>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            {dict.catalog.subtitle}
          </p>

          {comparedTours.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCompareModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sage text-on-accent text-xs font-semibold transition-transform hover:scale-105 cursor-pointer shadow-md"
              >
                <span>
                  {dict.catalog.compareSelected} ({comparedTours.length})
                </span>
              </button>
            </div>
          )}
        </div>

        <SmartTourFinder
          locale={locale}
          dict={dict}
          plan={plan}
          onChange={updatePlan}
          resultCount={filteredTours.length}
        />

        <div id="tour-results" className="scroll-mt-28 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
            <div className="flex flex-wrap items-center gap-4">
              <h2
                className="text-base font-semibold text-ink"
                aria-live="polite"
              >
                {dict.planner.results.replace(
                  "{count}",
                  String(filteredTours.length),
                )}
              </h2>
              <button
                type="button"
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                aria-pressed={showOnlyFavorites}
                className={`inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-colors ${showOnlyFavorites ? "bg-accent/15 border-accent/40 text-accent" : "border-line text-muted hover:bg-surface-hover"}`}
              >
                <Heart
                  className={`w-4 h-4 ${showOnlyFavorites ? "fill-current" : ""}`}
                  aria-hidden="true"
                />
                {dict.catalog.favoritesFilter} ({favorites.length})
              </button>
            </div>
            {/* Search & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={dict.catalog.searchPlaceholder}
                  aria-label={dict.catalog.searchPlaceholder}
                  className="w-full pl-9 pr-8 py-2 rounded-xl bg-surface-soft border border-line text-xs sm:text-sm text-ink placeholder-muted focus:outline-none focus:border-sage"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label={dict.planner.reset}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <select
                value={sortBy}
                aria-label={dict.catalog.sort.default}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-3.5 py-2 rounded-xl bg-surface-soft border border-line text-xs text-ink focus:outline-none focus:border-sage cursor-pointer"
              >
                <option value="default" className="bg-surface text-ink">
                  {dict.catalog.sort.default}
                </option>
                <option value="price_asc" className="bg-surface text-ink">
                  {dict.catalog.sort.priceAsc}
                </option>
                <option value="price_desc" className="bg-surface text-ink">
                  {dict.catalog.sort.priceDesc}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Tours Grid */}
        {filteredTours.length === 0 ? (
          <GlassPanel className="p-12 text-center space-y-4">
            <p className="text-base text-muted">{dict.catalog.emptyTitle}</p>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-sage-ink hover:underline"
            >
              {dict.catalog.resetFilters}
            </button>
          </GlassPanel>
        ) : (
          <div data-reveal-group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                dict={dict}
                locale={locale}
                directLink={true}
                useCatalogImage={true}
                search={searchParams.toString()}
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
        <div data-reveal className="pt-8">
          <GlassPanel className="p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                {dict.catalog.consultationTitle}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {dict.catalog.consultationText}
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
              <span>{dict.catalog.consultationBtn}</span>
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
        dict={dict}
      />
    </div>
  );
};
