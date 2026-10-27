import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Check, ArrowRight, Compass } from "lucide-react";
import { destinations, getDestinationById, type DestinationId } from "../../data/destinations";
import { getToursByDestination, type Tour } from "../../data/tours";
import { getBrandAssetsByDestination } from "../../data/assets";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { buildWhatsAppBookingUrl } from "../../lib/whatsapp";
import { TourCard } from "../tours/TourCard";
import { MediaGallery } from "../gallery/MediaGallery";
import { GlassPanel } from "../glass/GlassPanel";
import { GlassButton } from "../glass/GlassButton";

interface DestinationPageProps {
  dict: Dictionary;
  locale: Locale;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  comparedTours: string[];
  onToggleCompare: (id: string) => void;
  onBookTour?: (tour: Tour) => void;
  onOpenTourDetails?: (tour: Tour) => void;
}

export const DestinationPage: React.FC<DestinationPageProps> = ({
  dict,
  locale,
  favorites,
  onToggleFavorite,
  comparedTours,
  onToggleCompare,
  onBookTour,
}) => {
  const { destinationId } = useParams<{ destinationId: string }>();
  const isValidDestination =
    destinationId && ["kyrgyzstan", "georgia", "china"].includes(destinationId);

  if (!isValidDestination) {
    return (
      <div
        data-testid="destination-not-found"
        className="min-h-screen bg-canvas text-ink pt-36 pb-20 px-4 sm:px-8 flex flex-col items-center justify-center text-center"
      >
        <GlassPanel className="max-w-md w-full p-8 sm:p-10 flex flex-col items-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-sand/10 border border-sand/20 flex items-center justify-center text-sand">
            <Compass className="w-8 h-8" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-2xl font-bold text-ink tracking-tight">
              {dict.destinationNotFound.title}
            </h1>
            <p className="text-sm text-muted font-sans leading-relaxed">
              {dict.destinationNotFound.description}
            </p>
          </div>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-soft hover:bg-surface-hover border border-line text-ink text-xs font-semibold transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>{dict.destinationNotFound.backToCatalog}</span>
          </Link>
        </GlassPanel>
      </div>
    );
  }

  const validId = destinationId as DestinationId;
  const dest = getDestinationById(validId);
  const countryTours = getToursByDestination(validId);
  const brandAssets = getBrandAssetsByDestination(validId);

  const dp = dict.destinationPage;

  const galleryItems = brandAssets.map((asset) => ({
    id: asset.id,
    src: asset.src,
    alt: asset.title,
    caption: asset.caption,
    type: (asset.category.startsWith("poster") ? "poster" : "photo") as "poster" | "photo",
  }));

  const whatsappInquiryUrl = buildWhatsAppBookingUrl({
    locale,
    destinationName: dest.name[locale],
    comment: dp.whatsappInquiryComment.replace("{name}", dest.name[locale]),
  });

  return (
    <div className="min-h-screen bg-canvas text-ink pt-28 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Back Link */}
        <div className="border-b border-line pb-4 flex items-center justify-between">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-sage-ink hover:text-ink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{dp.allDestinations}</span>
          </Link>

          <span className="font-mono text-xs text-muted">{dest.coordinates}</span>
        </div>

        {/* Hero Section of the Country */}
        <div className="photo-surface relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col justify-end p-6 sm:p-12 border border-line shadow-2xl">
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet={dest.media.heroImage.replace(/\.jpg$/, "-sm.webp")}
              type="image/webp"
            />
            <source
              srcSet={dest.media.heroImage.replace(/\.jpg$/, ".webp")}
              type="image/webp"
            />
            <img
              src={dest.media.heroImage}
              alt={dest.name[locale]}
              loading="eager"
              fetchPriority="high"
              decoding="sync"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="absolute inset-0 w-full h-full object-cover select-none"
              style={{ objectPosition: dest.media.objectPositionDesktop }}
            />
          </picture>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(9, 15, 18, 0.4) 0%, rgba(9, 15, 18, 0.72) 65%, rgba(9, 15, 18, 0.98) 100%)",
            }}
          />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <span className="editorial-kicker text-sage-ink">
              {dest.kicker[locale]}
            </span>
            <h1 className="headline-country font-bold text-ink tracking-tight">
              {dest.name[locale]}
            </h1>
            <p className="text-base sm:text-xl text-ink font-medium leading-snug">
              «{dest.tagline[locale]}»
            </p>
            <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
              {dest.atmosphereNote[locale]}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <GlassButton
                variant="primary"
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span>{dp.whatsappCta}</span>
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Unboxed Key Highlights */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-surface-soft border border-line text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-muted">{dp.highlightsLabel}</span>
            {dest.highlights[locale].map((hl, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span aria-hidden="true" className="text-muted">·</span>}
                <span className="font-medium text-ink">{hl}</span>
              </React.Fragment>
            ))}
          </div>

          <span className="font-mono text-xs text-muted">
            {dest.elevationOrRegion[locale]}
          </span>
        </div>

        {/* Available Tours in This Destination */}
        <section className="space-y-6 pt-4 border-t border-line">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                {dp.toursTitle.replace("{name}", dest.name[locale])}
              </h2>
              <p className="text-xs sm:text-sm text-muted">
                {validId === "china"
                  ? dp.toursSubtitleChina
                  : dp.toursSubtitleDefault}
              </p>
            </div>
            <span className="text-xs font-mono text-muted">
              {dp.availableCount.replace("{count}", String(countryTours.length))}
            </span>
          </div>

          <div data-reveal-group className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {countryTours.map((tour) => (
              <TourCard
                key={tour.id}
                tour={tour}
                dict={dict}
                locale={locale}
                directLink={true}
                isFavorite={favorites.includes(tour.id)}
                onToggleFavorite={onToggleFavorite}
                isCompared={comparedTours.includes(tour.id)}
                onToggleCompare={onToggleCompare}
                onBookTour={onBookTour}
              />
            ))}
          </div>
        </section>

        {/* Original Brand Posters & Photos Gallery */}
        {galleryItems.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-line">
            <MediaGallery
              items={galleryItems}
              locale={locale}
              title={dp.galleryTitle.replace("{name}", dest.name[locale])}
              subtitle={dp.gallerySubtitle}
            />
          </section>
        )}

        {/* Conversion & Consultation Panel */}
        <section className="pt-4 border-t border-line">
          <GlassPanel className="p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-display text-lg sm:text-xl font-bold text-ink">
                {dp.consultationTitle.replace("{name}", dest.name[locale])}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {dp.consultationText}
              </p>
            </div>
            <GlassButton
              variant="primary"
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>{dp.consultationBtn}</span>
            </GlassButton>
          </GlassPanel>
        </section>
      </div>
    </div>
  );
};
