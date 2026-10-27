import React, { useState } from "react";
import { ArrowRight, ArrowUpRight, Heart, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tour } from "../../data/tours";
import { getDestinationById } from "../../data/destinations";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { GlassPanel } from "../glass/GlassPanel";
import { useCurrency } from "../../context/CurrencyContext";
import { PriceDisplay } from "../common/PriceDisplay";

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
  search?: string;
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
  search = "",
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const destination = getDestinationById(tour.destinationId);
  const tourHref = `/tours/${tour.slug}${search ? `?${search}` : ""}`;

  const displayImage =
    useCatalogImage && tour.catalogCardImage
      ? tour.catalogCardImage
      : tour.image;

  const webpDisplayImage = displayImage.startsWith("/media/")
    ? displayImage.replace(/\.jpg$/, ".webp")
    : displayImage === "/assets/brand/group-china-tour.png"
    ? "/assets/brand/group-china-tour.webp"
    : null;

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

  const { formatTourPrice } = useCurrency();
  const priceResult = formatTourPrice(tour, dict.tours.card.priceFallback);

  const handleCardClick = () => {
    if (onOpenDetails) onOpenDetails(tour);
  };

  return (
    <GlassPanel
      data-testid={`tour-card-${tour.id}`}
      className="@container group overflow-hidden flex flex-col justify-between p-5 sm:p-7 transition-all duration-300 hover:border-line"
    >
      <div>
        {/* Editorial photographic frame */}
        <div
          onMouseEnter={onCursorEnter}
          onMouseLeave={onCursorLeave}
          style={{ background: destination.media.fallbackGradient }}
          className="photo-surface relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-5 select-none"
        >
          {directLink ? (
            <Link
              to={tourHref}
              className="block w-full h-full"
              aria-label={`${dict.tours.card.detailsBtn}: ${tour.title[locale]}`}
            >
              {!imgFailed && (
                <picture>
                  {webpDisplayImage && <source srcSet={webpDisplayImage} type="image/webp" />}
                  <img
                    src={displayImage}
                    alt={tour.title[locale]}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                    style={imagePosition ? { objectPosition: imagePosition } : undefined}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </picture>
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
                <picture>
                  {webpDisplayImage && <source srcSet={webpDisplayImage} type="image/webp" />}
                  <img
                    src={displayImage}
                    alt={tour.title[locale]}
                    loading="lazy"
                    decoding="async"
                    referrerPolicy="no-referrer"
                    onError={() => setImgFailed(true)}
                    style={imagePosition ? { objectPosition: imagePosition } : undefined}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                </picture>
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
                    ? "bg-sage text-on-accent border-sage"
                    : "bg-black/50 hover:bg-black/75 border-line text-muted hover:text-ink"
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
                aria-label={isFavorite ? dict.tours.card.favoriteIn : dict.tours.card.favoriteAdd}
                title={isFavorite ? dict.tours.card.favoriteIn : dict.tours.card.favoriteAdd}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border ${
                  isFavorite
                    ? "bg-accent text-on-accent border-accent"
                    : "bg-black/50 hover:bg-black/75 border-line text-muted hover:text-ink"
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${isFavorite ? "fill-current" : ""}`}
                />
              </button>
            )}
          </div>

          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-ink pointer-events-none">
            <span className="uppercase tracking-[0.14em] font-medium">
              {destination.name[locale]}
            </span>
            <span className="font-mono tabular-nums opacity-85">
              {dict.tours.card.departureFrom} {tour.departureCity[locale]}
            </span>
          </div>
        </div>

        {/* Unboxed editorial metadata line (Zero-Pill discipline) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted mb-2.5">
          <span>{destination.name[locale]}</span>
          <span aria-hidden="true">·</span>
          <span>{durationText}</span>
          <span aria-hidden="true">·</span>
          <span>{nextDateText}</span>
        </div>

        {/* Title & Summary */}
        <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink tracking-tight transition-transform duration-200 group-hover:translate-x-0.5 mb-2">
          {directLink ? (
            <Link to={tourHref} className="hover:text-sage-ink transition-colors">
              {tour.title[locale]}
            </Link>
          ) : (
            tour.title[locale]
          )}
        </h3>
        <p className="text-sm text-muted leading-relaxed mb-6">
          {tour.summary[locale]}
        </p>
      </div>

      {/* Give the price its own row so actions cannot squeeze or overlap it. */}
      <div className="pt-4 border-t border-line flex flex-col gap-4">
        <div className="flex flex-col min-w-0">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted block leading-none mb-1">
            {dict.tours.card.priceLabel}
          </span>
          <div className="flex items-center leading-tight">
            <PriceDisplay
              priceResult={priceResult}
              className="text-base sm:text-lg"
            />
          </div>
          {priceResult.note ? (
            <span className="text-[11px] text-muted font-sans tracking-normal block leading-tight mt-0.5">
              ({priceResult.note})
            </span>
          ) : (
            <span
              className="text-[11px] text-transparent select-none block leading-tight mt-0.5"
              aria-hidden="true"
            >
              &nbsp;
            </span>
          )}
        </div>

        {/* Stack actions when the card itself is too narrow for both labels. */}
        <div className={`grid gap-2 ${onBookTour ? "grid-cols-1 @min-[21rem]:grid-cols-2" : "grid-cols-1"}`}>
          {directLink ? (
            <Link
              to={tourHref}
              className="liquid-glass-button-secondary min-w-0 min-h-11 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5 text-center cursor-pointer transition-colors"
            >
              <span>{dict.tours.card.detailsBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleCardClick}
              className="liquid-glass-button-secondary min-w-0 min-h-11 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium inline-flex items-center justify-center gap-1.5 text-center cursor-pointer transition-colors"
            >
              <span>{dict.tours.card.detailsBtn}</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5" />
            </button>
          )}

          {onBookTour && (
            <button
              type="button"
              onClick={() => onBookTour(tour)}
              className="liquid-glass-button-primary min-w-0 min-h-11 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 text-center cursor-pointer shadow-md shadow-accent/10"
            >
              <span>{dict.tours.card.bookBtn}</span>
              <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          )}
        </div>
      </div>
    </GlassPanel>
  );
};
