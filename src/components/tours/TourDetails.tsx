import React, { useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import type { Tour } from "../../data/tours";
import { getDestinationById } from "../../data/destinations";
import { realReviews } from "../../data/reviews";
import type { Dictionary } from "../../i18n/ru";
import { buildWhatsAppBookingUrl, type Locale } from "../../lib/whatsapp";
import { GlassModal } from "../glass/GlassModal";
import { TourItinerary } from "./TourItinerary";
import { useCurrency } from "../../context/CurrencyContext";
import { PriceDisplay } from "../common/PriceDisplay";

interface TourDetailsProps {
  tour: Tour | null;
  onClose: () => void;
  onSelectForBookingForm: (tour: Tour) => void;
  onOpenAllReviews?: () => void;
  dict: Dictionary;
  locale: Locale;
}

export const TourDetails: React.FC<TourDetailsProps> = ({
  tour,
  onClose,
  onSelectForBookingForm,
  onOpenAllReviews,
  dict,
  locale,
}) => {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const { formatTourPrice } = useCurrency();

  if (!tour) return null;

  const destination = getDestinationById(tour.destinationId);
  const gallery = tour.gallery.length > 0 ? tour.gallery : [tour.image];
  const currentImage = gallery[selectedImageIdx] || tour.image;

  const durationText = tour.duration
    ? tour.duration[locale]
    : dict.tours.card.durationFallback;

  const datesText =
    tour.departureDates.length > 0
      ? tour.departureDates.join(", ")
      : dict.tours.card.nextDateFallback;

  const priceResult = formatTourPrice(tour, dict.tours.card.priceFallback);

  const directWhatsappUrl = buildWhatsAppBookingUrl({
    destinationId: tour.destinationId,
    destinationName: destination.name[locale],
    tourTitle: tour.title[locale],
    locale,
  });

  // Contextual reviews matching the tour destination (or featured reviews fallback)
  const destinationReviews = realReviews.filter(
    (r) => r.destinationId === tour.destinationId
  );
  const contextualReviews =
    destinationReviews.length > 0
      ? destinationReviews.slice(0, 2)
      : realReviews.slice(0, 2);

  return (
    <GlassModal
      open={Boolean(tour)}
      onClose={onClose}
      title={`${destination.name[locale]} · ${tour.title[locale]}`}
      closeLabel={dict.tours.modal.closeLabel}
    >
      {/* 1 & 2. Header: Country, Title, Subtitle */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6BAFB3] uppercase tracking-wider">
          <span>{destination.name[locale]}</span>
          <span aria-hidden="true">·</span>
          <span>
            {dict.tours.card.departureFrom} {tour.departureCity[locale]}
          </span>
          <span aria-hidden="true">·</span>
          <span>{dict.tours.card.statusOnRequest}</span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
          {tour.title[locale]}
        </h2>
        <p className="text-base text-[#EDE6DA]/80">{tour.subtitle[locale]}</p>
      </div>

      {/* 3. Interactive Gallery */}
      <div className="space-y-3" aria-label={dict.tours.modal.galleryLabel}>
        <div
          style={{ background: destination.media.fallbackGradient }}
          className="aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/15"
        >
          <img
            src={currentImage}
            alt={`${tour.title[locale]} — ${selectedImageIdx + 1}`}
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="w-full h-full object-cover"
          />
        </div>
        {gallery.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-1">
            {gallery.map((imgUrl, idx) => (
              <button
                key={imgUrl + idx}
                type="button"
                onClick={() => setSelectedImageIdx(idx)}
                aria-label={`${dict.tours.modal.photoAria} ${idx + 1}`}
                className={`relative w-24 h-16 rounded-xl overflow-hidden border transition-all shrink-0 cursor-pointer ${
                  selectedImageIdx === idx
                    ? "border-white ring-2 ring-white/40"
                    : "border-white/15 opacity-65 hover:opacity-100"
                }`}
              >
                <img
                  src={imgUrl}
                  alt={`${tour.title[locale]} — ${idx + 1}`}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4, 5, 6. Key facts row: Duration, Departure Dates, Price */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4 px-5 rounded-2xl bg-white/5 border border-white/12">
        <div>
          <span className="block text-xs text-[#EDE6DA]/55">
            {dict.tours.card.durationLabel}
          </span>
          <span className="text-sm font-medium text-white">{durationText}</span>
        </div>
        <div>
          <span className="block text-xs text-[#EDE6DA]/55">
            {dict.tours.card.nextDateLabel}
          </span>
          <span className="text-sm font-medium text-white">{datesText}</span>
        </div>
        <div>
          <span className="block text-xs text-[#EDE6DA]/55 mb-0.5">
            {dict.tours.card.priceLabel}
          </span>
          <PriceDisplay
            priceResult={priceResult}
            className="text-sm font-semibold"
          />
          {priceResult.note && (
            <span className="block text-[11px] text-[#EDE6DA]/60 font-sans leading-tight mt-0.5">
              ({priceResult.note})
            </span>
          )}
        </div>
      </div>

      {/* 7. Detailed Description */}
      <div className="space-y-2">
        <h4 className="editorial-kicker text-white/60">
          {dict.tours.modal.overviewLabel}
        </h4>
        <p className="text-sm sm:text-base text-[#EDE6DA]/85 leading-relaxed">
          {tour.description[locale]}
        </p>
      </div>

      {/* 8. Itinerary Timeline */}
      <TourItinerary
        steps={tour.itinerary}
        locale={locale}
        title={dict.tours.modal.itineraryTitle}
        notice={dict.tours.modal.itineraryNotice}
      />

      {/* 9 & 10. Included / Excluded */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <h4 className="text-sm font-semibold text-white">
            {dict.tours.modal.includedTitle}
          </h4>
          <ul className="space-y-2 text-sm text-[#EDE6DA]/80">
            {tour.included[locale].map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                — {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <h4 className="text-sm font-semibold text-white">
            {dict.tours.modal.excludedTitle}
          </h4>
          <ul className="space-y-2 text-sm text-[#EDE6DA]/75">
            {tour.excluded[locale].map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                — {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Contextual Traveler Reviews inside Tour Details */}
      <div className="space-y-4 pt-2 border-t border-white/12">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-xs uppercase tracking-wider text-white/60">
            {dict.tours.modal.reviewsTitle}
          </h4>
          {onOpenAllReviews && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenAllReviews();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-[#6BAFB3] hover:text-white transition-colors cursor-pointer"
            >
              <span>{dict.tours.modal.allReviewsLink}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contextualReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2"
            >
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                «{rev.quote}»
              </p>
              <div className="text-xs text-[#EDE6DA]/60">
                {rev.author} · {rev.guideName[locale]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 11 & 12. Important Notes & Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-white/60">
            {dict.tours.modal.notesTitle}
          </h4>
          <ul className="space-y-1.5 text-xs sm:text-sm text-[#EDE6DA]/75">
            {tour.notes[locale].map((note, idx) => (
              <li key={idx} className="leading-relaxed">
                • {note}
              </li>
            ))}
          </ul>
        </div>
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-white/60">
            {dict.tours.modal.documentsTitle}
          </h4>
          <p className="text-xs sm:text-sm text-[#EDE6DA]/75 leading-relaxed">
            {tour.documentsInfo[locale]}
          </p>
        </div>
      </div>

      {/* 13. WhatsApp & Booking Form CTAs */}
      <div className="pt-4 border-t border-white/15 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => {
            onSelectForBookingForm(tour);
          }}
          className="liquid-glass-button-secondary px-5 py-3.5 rounded-xl text-sm font-medium text-center cursor-pointer"
        >
          {dict.tours.modal.fillFormCta}
        </button>
        <a
          href={directWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="liquid-glass-button-primary px-6 py-3.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2"
        >
          <span>{dict.tours.modal.bookDirectCta}</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </GlassModal>
  );
};
