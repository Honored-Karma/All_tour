import React, { useState } from "react";
import { ArrowRight, ArrowUpRight, Heart, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tour } from "../../data/tours";
import { getDestinationById } from "../../data/destinations";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { GlassPanel } from "../glass/GlassPanel";

interface TourCardProps {
  tour: Tour;
  dict: Dictionary;
  locale: Locale;
  onOpenDetails?: (tour: Tour) => void;
  onBookTour?: (tour: Tour) => void;
  onCursorEnter?: () => void;
  onCursorLeave?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (tourId: string) => void;
  isCompared?: boolean;
  onToggleCompare?: (tourId: string) => void;
  directLink?: boolean;
  useCatalogImage?: boolean;
}

export const TourCard: React.FC<TourCardProps> = ({
  tour,
  dict,
  locale,
  onOpenDetails,
  onBookTour,
  onCursorEnter,
  onCursorLeave,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare,
  directLink = true,
  useCatalogImage = false,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const destination = getDestinationById(tour.destinationId);

  const displayImage =
    useCatalogImage && tour.catalogCardImage
      ? tour.catalogCardImage
      : tour.image;

  const imagePosition =
    useCatalogImage && tour.catalogCardImagePosition
      ? tour.catalogCardImagePosition
      : undefined;

  const durationText = tour.duration
    ? tour.duration[locale]
    : dict.tours.card.durationFallback;

  const nextDateText =
    tour.departureDates.length > 0
      ? tour.departureDates[0]
      : dict.tours.card.nextDateFallback;

  const priceText =
    typeof tour.priceKzt === "number"
      ? `${tour.priceKzt.toLocaleString("ru-KZ")} ₸`
      : tour.posterReferencePriceKzt
      ? `${tour.posterReferencePriceKzt.toLocaleString("ru-KZ")} ₸ ${dict.tours.card.posterRefPriceSuffix}`
      : dict.tours.card.priceFallback;

  const handleCardClick = () => {
    if (onOpenDetails) onOpenDetails(tour);
  };

  return (
    <GlassPanel
      data-testid={`tour-card-${tour.id}`}
      className="group overflow-hidden flex flex-col justify-between p-5 sm:p-7 transition-all duration-300 hover:border-white/30"
    >
      <div>
        {/* Editorial photographic frame */}
        <div
          onMouseEnter={onCursorEnter}
          onMouseLeave={onCursorLeave}
          style={{ background: destination.media.fallbackGradient }}
          className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-5 select-none"
        >
          {directLink ? (
            <Link
              to={`/tours/${tour.slug}`}
              className="block w-full h-full"
              aria-label={`${dict.tours.card.detailsBtn}: ${tour.title[locale]}`}
            >
              {!imgFailed && (
                <img
                  src={displayImage}
                  alt={tour.title[locale]}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  style={imagePosition ? { objectPosition: imagePosition } : undefined}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              )}
            </Link>
          ) : (
            <div
              onClick={handleCardClick}
              role="button"
              tabIndex={0}
              className="w-full h-full cursor-pointer"
            >
              {!imgFailed && (
                <img
                  src={displayImage}
                  alt={tour.title[locale]}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={() => setImgFailed(true)}
                  style={imagePosition ? { objectPosition: imagePosition } : undefined}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              )}
            </div>
          )}

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.65) 100%)",
            }}
          />

          {/* Quick Action Overlays: Favorites & Compare */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
            {onToggleCompare && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleCompare(tour.id);
                }}
                aria-label={isCompared ? dict.tours.card.compareRemove : dict.tours.card.compareAdd}
                title={isCompared ? dict.tours.card.compareRemove : dict.tours.card.compareAdd}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                  isCompared
                    ? "bg-[#0786c7] text-white border-[#0786c7]"
                    : "bg-black/50 hover:bg-black/75 border-white/20 text-white/80 hover:text-white"
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            )}

            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleFavorite(tour.id);
                }}
                aria-label={isFavorite ? dict.tours.card.favoriteAdd : dict.tours.card.favoriteAdd}
                title={isFavorite ? dict.tours.card.favoriteIn : dict.tours.card.favoriteAdd}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                  isFavorite
                    ? "bg-[#d11d35] text-white border-[#d11d35]"
                    : "bg-black/50 hover:bg-black/75 border-white/20 text-white/80 hover:text-white"
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
            )}
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90 pointer-events-none">
            <span className="uppercase tracking-[0.14em] font-medium">
              {destination.name[locale]}
            </span>
            <span className="font-mono tabular-nums opacity-85">
              {dict.tours.card.departureFrom} {tour.departureCity[locale]}
            </span>
          </div>
        </div>

        {/* Unboxed editorial metadata line (Zero-Pill discipline) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#EDE6DA]/65 mb-2.5">
          <span>{destination.name[locale]}</span>
          <span aria-hidden="true">·</span>
          <span>{durationText}</span>
          <span aria-hidden="true">·</span>
          <span>{nextDateText}</span>
        </div>

        {/* Title & Summary */}
        <h3 className="font-display text-xl sm:text-2xl font-semibold text-white tracking-tight transition-transform duration-200 group-hover:translate-x-0.5 mb-2">
          {directLink ? (
            <Link to={`/tours/${tour.slug}`} className="hover:text-[#6BAFB3] transition-colors">
              {tour.title[locale]}
            </Link>
          ) : (
            tour.title[locale]
          )}
        </h3>
        <p className="text-sm text-[#EDE6DA]/75 leading-relaxed mb-6">
          {tour.summary[locale]}
        </p>
      </div>

      {/* Hairline divider + asymmetric editorial footer */}
      <div className="pt-5 border-t border-white/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="block text-[11px] uppercase tracking-wider text-[#EDE6DA]/50">
            {dict.tours.card.priceLabel}
          </span>
          <span className="text-sm sm:text-base font-medium text-[#EDE6DA] tabular-nums">
            {priceText}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {directLink ? (
            <Link
              to={`/tours/${tour.slug}`}
              className="liquid-glass-button-secondary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{dict.tours.card.detailsBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleCardClick}
              className="liquid-glass-button-secondary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{dict.tours.card.detailsBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          )}

          {onBookTour && (
            <button
              type="button"
              onClick={() => onBookTour(tour)}
              className="liquid-glass-button-primary px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{dict.tours.card.bookBtn}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </GlassPanel>
  );
};
