import React from "react";
import { ArrowRight } from "lucide-react";
import {
  realReviews,
  storyScreenshots,
  type StoryScreenshotAsset,
} from "../../data/reviews";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { ReviewCard } from "../reviews/ReviewCard";
import { GlassButton } from "../glass/GlassButton";

interface ReviewsShowcaseProps {
  dict: Dictionary;
  locale: Locale;
  onOpenReviewsPage: () => void;
  onOpenStory: (story: StoryScreenshotAsset) => void;
}

export const ReviewsShowcase: React.FC<ReviewsShowcaseProps> = ({
  dict,
  locale,
  onOpenReviewsPage,
  onOpenStory,
}) => {
  const featuredReviews = realReviews.filter((r) => r.featuredOnHome);

  return (
    <section
      id="reviews"
      className="py-24 sm:py-32 px-4 sm:px-8 bg-[#0d1518] border-t border-white/10"
    >
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Section Header + Link to Full Dedicated Page */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/10 pb-8">
          <div className="space-y-3 max-w-2xl">
            <p className="editorial-kicker text-[#6BAFB3]">
              {dict.reviews.kicker}
            </p>
            <h2 className="headline-section font-bold text-white">
              {dict.reviews.title}
            </h2>
            <p className="text-base text-[#EDE6DA]/75 leading-relaxed">
              {dict.reviews.subtitle}
            </p>
          </div>

          <div className="self-start lg:self-end">
            <GlassButton
              variant="primary"
              data-testid="open-reviews-page-btn"
              onClick={onOpenReviewsPage}
            >
              <span>{dict.reviews.openFullPageCta}</span>
              <ArrowRight className="w-4 h-4" />
            </GlassButton>
          </div>
        </div>

        {/* Featured 6 Real Reviews Grid */}
        <div
          data-testid="home-reviews-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              dict={dict}
              locale={locale}
              onOpenStory={onOpenStory}
            />
          ))}
        </div>

        {/* Original Uploaded Story Screenshots Strip (5 vertical cards) */}
        <div className="pt-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <h3 className="font-display text-lg sm:text-xl font-semibold text-white">
                {dict.reviews.storiesStripTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#EDE6DA]/65">
                {dict.reviews.storiesStripSubtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenReviewsPage}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#6BAFB3] hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{dict.reviews.openFullPageCta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {storyScreenshots.map((story, idx) => (
              <button
                key={story.id}
                type="button"
                data-testid={`story-card-${story.id}`}
                onClick={() => onOpenStory(story)}
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/18 bg-black/40 text-left cursor-pointer focus-visible:outline-2 focus-visible:outline-[#6BAFB3]"
              >
                <img
                  src={story.image}
                  alt={story.title[locale]}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(9, 15, 18, 0.78) 0%, rgba(9, 15, 18, 0.15) 26%, transparent 45%, rgba(9, 15, 18, 0.94) 100%)",
                  }}
                />
                <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between px-2.5 py-1 rounded-lg bg-black/55 backdrop-blur-md border border-white/10 text-[11px] font-mono text-white/95">
                  <span>0{idx + 1}</span>
                  <span className="uppercase tracking-wider text-[#6BAFB3]">
                    STORY ↗
                  </span>
                </div>
                <div className="absolute bottom-3.5 left-3.5 right-3.5 space-y-1">
                  <div className="text-xs font-semibold text-white leading-snug">
                    {story.title[locale]}
                  </div>
                  <div className="text-[11px] text-[#EDE6DA]/70 leading-tight">
                    {story.guides[locale]}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
