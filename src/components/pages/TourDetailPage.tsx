import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  Heart,
  Check,
  X,
  Calendar,
  Clock,
  MapPin,
  MessageCircle,
  AlertCircle,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import { getTourBySlug } from "../../data/tours";
import { getDestinationById } from "../../data/destinations";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { buildWhatsAppBookingUrl } from "../../lib/whatsapp";
import { MediaGallery } from "../gallery/MediaGallery";
import { GlassPanel } from "../glass/GlassPanel";
import { GlassButton } from "../glass/GlassButton";
import { BookingForm } from "../booking/BookingForm";

interface TourDetailPageProps {
  dict: Dictionary;
  locale: Locale;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  comparedTours: string[];
  onToggleCompare: (id: string) => void;
}

export const TourDetailPage: React.FC<TourDetailPageProps> = ({
  dict,
  locale,
  favorites,
  onToggleFavorite,
  comparedTours,
  onToggleCompare,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copiedShare, setCopiedShare] = useState(false);

  const tour = slug ? getTourBySlug(slug) : undefined;

  if (!tour) {
    return (
      <div className="min-h-screen bg-[#0d1518] text-[#EDE6DA] pt-36 pb-20 px-4 sm:px-8 flex flex-col items-center justify-center text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-white">{dict.tourDetail.notFoundTitle}</h1>
        <p className="text-sm text-[#EDE6DA]/70 max-w-md">
          {dict.tourDetail.notFoundSubtitle}
        </p>
        <Link
          to="/tours"
          className="liquid-glass-button-primary px-5 py-2.5 rounded-xl text-sm font-semibold"
        >
          {dict.tourDetail.backToCatalog}
        </Link>
      </div>
    );
  }

  const destination = getDestinationById(tour.destinationId);
  const isFav = favorites.includes(tour.id);
  const isCmp = comparedTours.includes(tour.id);

  const directWhatsAppUrl = buildWhatsAppBookingUrl({
    locale,
    destinationName: destination.name[locale],
    tourTitle: tour.title[locale],
  });

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: tour.title[locale],
          text: tour.summary[locale],
          url,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const galleryItems = tour.media.map((m, idx) => ({
    id: `${tour.id}-media-${idx}`,
    src: m.src,
    alt: m.alt,
    caption: m.caption,
    type: m.type,
  }));

  const priceText =
    typeof tour.priceKzt === "number"
      ? `${tour.priceKzt.toLocaleString("ru-KZ")} ₸`
      : tour.posterReferencePriceKzt
      ? `${tour.posterReferencePriceKzt.toLocaleString("ru-KZ")} ₸ ${dict.compare.posterRefSuffix}`
      : dict.tourDetail.priceFallback;

  return (
    <div className="min-h-screen bg-[#0d1518] text-[#EDE6DA] pt-28 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation & Top Action Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#0786c7] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{dict.tourDetail.allTours}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              title={dict.tourDetail.shareTitle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/15 text-xs text-[#EDE6DA] transition-colors cursor-pointer border border-white/12"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedShare ? dict.tourDetail.copiedShare : dict.tourDetail.shareBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleCompare(tour.id)}
              className={`p-2 rounded-xl text-xs transition-colors cursor-pointer border ${
                isCmp
                  ? "bg-[#0786c7] text-white border-[#0786c7]"
                  : "bg-white/8 hover:bg-white/15 border-white/12 text-[#EDE6DA]"
              }`}
              title={isCmp ? dict.tourDetail.compareRemove : dict.tourDetail.compareAdd}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => onToggleFavorite(tour.id)}
              className={`p-2 rounded-xl text-xs transition-colors cursor-pointer border ${
                isFav
                  ? "bg-[#d11d35] text-white border-[#d11d35]"
                  : "bg-white/8 hover:bg-white/15 border-white/12 text-[#EDE6DA]"
              }`}
              title={isFav ? dict.tourDetail.favoriteIn : dict.tourDetail.favoriteAdd}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#0786c7] font-mono uppercase tracking-wider">
              <Link to={`/destinations/${tour.destinationId}`} className="hover:underline">
                {destination.name[locale]}
              </Link>
              <span aria-hidden="true" className="text-white/30">
                ·
              </span>
              <span>{tour.departureCity[locale]}</span>
              <span aria-hidden="true" className="text-white/30">
                ·
              </span>
              <span>
                {tour.duration ? tour.duration[locale] : dict.tourDetail.durationFallback}
              </span>
            </div>

            <h1 className="headline-section font-bold text-white tracking-tight">
              {tour.title[locale]}
            </h1>

            <p className="text-base sm:text-lg text-white/90 font-medium leading-snug">
              {tour.subtitle[locale]}
            </p>

            <p className="text-sm sm:text-base text-[#EDE6DA]/80 leading-relaxed">
              {tour.description[locale]}
            </p>

            {/* Reference Price & Dates Note */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-xs uppercase tracking-wider text-[#EDE6DA]/60">
                  {dict.tourDetail.priceLabel}
                </span>
                <span className="text-lg sm:text-xl font-display font-bold text-white tabular-nums">
                  {priceText}
                </span>
              </div>
              <p className="text-xs text-[#EDE6DA]/65 leading-relaxed">
                {dict.tourDetail.priceNotice}
              </p>
              {tour.posterReferenceDates && (
                <p className="text-xs text-[#6BAFB3] font-mono pt-1">
                  {tour.posterReferenceDates[locale]}
                </p>
              )}
            </div>
          </div>

          {/* Right Image / Hero Visual */}
          <div className="lg:col-span-5 relative aspect-[16/11] sm:aspect-[4/3] rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
            <img
              src={tour.image}
              alt={tour.title[locale]}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent 50%, rgba(9, 15, 18, 0.85) 100%)",
              }}
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white/90">
              <span className="font-mono">{destination.coordinates}</span>
              <span className="px-2.5 py-1 rounded-lg bg-black/60 text-white/90 text-xs">
                ALL TOUR · BEYOND BORDERS
              </span>
            </div>
          </div>
        </div>

        {/* Media & Original Posters Gallery */}
        {galleryItems.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-white/10">
            <MediaGallery
              items={galleryItems}
              locale={locale}
              title={dict.tourDetail.galleryTitle}
              subtitle={dict.tourDetail.gallerySubtitle}
            />
          </section>
        )}

        {/* Detailed Program / Itinerary */}
        <section className="space-y-6 pt-4 border-t border-white/10">
          <div className="space-y-1">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              {dict.tourDetail.itineraryTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#EDE6DA]/70">
              {dict.tourDetail.itinerarySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tour.itinerary.map((step, idx) => (
              <GlassPanel key={idx} className="p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[#0786c7]">
                    <span>{dict.tourDetail.stepPrefix} 0{idx + 1}</span>
                    {step.optional && (
                      <span className="text-[#EDE6DA]/60 uppercase text-[10px]">
                        {dict.tourDetail.optionalStep}
                      </span>
                    )}
                  </div>
                  {step.image && (
                    <img
                      src={step.image}
                      alt={step.title[locale]}
                      className="w-full aspect-[16/10] object-cover rounded-xl border border-white/10"
                    />
                  )}
                  <h3 className="font-display text-base font-semibold text-white leading-snug">
                    {step.title[locale]}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#EDE6DA]/75 leading-relaxed">
                    {step.description[locale]}
                  </p>
                </div>
              </GlassPanel>
            ))}
          </div>
        </section>

        {/* What is Included & What is Excluded */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
          <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.04] border border-white/12 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Check className="w-4 h-4 text-[#0786c7]" />
              <span>{dict.tourDetail.includedTitle}</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#EDE6DA]/85">
              {tour.included[locale].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-[#0786c7] font-bold">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white/[0.04] border border-white/12 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <X className="w-4 h-4 text-[#d11d35]" />
              <span>{dict.tourDetail.excludedTitle}</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-[#EDE6DA]/80">
              {tour.excluded[locale].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-[#d11d35] font-bold">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Optional activities if available */}
        {tour.optionalActivities && (
          <section className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
            <h4 className="text-sm font-semibold text-white">
              {dict.tourDetail.optionalActivitiesTitle}
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {tour.optionalActivities[locale].map((act, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-white/6 border border-white/10 text-white/85"
                >
                  {act}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Useful to know before departure / Documents */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
          <div className="space-y-3">
            <h3 className="font-display text-base font-semibold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0786c7]" />
              <span>{dict.tourDetail.documentsTitle}</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#EDE6DA]/80 leading-relaxed">
              {tour.documentsInfo[locale]}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-base font-semibold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#6BAFB3]" />
              <span>{dict.tourDetail.notesTitle}</span>
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-[#EDE6DA]/80">
              {tour.notes[locale].map((note, idx) => (
                <li key={idx} className="leading-relaxed">
                  • {note}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Shared booking form keeps validation and WhatsApp messages consistent. */}
        <section className="pt-8 border-t border-white/15">
          <BookingForm key={tour.id} dict={dict} locale={locale} preselectedTour={tour} />
        </section>
      </div>
    </div>
  );
};
