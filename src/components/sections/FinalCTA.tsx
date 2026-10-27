import React, { useState } from "react";
import { MapPin, Sunset } from "lucide-react";
import type { Dictionary } from "../../i18n/ru";
import { destinations } from "../../data/destinations";
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
    <section id="sunset" className="sunset-story" aria-labelledby="sunset-title">
      <div className="sunset-landscape" aria-hidden="true">
        {!imgFailed && (
          <picture>
            <source srcSet="/media/final-cta.webp" type="image/webp" />
            <img
              src="/media/final-cta.jpg"
              alt=""
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImgFailed(true)}
              className="sunset-image"
            />
          </picture>
        )}
      </div>

      <div className="sunset-content">
        <div data-reveal className="sunset-invitation">
          <p className="editorial-kicker sunset-kicker"><Sunset size={20} strokeWidth={1.5} aria-hidden="true" />{dict.finalCta.kicker}</p>
          <h2 id="sunset-title">{dict.finalCta.title}</h2>
          <p className="sunset-subtitle">{dict.finalCta.subtitle}</p>
          <div className="sunset-action">
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
        <div data-reveal data-reveal-delay="140" className="sunset-route">
          <div className="sunset-origin"><MapPin size={16} strokeWidth={1.5} aria-hidden="true" /><span>{dict.homeAtmosphere.departure}</span></div>
          <div className="sunset-route-stops">
            {destinations.map((destination) => <span key={destination.id}>{destination.name[locale]}</span>)}
          </div>
          <p>{dict.homeAtmosphere.routeNote}</p>
        </div>
        <p data-reveal className="sunset-margin-note"><span aria-hidden="true" />{dict.homeAtmosphere.sunsetNote}</p>
      </div>
    </section>
  );
};
