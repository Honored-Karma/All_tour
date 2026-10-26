import React, { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { LocalizedText } from "../../data/destinations";
import type { Locale } from "../../lib/whatsapp";
import type { Dictionary } from "../../i18n/ru";
import { getDictionary } from "../../i18n";

export interface GalleryMediaItem {
  id?: string;
  src: string;
  alt: LocalizedText;
  caption?: LocalizedText;
  type?: "photo" | "poster";
  aspectRatio?: "1:1" | "3:4" | "16:9" | "9:16";
}

interface GalleryLightboxProps {
  items: GalleryMediaItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
  locale: Locale;
  dict?: Dictionary;
}

export const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  items,
  currentIndex,
  onClose,
  onNavigate,
  locale,
  dict,
}) => {
  const d = dict || getDictionary(locale);
  const lb = d.lightbox;
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < items.length;

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    onNavigate((currentIndex - 1 + items.length) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    onNavigate((currentIndex + 1) % items.length);
  }, [currentIndex, items.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  if (!isOpen || currentIndex === null) return null;

  const activeItem = items[currentIndex];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={lb.ariaTitle}
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6"
    >
      {/* Top Controls */}
      <div className="flex items-center justify-between text-xs font-mono text-white/80 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-[#0786c7] font-semibold tracking-wider uppercase">
            {activeItem.type === "poster" ? lb.posterBadge : lb.photoBadge}
          </span>
          <span aria-hidden="true" className="text-white/30">
            ·
          </span>
          <span className="tabular-nums">
            0{currentIndex + 1} / 0{items.length}
          </span>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label={lb.closeAria}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer text-xs font-sans"
        >
          <span>{lb.closeBtn}</span>
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
        {/* Prev / Next desktop buttons */}
        {items.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label={lb.prevAria}
              className="absolute left-2 sm:left-4 z-10 w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/90 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label={lb.nextAria}
              className="absolute right-2 sm:right-4 z-10 w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/90 border border-white/15 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        <img
          src={activeItem.src}
          alt={activeItem.alt[locale]}
          className="max-h-[75vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl transition-transform duration-300"
        />
      </div>

      {/* Caption & Thumbnail strip */}
      <div className="max-w-3xl mx-auto w-full text-center space-y-2 border-t border-white/10 pt-4">
        <p className="text-sm sm:text-base font-semibold text-white">
          {activeItem.alt[locale]}
        </p>
        {activeItem.caption && (
          <p className="text-xs sm:text-sm text-[#EDE6DA]/75 max-w-xl mx-auto leading-relaxed">
            {activeItem.caption[locale]}
          </p>
        )}
      </div>
    </div>
  );
};
