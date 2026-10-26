import React, { useState } from "react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { destinations } from "../../data/destinations";
import type { Dictionary } from "../../i18n/ru";
import { buildWhatsAppBookingUrl, type Locale } from "../../lib/whatsapp";
import { GlassButton } from "../glass/GlassButton";

interface HeroProps {
  dict: Dictionary;
  locale: Locale;
  reducedMotion: boolean;
  onExploreClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  dict,
  locale,
  reducedMotion,
  onExploreClick,
}) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const kyrgyzstan = destinations[0];
  const whatsappUrl = buildWhatsAppBookingUrl({ locale });

  return (
    <section
      id="hero"
      className="relative isolate w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden pt-28 pb-10 px-4 sm:px-8"
    >
      {/* Living Kyrgyzstan Hero Background */}
      <div
        style={{ background: kyrgyzstan.media.fallbackGradient }}
        className={`absolute inset-0 -z-20 overflow-hidden ${
          reducedMotion ? "" : "animate-ken-burns"
        }`}
      >
        {!heroImgFailed && (
          <img
            src={kyrgyzstan.media.heroImage}
            alt={kyrgyzstan.name[locale]}
            referrerPolicy="no-referrer"
            onError={() => setHeroImgFailed(true)}
            style={{ objectPosition: kyrgyzstan.media.objectPositionDesktop }}
            className="w-full h-full object-cover select-none"
          />
        )}
      </div>

      {/* Measured Atmospheric & Readability Scrims */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(9, 17, 22, 0.52) 0%, rgba(12, 24, 31, 0.22) 42%, rgba(9, 17, 22, 0.76) 86%, rgba(13, 21, 24, 0.98) 100%)",
        }}
      />
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 60%, rgba(13, 25, 32, 0.48) 0%, transparent 65%)",
        }}
      />

      {/* Top Spacer */}
      <div className="max-w-7xl w-full mx-auto" />

      {/* Center Editorial Statement */}
      <div className="max-w-7xl w-full mx-auto my-auto py-12">
        <div className="max-w-4xl space-y-6">
          <p className="editorial-kicker text-[#6BAFB3] tracking-[0.18em]">
            {dict.hero.departureBadge}
          </p>

          <h1 className="headline-hero font-bold text-white">
            {dict.hero.title}
          </h1>

          <p className="text-base sm:text-xl text-[#EDE6DA]/90 max-w-2xl leading-relaxed font-normal">
            {dict.hero.subtitle}
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3.5">
            <GlassButton
              variant="primary"
              magnetic={!reducedMotion}
              onClick={onExploreClick}
            >
              <span>{dict.hero.exploreCta}</span>
            </GlassButton>

            <GlassButton
              variant="secondary"
              magnetic={!reducedMotion}
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>{dict.hero.whatsappCta}</span>
            </GlassButton>
          </div>
        </div>
      </div>

      {/* Bottom Scroll to Explore & Concept Signature */}
      <div className="max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-t border-white/15 pt-5">
        <button
          type="button"
          onClick={onExploreClick}
          className="group inline-flex items-center gap-3 text-xs font-mono tracking-[0.2em] uppercase text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <span>{dict.hero.scrollHint}</span>
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-full border border-white/25 bg-white/10 ${
              reducedMotion ? "" : "animate-scroll-indicator"
            }`}
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </span>
        </button>

        <div className="flex items-center gap-3 text-xs text-white/65 font-mono">
          <span>01 {destinations[0]?.name[locale].toUpperCase()}</span>
          <span aria-hidden="true">·</span>
          <span>02 {destinations[1]?.name[locale].toUpperCase()}</span>
          <span aria-hidden="true">·</span>
          <span>03 {destinations[2]?.name[locale].toUpperCase()}</span>
        </div>
      </div>
    </section>
  );
};
