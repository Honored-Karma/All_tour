import React, { useState } from "react";
import type { Dictionary } from "../../i18n/ru";
import { buildWhatsAppBookingUrl, type Locale } from "../../lib/whatsapp";
import { GlassButton } from "../glass/GlassButton";

interface FinalCTAProps {
  dict: Dictionary;
  locale: Locale;
  reducedMotion: boolean;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({
  dict,
  locale,
  reducedMotion,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const whatsappUrl = buildWhatsAppBookingUrl({ locale });

  return (
    <section className="relative isolate py-28 sm:py-36 px-4 sm:px-8 overflow-hidden border-t border-white/10">
      {/* Wide Immersive Landscape Backdrop */}
      <div
        style={{
          background:
            "radial-gradient(circle at 60% 40%, #1c4c63 0%, #13252e 55%, #090f12 100%)",
        }}
        className="absolute inset-0 -z-20"
      >
        {!imgFailed && (
          <picture>
            <source srcSet="/media/final-cta.webp" type="image/webp" />
            <img
              src="/media/final-cta.jpg"
              alt="Mountain Lake Panorama"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="w-full h-full object-cover"
            />
          </picture>
        )}
      </div>

      {/* Readability Scrim */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(13, 21, 24, 0.85) 0%, rgba(13, 21, 24, 0.58) 50%, rgba(9, 15, 18, 0.95) 100%)",
        }}
      />

      <div className="max-w-5xl mx-auto text-center space-y-6">
        <p className="editorial-kicker text-[#6BAFB3]">{dict.finalCta.kicker}</p>
        <h2 className="headline-section font-bold text-white max-w-3xl mx-auto">
          {dict.finalCta.title}
        </h2>
        <p className="text-base sm:text-xl text-[#EDE6DA]/85 max-w-xl mx-auto leading-relaxed">
          «{dict.finalCta.subtitle}»
        </p>
        <div className="pt-4">
          <GlassButton
            variant="primary"
            magnetic={!reducedMotion}
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>{dict.finalCta.button}</span>
          </GlassButton>
        </div>
      </div>
    </section>
  );
};
