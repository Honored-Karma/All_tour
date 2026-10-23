import React from "react";
import { ArrowUpRight } from "lucide-react";
import {
  storyScreenshots,
  type RealReview,
  type StoryScreenshotAsset,
} from "../../data/reviews";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { GlassPanel } from "../glass/GlassPanel";

interface ReviewCardProps {
  review: RealReview;
  dict: Dictionary;
  locale: Locale;
  onOpenStory: (story: StoryScreenshotAsset) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  dict,
  locale,
  onOpenStory,
}) => {
  const matchingStory =
    storyScreenshots.find((s) => s.image === review.storyScreenshot) ||
    storyScreenshots[0];

  return (
    <GlassPanel
      data-testid={`review-card-${review.id}`}
      className="p-6 sm:p-7 flex flex-col justify-between gap-6"
    >
      <div className="space-y-4">
        {/* Unboxed editorial metadata line (Zero-Pill discipline) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6BAFB3]">
          <span className="uppercase tracking-wider font-medium">
            {review.tourBadge[locale]}
          </span>
          <span aria-hidden="true" className="text-white/35">
            ·
          </span>
          <span className="text-[#EDE6DA]/75">{review.guideName[locale]}</span>
          {review.dateNote && (
            <>
              <span aria-hidden="true" className="text-white/35">
                ·
              </span>
              <span className="font-mono tabular-nums text-[#EDE6DA]/60">
                {review.dateNote}
              </span>
            </>
          )}
        </div>

        {/* Authentic review quote */}
        <blockquote className="text-sm sm:text-base text-white/95 leading-relaxed font-normal">
          «{review.quote}»
        </blockquote>
      </div>

      {/* Footer: Author attribution + link to original story screenshot */}
      <div className="pt-4 border-t border-white/12 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-white truncate">
            {review.author}
          </div>
          <div className="text-xs text-[#EDE6DA]/55 truncate">
            {review.handleOrSource[locale]}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenStory(matchingStory)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/8 hover:bg-white/15 border border-white/15 text-xs text-[#EDE6DA]/90 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <img
            src={review.storyScreenshot}
            alt=""
            loading="lazy"
            className="w-5 h-7 rounded object-cover border border-white/20"
          />
          <span>{dict.reviews.viewOriginalScreenshot}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-75" />
        </button>
      </div>
    </GlassPanel>
  );
};
