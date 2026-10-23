import React, { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  storyScreenshots,
  realReviews,
  type StoryScreenshotAsset,
} from "../../data/reviews";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";

interface StoryLightboxModalProps {
  activeStory: StoryScreenshotAsset | null;
  onClose: () => void;
  onSelectStory: (story: StoryScreenshotAsset) => void;
  dict: Dictionary;
  locale: Locale;
}

export const StoryLightboxModal: React.FC<StoryLightboxModalProps> = ({
  activeStory,
  onClose,
  onSelectStory,
  dict,
  locale,
}) => {
  useEffect(() => {
    if (!activeStory) return;
    const currentIndex = storyScreenshots.findIndex(
      (s) => s.id === activeStory.id
    );

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        const nextIndex = (currentIndex + 1) % storyScreenshots.length;
        onSelectStory(storyScreenshots[nextIndex]);
      } else if (e.key === "ArrowLeft") {
        const prevIndex =
          (currentIndex - 1 + storyScreenshots.length) %
          storyScreenshots.length;
        onSelectStory(storyScreenshots[prevIndex]);
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeStory, onClose, onSelectStory]);

  if (!activeStory) return null;

  const currentIndex = storyScreenshots.findIndex(
    (s) => s.id === activeStory.id
  );
  const matchingReviews = realReviews.filter(
    (r) => r.storyScreenshot === activeStory.image
  );

  const handlePrev = () => {
    const prevIndex =
      (currentIndex - 1 + storyScreenshots.length) % storyScreenshots.length;
    onSelectStory(storyScreenshots[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % storyScreenshots.length;
    onSelectStory(storyScreenshots[nextIndex]);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={activeStory.title[locale]}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-lg"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="liquid-glass-modal relative w-full max-w-5xl max-h-[92dvh] rounded-3xl overflow-hidden flex flex-col text-[#EDE6DA]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/15 bg-black/30 shrink-0">
          <div className="flex items-center gap-3 text-xs text-white/80 truncate pr-4">
            <span className="font-mono tabular-nums text-[#6BAFB3]">
              0{currentIndex + 1} / 0{storyScreenshots.length}
            </span>
            <span aria-hidden="true">·</span>
            <span className="uppercase tracking-wider font-medium truncate">
              {activeStory.title[locale]}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label={dict.reviews.storyPrev}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label={dict.reviews.storyNext}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label={dict.reviews.storyModalClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body: Left Original 9:16 Story Screenshot, Right Transcribed Messages */}
        <div className="overflow-y-auto p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-[340px] aspect-[9/16] rounded-2xl overflow-hidden border border-white/20 bg-black/50 shadow-2xl">
              <img
                src={activeStory.image}
                alt={activeStory.title[locale]}
                className="w-full h-full object-contain bg-black"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2 border-b border-white/12 pb-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#6BAFB3]">
                <span>{activeStory.subtitle[locale]}</span>
                <span aria-hidden="true">·</span>
                <span>{activeStory.guides[locale]}</span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                {activeStory.title[locale]}
              </h3>
            </div>

            <div className="space-y-4">
              {matchingReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/12 space-y-2.5"
                >
                  <p className="text-sm sm:text-base text-white/95 leading-relaxed">
                    «{rev.quote}»
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#EDE6DA]/60 pt-1">
                    <span className="font-semibold text-[#EDE6DA]">
                      {rev.author}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{rev.guideName[locale]}</span>
                    <span aria-hidden="true">·</span>
                    <span>{rev.handleOrSource[locale]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
