import React, { useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import {
  realReviews,
  storyScreenshots,
  type ReviewCategory,
  type StoryScreenshotAsset,
} from "../../data/reviews";
import type { Dictionary } from "../../i18n/ru";
import { buildWhatsAppBookingUrl, type Locale } from "../../lib/whatsapp";
import { ReviewCard } from "../reviews/ReviewCard";
import { GlassPanel } from "../glass/GlassPanel";
import { GlassButton } from "../glass/GlassButton";

import { useNavigate } from "react-router-dom";

interface ReviewsPageProps {
  dict: Dictionary;
  locale: Locale;
  onBackToHome?: () => void;
  onOpenStory: (story: StoryScreenshotAsset) => void;
  onNavigateToBooking?: () => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({
  dict,
  locale,
  onBackToHome,
  onOpenStory,
  onNavigateToBooking,
}) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBackToHome) {
      onBackToHome();
    } else {
      navigate("/");
    }
  };
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | ReviewCategory
  >("all");

  const filteredReviews =
    selectedCategory === "all"
      ? realReviews
      : realReviews.filter((r) => r.category === selectedCategory);

  const filterButtons: Array<{ id: "all" | ReviewCategory; label: string }> = [
    { id: "all", label: dict.reviews.filters.all },
    { id: "kyrgyzstan", label: dict.reviews.filters.kyrgyzstan },
    { id: "china", label: dict.reviews.filters.china },
    {
      id: "uzbekistan_family",
      label: dict.reviews.filters.uzbekistan_family,
    },
  ];

  const whatsappUrl = buildWhatsAppBookingUrl({ locale });

  return (
    <div
      data-testid="reviews-dedicated-page"
      className="min-h-screen bg-[#0d1518] text-[#EDE6DA]"
    >
      {/* Hero Banner of the Dedicated Reviews Page */}
      <section className="relative isolate pt-32 pb-20 px-4 sm:px-8 overflow-hidden border-b border-white/10">
        <div
          style={{
            background:
              "radial-gradient(circle at 65% 30%, #2a637c 0%, #163E54 48%, #0d1518 100%)",
          }}
          className="absolute inset-0 -z-20"
        >
          <img
            src="/media/editorial-travel.jpg"
            alt="Mountain Panorama"
            className="w-full h-full object-cover opacity-45"
          />
        </div>
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(13, 21, 24, 0.72) 0%, rgba(13, 21, 24, 0.65) 55%, rgba(13, 21, 24, 1) 100%)",
          }}
        />

        <div className="max-w-7xl mx-auto space-y-8">
          <button
            type="button"
            data-testid="reviews-back-home-btn"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#6BAFB3] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{dict.reviews.backToHome}</span>
          </button>

          <div className="max-w-3xl space-y-4">
            <p className="editorial-kicker text-[#6BAFB3]">
              {dict.reviews.pageKicker}
            </p>
            <h1 className="headline-section font-bold text-white">
              {dict.reviews.pageTitle}
            </h1>
            <p className="text-base sm:text-lg text-[#EDE6DA]/85 leading-relaxed">
              {dict.reviews.pageSubtitle}
            </p>
          </div>

          {/* Unboxed Team & Guides Attribution Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#EDE6DA]/75 border-t border-white/15 pt-5">
            <span className="text-white font-medium">
              {dict.reviews.guidesLabel}
            </span>
            <span>{dict.reviews.guidesList}</span>
          </div>
        </div>
      </section>

      {/* Original Story Screenshots Showcase */}
      <section className="py-16 px-4 sm:px-8 bg-[#101a1e] border-b border-white/10">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              {dict.reviews.storiesStripTitle}
            </h2>
            <p className="text-sm text-[#EDE6DA]/70">
              {dict.reviews.storiesStripSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {storyScreenshots.map((story, idx) => (
              <button
                key={story.id}
                type="button"
                onClick={() => onOpenStory(story)}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/20 bg-black/50 text-left cursor-pointer shadow-xl focus-visible:outline-2 focus-visible:outline-[#6BAFB3]"
              >
                <img
                  src={story.image}
                  alt={story.title[locale]}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(9, 15, 18, 0.78) 0%, rgba(9, 15, 18, 0.15) 26%, transparent 45%, rgba(9, 15, 18, 0.95) 100%)",
                  }}
                />
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/95">
                  <span>0{idx + 1} / 05</span>
                  <span className="text-[#6BAFB3]">{locale === "kz" ? "АШУ ↗" : "ОТКРЫТЬ ↗"}</span>
                </div>
                <div className="absolute bottom-3.5 left-3.5 right-3.5 space-y-1">
                  <div className="text-xs sm:text-sm font-semibold text-white leading-snug">
                    {story.title[locale]}
                  </div>
                  <div className="text-[11px] text-[#EDE6DA]/75">
                    {story.guides[locale]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Filterable Wall of All 16 Real Customer Reviews */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Interactive Category Filter Control */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div
              role="group"
              aria-label="Filter reviews by category"
              className="liquid-glass-subtle p-1.5 rounded-2xl inline-flex flex-wrap items-center gap-1 self-start"
            >
              {filterButtons.map((btn) => {
                const active = selectedCategory === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    data-testid={`reviews-filter-${btn.id}`}
                    aria-pressed={active}
                    onClick={() => setSelectedCategory(btn.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? "bg-[#EDE6DA] text-[#111d22] font-semibold shadow-sm"
                        : "text-[#EDE6DA]/75 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {btn.label}
                  </button>
                );
              })}
            </div>

            <span className="text-xs font-mono text-[#EDE6DA]/60 tabular-nums">
              {filteredReviews.length} / {realReviews.length}
            </span>
          </div>

          {/* Reviews Grid */}
          <div
            data-testid="reviews-page-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                dict={dict}
                locale={locale}
                onOpenStory={onOpenStory}
              />
            ))}
          </div>

          {/* Bottom Conversion Panel */}
          <div className="pt-10">
            <GlassPanel className="p-8 sm:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="space-y-2 max-w-2xl">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                  {dict.reviews.ctaTitle}
                </h3>
                <p className="text-sm sm:text-base text-[#EDE6DA]/80 leading-relaxed">
                  {dict.reviews.ctaSubtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <GlassButton
                  variant="secondary"
                  onClick={onNavigateToBooking}
                >
                  <span>{dict.nav.cta}</span>
                </GlassButton>
                <GlassButton
                  variant="primary"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{dict.reviews.ctaButton}</span>
                </GlassButton>
              </div>
            </GlassPanel>
          </div>
        </div>
      </section>
    </div>
  );
};
