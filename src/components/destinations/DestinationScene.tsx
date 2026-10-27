import React, { useState } from "react";
import type { Destination } from "../../data/destinations";
import type { Locale } from "../../lib/whatsapp";

interface DestinationSceneProps {
  destination: Destination;
  progress: number; // 0 to 1 local camera progress
  weight: number; // 0 to 1 opacity/visibility blend weight
  active: boolean;
  reducedMotion: boolean;
  locale?: Locale;
}

export const DestinationScene: React.FC<DestinationSceneProps> = ({
  destination,
  progress,
  weight,
  active,
  reducedMotion,
  locale = "ru",
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const { media, palette } = destination;

  // Layer 2 — Depth and parallax (scale 1.03 -> 1.10 + subtle horizontal drift)
  const scale = reducedMotion ? 1.02 : 1.03 + progress * 0.07;
  const shiftX = reducedMotion ? 0 : (progress - 0.5) * -18;
  const shiftY = reducedMotion ? 0 : (progress - 0.5) * -10;

  return (
    <div
      aria-hidden={!active}
      data-testid={`destination-scene-${destination.id}`}
      data-active={active ? "true" : "false"}
      style={{
        opacity: weight,
        pointerEvents: weight > 0.45 ? "auto" : "none",
        zIndex: active ? 2 : 1,
      }}
      className="absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-300 ease-out"
    >
      {/* Layer 1 & 2 — Cinematic full-viewport background with controlled depth & parallax */}
      <div
        style={{
          background: media.fallbackGradient,
          transform: `scale(${scale.toFixed(4)}) translate3d(${shiftX.toFixed(1)}px, ${shiftY.toFixed(1)}px, 0)`,
        }}
        className="absolute inset-0 w-full h-full will-change-transform"
      >
        {media.backgroundVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={media.poster || media.heroImage}
            className="w-full h-full object-cover"
          >
            <source src={media.backgroundVideo} type="video/mp4" />
          </video>
        ) : !imageFailed ? (
          <picture>
            <source
              media="(max-width: 640px)"
              srcSet={media.heroImage.replace(/\.jpg$/, "-sm.webp")}
              type="image/webp"
            />
            <source
              srcSet={media.heroImage.replace(/\.jpg$/, ".webp")}
              type="image/webp"
            />
            <img
              src={media.heroImage}
              alt={destination.name[locale]}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImageFailed(true)}
              style={{
                objectPosition: media.objectPositionDesktop,
              }}
              className="w-full h-full object-cover select-none"
            />
          </picture>
        ) : null}
      </div>

      {/* Layer 3 — Atmospheric lighting & color temperature grading */}
      <div
        style={{
          background: `radial-gradient(circle at 72% 28%, ${palette.glowColor} 0%, transparent 58%)`,
        }}
        className="absolute inset-0 pointer-events-none mix-blend-screen"
      />

      {/* Layer 4 — Readability system: measured contrast scrims for crystal-clear typography */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(10, 17, 21, 0.58) 0%, rgba(10, 17, 21, 0.24) 40%, rgba(10, 17, 21, 0.78) 88%, rgba(13, 21, 24, 0.96) 100%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(10, 17, 21, 0.68) 0%, rgba(10, 17, 21, 0.25) 55%, rgba(10, 17, 21, 0.45) 100%)",
        }}
      />
    </div>
  );
};
