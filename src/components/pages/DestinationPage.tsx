import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MessageCircle, Check, ArrowRight } from "lucide-react";
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
  onBookTour: (tour: Tour) => void;
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
  const validId = (destinationId && ["kyrgyzstan", "georgia", "china"].includes(destinationId))
    ? (destinationId as DestinationId)
    : "kyrgyzstan";

  const dest = getDestinationById(validId);
  const countryTours = getToursByDestination(validId);
  const brandAssets = getBrandAssetsByDestination(validId);

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
    comment: `Интересует направление: ${dest.name[locale]} с выездом из Алматы`,
  });

  return (
    <div className="min-h-screen bg-[#0d1518] text-[#EDE6DA] pt-28 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Back Link */}
        <div className="border-b border-white/10 pb-4 flex items-center justify-between">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#0786c7] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Каталог всех направлений</span>
          </Link>

          <span className="font-mono text-xs text-white/50">{dest.coordinates}</span>
        </div>

        {/* Hero Section of the Country */}
        <div className="relative rounded-3xl overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col justify-end p-6 sm:p-12 border border-white/15 shadow-2xl">
          <img
            src={dest.media.heroImage}
            alt={dest.name[locale]}
            className="absolute inset-0 w-full h-full object-cover select-none"
            style={{ objectPosition: dest.media.objectPositionDesktop }}
          />

          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(9, 15, 18, 0.4) 0%, rgba(9, 15, 18, 0.72) 65%, rgba(9, 15, 18, 0.98) 100%)",
            }}
          />

          <div className="relative z-10 space-y-4 max-w-3xl">
            <span className="editorial-kicker text-[#6BAFB3]">
              {dest.kicker[locale]}
            </span>
            <h1 className="headline-country font-bold text-white tracking-tight">
              {dest.name[locale]}
            </h1>
            <p className="text-base sm:text-xl text-white font-medium leading-snug">
              «{dest.tagline[locale]}»
            </p>
            <p className="text-xs sm:text-sm text-[#EDE6DA]/85 max-w-2xl leading-relaxed">
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
                <span>Уточнить даты в WhatsApp ↗</span>
              </GlassButton>
            </div>
          </div>
        </div>

        {/* Unboxed Key Highlights */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/60">Ключевые локации:</span>
            {dest.highlights[locale].map((hl, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span aria-hidden="true" className="text-white/30">·</span>}
                <span className="font-medium text-white">{hl}</span>
              </React.Fragment>
            ))}
          </div>

          <span className="font-mono text-xs text-[#EDE6DA]/60">
            {dest.elevationOrRegion[locale]}
          </span>
        </div>

        {/* Available Tours in This Destination */}
        <section className="space-y-6 pt-4 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
                Маршруты и программы по направлению {dest.name[locale]}
              </h2>
              <p className="text-xs sm:text-sm text-[#EDE6DA]/70">
                {validId === "china"
                  ? "Два отдельных предложения: 6-дневный тур в Урумчи и 3-дневный контент-тур в Китай (не смешиваются)."
                  : "Все выезды стартуют из Алматы с сопровождением гидов."}
              </p>
            </div>
            <span className="text-xs font-mono text-[#EDE6DA]/60">
              {countryTours.length} доступно
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
          <section className="space-y-4 pt-6 border-t border-white/10">
            <MediaGallery
              items={galleryItems}
              locale={locale}
              title={`Оригинальные материалы и афиши: ${dest.name[locale]}`}
              subtitle="Подлинные рекламные постеры, программы и условия из архива ALL TOUR."
            />
          </section>
        )}

        {/* Conversion & Consultation Panel */}
        <section className="pt-4 border-t border-white/10">
          <GlassPanel className="p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-display text-lg sm:text-xl font-bold text-white">
                Планируете поездку в {dest.name[locale]}?
              </h3>
              <p className="text-sm text-[#EDE6DA]/75 leading-relaxed">
                Напишите нам в WhatsApp — мы расскажем о ближайших датах сбора групп, необходимых документах и актуальной стоимости.
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
              <span>Консультация в WhatsApp ↗</span>
            </GlassButton>
          </GlassPanel>
        </section>
      </div>
    </div>
  );
};
