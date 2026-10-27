import React, { useState } from "react";
import { ZoomIn, Image as ImageIcon } from "lucide-react";
import type { Locale } from "../../lib/whatsapp";
import type { Dictionary } from "../../i18n/ru";
import { getDictionary } from "../../i18n";
import { GalleryLightbox, type GalleryMediaItem } from "./GalleryLightbox";

interface MediaGalleryProps {
  items: GalleryMediaItem[];
  locale: Locale;
  title?: string;
  subtitle?: string;
  layout?: "grid" | "strip";
  className?: string;
  dict?: Dictionary;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({
  items,
  locale,
  title,
  subtitle,
  layout = "grid",
  className = "",
  dict,
}) => {
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const d = dict || getDictionary(locale);

  if (items.length === 0) return null;

  return (
    <div className={`space-y-6 ${className}`}>
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && (
            <h3 className="font-display text-lg sm:text-xl font-bold text-white">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-xs sm:text-sm text-[#EDE6DA]/70 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div
        className={
          layout === "strip"
            ? "flex items-stretch gap-4 overflow-x-auto pb-3 snap-x no-scrollbar"
            : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        }
      >
        {items.map((item, idx) => {
          const isPoster = item.type === "poster";
          return (
            <button
              key={item.id || item.src + idx}
              type="button"
              onClick={() => setActiveLightboxIndex(idx)}
              className={`group relative rounded-2xl overflow-hidden border border-white/15 bg-black/40 text-left transition-all duration-300 hover:border-white/40 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-[#0786c7] cursor-pointer ${
                layout === "strip"
                  ? "w-48 sm:w-56 shrink-0 aspect-[3/4] snap-start"
                  : isPoster
                  ? "aspect-[3/4]"
                  : "aspect-[4/3]"
              }`}
            >
              {!failedImages[item.src] ? (
                <picture>
                  {item.src.startsWith("/media/") && (
                    <source srcSet={item.src.replace(/\.jpg$/, ".webp")} type="image/webp" />
                  )}
                  {item.src === "/assets/brand/group-china-tour.png" && (
                    <source srcSet="/assets/brand/group-china-tour.webp" type="image/webp" />
                  )}
                  <img
                    src={item.src}
                    alt={item.alt[locale]}
                    loading="lazy"
                    decoding="async"
                    onError={() =>
                      setFailedImages((prev) => ({ ...prev, [item.src]: true }))
                    }
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </picture>
              ) : (
                <div className="w-full h-full bg-[#111c21] flex flex-col items-center justify-center p-4 text-center text-[#EDE6DA]/50 select-none">
                  <ImageIcon className="w-6 h-6 mb-1 opacity-40" aria-hidden="true" />
                  <span className="text-[11px] line-clamp-2">{item.alt[locale]}</span>
                </div>
              )}

              {/* Gradient scrim */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(9, 15, 18, 0.75) 0%, transparent 40%, rgba(9, 15, 18, 0.92) 100%)",
                }}
              />

              {/* Top tag badge */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-white/90">
                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[10px]">
                  0{idx + 1}
                </span>
                {isPoster ? (
                  <span className="px-2 py-0.5 rounded-md bg-[#0786c7]/80 text-white text-[10px] uppercase font-sans tracking-wide">
                    {d.lightbox.posterTag}
                  </span>
                ) : (
                  <span className="p-1 rounded-md bg-black/60 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Bottom label */}
              <div className="absolute bottom-3 left-3 right-3 space-y-0.5">
                <div className="text-xs font-semibold text-white leading-snug line-clamp-2">
                  {item.alt[locale]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <GalleryLightbox
        items={items}
        currentIndex={activeLightboxIndex}
        onClose={() => setActiveLightboxIndex(null)}
        onNavigate={(idx) => setActiveLightboxIndex(idx)}
        locale={locale}
        dict={d}
      />
    </div>
  );
};
