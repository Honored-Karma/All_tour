import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
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
import { getTourBySlug, type Tour } from "../../data/tours";
import { getDestinationById } from "../../data/destinations";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { buildWhatsAppBookingUrl } from "../../lib/whatsapp";
import { MediaGallery } from "../gallery/MediaGallery";
import { GlassPanel } from "../glass/GlassPanel";
import { GlassButton } from "../glass/GlassButton";
import { BookingForm } from "../booking/BookingForm";
import { useCurrency } from "../../context/CurrencyContext";
import { PriceDisplay } from "../common/PriceDisplay";
import type { StoryScreenshotAsset } from "../../data/reviews";
import { readTourPlan, formatPlanDates } from "../../lib/tourPlanner";
import { UpcomingDepartures } from "../tours/UpcomingDepartures";
import { realReviews } from "../../data/reviews";
import { ReviewCard } from "../reviews/ReviewCard";
import { responsiveMedia } from "../../lib/media";
import instagramResearch from "../../data/instagramResearch.json";

interface TourDetailPageProps {
  dict: Dictionary;
  locale: Locale;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  comparedTours: string[];
  onToggleCompare: (id: string) => void;
  onBookTour?: (tour: Tour) => void;
  onOpenStory?: (story: StoryScreenshotAsset) => void;
}

export const TourDetailPage: React.FC<TourDetailPageProps> = ({
  dict,
  locale,
  favorites,
  onToggleFavorite,
  comparedTours,
  onToggleCompare,
  onOpenStory,
}) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = readTourPlan(searchParams);
  const [copiedShare, setCopiedShare] = useState(false);
  const { formatTourPrice } = useCurrency();
  const returnParams = new URLSearchParams(searchParams);
  returnParams.delete("tour");
  returnParams.set("lang", locale);
  const resultsHref = `/tours?${returnParams.toString()}#tour-results`;

  const tour = slug ? getTourBySlug(slug) : undefined;
  const [bookingVisible, setBookingVisible] = useState(false);
  useEffect(() => {
    const element = document.getElementById("booking");
    if (!element || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setBookingVisible(entry.isIntersecting));
    observer.observe(element);
    return () => observer.disconnect();
  }, [tour?.id]);

  if (!tour) {
    return (
      <div className="min-h-screen bg-canvas text-ink pt-36 pb-20 px-4 sm:px-8 flex flex-col items-center justify-center text-center space-y-4">
        <h1 className="font-display text-2xl font-bold text-ink">{dict.tourDetail.notFoundTitle}</h1>
        <p className="text-sm text-muted max-w-md">
          {dict.tourDetail.notFoundSubtitle}
        </p>
        <Link
          to={resultsHref}
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
  const programSource = instagramResearch.programSources[tour.id as keyof typeof instagramResearch.programSources];

  const directWhatsAppUrl = buildWhatsAppBookingUrl({
    locale,
    destinationName: destination.name[locale],
    tourTitle: tour.title[locale],
    desiredDate: formatPlanDates(plan, locale),
    travelersCount: plan.travelers,
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
      try {
        await navigator.clipboard.writeText(url);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      } catch { /* Sharing can be cancelled or denied by the browser. */ }
    }
  };

  const galleryItems = tour.media.map((m, idx) => ({
    id: `${tour.id}-media-${idx}`,
    src: m.src,
    alt: m.alt,
    caption: m.caption,
    type: m.type,
  }));

  const priceResult = formatTourPrice(
    tour,
    dict.tourDetail.priceFallback
  );

  return (
    <div className="min-h-screen bg-canvas text-ink pt-28 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation & Top Action Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-line pb-4">
          <Link
            to={resultsHref}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-sage-ink hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{dict.tourDetail.backToResults}</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              title={dict.tourDetail.shareTitle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-soft hover:bg-surface-hover text-xs text-ink transition-colors cursor-pointer border border-line"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedShare ? dict.tourDetail.copiedShare : dict.tourDetail.shareBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => onToggleCompare(tour.id)}
              aria-label={isCmp ? dict.tourDetail.compareRemove : dict.tourDetail.compareAdd}
              aria-pressed={isCmp}
              className={`p-2 rounded-xl text-xs transition-colors cursor-pointer border ${
                isCmp
                  ? "bg-sage text-on-accent border-sage"
                  : "bg-surface-soft hover:bg-surface-hover border-line text-ink"
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
                  ? "bg-accent text-on-accent border-accent"
                  : "bg-surface-soft hover:bg-surface-hover border-line text-ink"
              }`}
              aria-label={isFav ? dict.tourDetail.favoriteIn : dict.tourDetail.favoriteAdd}
              title={isFav ? dict.tourDetail.favoriteIn : dict.tourDetail.favoriteAdd}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-sage-ink font-mono uppercase tracking-wider">
              <Link to={`/destinations/${tour.destinationId}`} className="hover:underline">
                {destination.name[locale]}
              </Link>
              <span aria-hidden="true" className="text-muted">
                ·
              </span>
              <span>{tour.departureCity[locale]}</span>
              <span aria-hidden="true" className="text-muted">
                ·
              </span>
              <span>
                {tour.duration ? tour.duration[locale] : dict.tourDetail.durationFallback}
              </span>
            </div>

            <h1 className="headline-section font-bold text-ink tracking-tight">
              {tour.title[locale]}
            </h1>

            <p className="text-base sm:text-lg text-ink font-medium leading-snug">
              {tour.subtitle[locale]}
            </p>

            <p className="text-sm sm:text-base text-muted leading-relaxed">
              {tour.description[locale]}
            </p>

            {/* Reference Price & Dates Note */}
            <div className="p-4 rounded-2xl bg-surface-soft border border-line space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="text-xs uppercase tracking-wider text-muted">
                  {dict.tourDetail.priceLabel}
                </span>
                <div className="text-right">
                  <PriceDisplay
                    priceResult={priceResult}
                    className="text-lg sm:text-xl font-bold"
                  />
                  {priceResult.note && (
                    <span className="text-[11px] text-muted font-sans block leading-tight mt-0.5">
                      ({priceResult.note})
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                {dict.tourDetail.priceNotice}
              </p>
              {tour.posterReferenceDates && (
                <p className="text-xs text-sage-ink font-mono pt-1">
                  {tour.posterReferenceDates[locale]}
                </p>
              )}
            </div>
          </div>

          {/* Right Image / Hero Visual */}
          <div className="photo-surface lg:col-span-5 relative aspect-[16/11] sm:aspect-[4/3] rounded-3xl overflow-hidden border border-line shadow-2xl">
            <picture>
              {tour.image.startsWith("/media/") && (
                <source srcSet={responsiveMedia(tour.image)} sizes="(min-width: 1024px) 520px, 100vw" type="image/webp" />
              )}
              {tour.image === "/assets/brand/group-china-tour.png" && (
                <source srcSet={responsiveMedia(tour.image)} sizes="(min-width: 1024px) 520px, 100vw" type="image/webp" />
              )}
              <img
                src={tour.image}
                alt={tour.title[locale]}
                loading="eager"
                fetchPriority="high"
                decoding="sync"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
                className="w-full h-full object-cover"
              />
            </picture>
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent 50%, rgba(9, 15, 18, 0.85) 100%)",
              }}
            />
          </div>
        </div>

        {/* Media & Original Posters Gallery */}
        <UpcomingDepartures dict={dict} locale={locale} tourId={tour.id} />
        {galleryItems.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-line">
            <MediaGallery
              items={galleryItems}
              locale={locale}
              title={dict.tourDetail.galleryTitle}
              subtitle={dict.tourDetail.gallerySubtitle}
            />
          </section>
        )}

        {/* Detailed Program / Itinerary */}
        <section className="space-y-6 pt-4 border-t border-line">
          <div className="space-y-1">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
              {dict.tourDetail.itineraryTitle}
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              {dict.tourDetail.itinerarySubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tour.itinerary.map((step, idx) => (
              <GlassPanel key={idx} className="p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-sage-ink">
                    <span>{dict.tourDetail.stepPrefix} 0{idx + 1}</span>
                    {step.optional && (
                      <span className="text-muted uppercase text-[10px]">
                        {dict.tourDetail.optionalStep}
                      </span>
                    )}
                  </div>
                  {step.image && (
                    <img
                      src={step.image}
                      srcSet={responsiveMedia(step.image)}
                      sizes="(min-width: 768px) 400px, 100vw"
                      loading="lazy"
                      decoding="async"
                      alt={step.title[locale]}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="w-full aspect-[16/10] object-cover rounded-xl border border-line"
                    />
                  )}
                  <h3 className="font-display text-base font-semibold text-ink leading-snug">
                    {step.title[locale]}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {step.description[locale]}
                  </p>
                </div>
              </GlassPanel>
            ))}
          </div>
        </section>

        {/* What is Included & What is Excluded */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-line">
          <div className="p-6 sm:p-7 rounded-3xl bg-surface-soft border border-line space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Check className="w-4 h-4 text-sage-ink" />
              <span>{dict.tourDetail.includedTitle}</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted">
              {tour.included[locale].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-sage-ink font-bold">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-surface-soft border border-line space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <X className="w-4 h-4 text-accent" />
              <span>{dict.tourDetail.excludedTitle}</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-muted">
              {tour.excluded[locale].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-accent font-bold">—</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Optional activities if available */}
        {tour.optionalActivities && (
          <section className="p-6 rounded-3xl bg-surface-soft border border-line space-y-3">
            <h4 className="text-sm font-semibold text-ink">
              {dict.tourDetail.optionalActivitiesTitle}
            </h4>
            <div className="flex flex-wrap gap-2 text-xs">
              {tour.optionalActivities[locale].map((act, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl bg-surface-soft border border-line text-muted"
                >
                  {act}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Useful to know before departure / Documents */}
        {programSource && (
          <aside className="rounded-2xl border border-line bg-surface-soft p-5 text-sm text-muted space-y-2">
            <p>{dict.departures.programSourceNotice}</p>
            <a href={programSource} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sage-ink underline underline-offset-4">{dict.departures.source}<ArrowUpRight className="w-4 h-4" aria-hidden="true" /></a>
          </aside>
        )}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-line">
          <div className="space-y-3">
            <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
              <FileText className="w-4 h-4 text-sage-ink" />
              <span>{dict.tourDetail.documentsTitle}</span>
            </h3>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              {tour.documentsInfo[locale]}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-base font-semibold text-ink flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-sage-ink" />
              <span>{dict.tourDetail.notesTitle}</span>
            </h3>
            <ul className="space-y-1.5 text-xs sm:text-sm text-muted">
              {tour.notes[locale].map((note, idx) => (
                <li key={idx} className="leading-relaxed">
                  • {note}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Shared booking form keeps validation and WhatsApp messages consistent. */}
        {onOpenStory && realReviews.some((review) => review.destinationId === tour.destinationId) && (
          <section className="space-y-5 pt-6 border-t border-line">
            <h2 className="text-xl font-semibold">{dict.reviews.title}</h2>
            <div className="grid gap-5 md:grid-cols-2">{realReviews.filter((review) => review.destinationId === tour.destinationId).slice(0, 2).map((review) => (
              <ReviewCard key={review.id} review={review} dict={dict} locale={locale} onOpenStory={onOpenStory} />
            ))}</div>
          </section>
        )}
        <section className="pt-8 border-t border-line">
          <BookingForm key={tour.id} dict={dict} locale={locale} preselectedTour={tour}
            initialDesiredDate={formatPlanDates(plan, locale)} initialTravelers={plan.travelers} />
        </section>
      </div>
      <div hidden={bookingVisible} className="sm:hidden fixed bottom-0 inset-x-0 z-30 border-t border-line bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md">
        <a href="#booking" className="liquid-glass-button-primary min-h-12 flex items-center justify-center rounded-xl text-sm font-semibold">{dict.tours.card.bookBtn}</a>
      </div>
    </div>
  );
};
