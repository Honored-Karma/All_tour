import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { destinations, type DestinationId } from "../../data/destinations";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import {
  computeJourneyState,
  getTargetProgressForDestination,
  type SceneInterpolationState,
} from "../../lib/journeyMath";
import { DestinationScene } from "../destinations/DestinationScene";
import { DestinationExplorer } from "../destinations/DestinationExplorer";
import { ScrollProgress } from "../destinations/ScrollProgress";
import { GlassPanel } from "../glass/GlassPanel";
import { GlassButton } from "../glass/GlassButton";

gsap.registerPlugin(ScrollTrigger);

interface JourneyProps {
  dict: Dictionary;
  locale: Locale;
  reducedMotion: boolean;
  activeDestinationId: DestinationId;
  onActiveDestinationChange: (id: DestinationId) => void;
  onExploreCountryTours: (id: DestinationId) => void;
}

export const Journey: React.FC<JourneyProps> = ({
  dict,
  locale,
  reducedMotion,
  activeDestinationId,
  onActiveDestinationChange,
  onExploreCountryTours,
}) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [journeyState, setJourneyState] = useState<SceneInterpolationState>(() =>
    computeJourneyState(getTargetProgressForDestination(activeDestinationId))
  );

  // Sync external selection when reducedMotion or direct click happens
  const handleSelectDestination = useCallback(
    (targetId: DestinationId) => {
      const targetProgress = getTargetProgressForDestination(targetId);
      const nextState = computeJourneyState(targetProgress);
      setJourneyState(nextState);
      onActiveDestinationChange(targetId);

      // If ScrollTrigger is active and not in reduced motion, smoothly scroll to the corresponding scroll position
      if (triggerRef.current && !reducedMotion) {
        const st = triggerRef.current;
        const targetScrollY = st.start + (st.end - st.start) * targetProgress;
        window.scrollTo({
          top: targetScrollY,
          behavior: "smooth",
        });
      }
    },
    [onActiveDestinationChange, reducedMotion]
  );

  useEffect(() => {
    // Also keep journeyState aligned if parent changed activeDestinationId externally (e.g. footer/mobile menu)
    setJourneyState((prev) => {
      if (prev.activeDestinationId === activeDestinationId) return prev;
      return computeJourneyState(
        getTargetProgressForDestination(activeDestinationId)
      );
    });
  }, [activeDestinationId]);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.4,
        onUpdate: (self) => {
          const state = computeJourneyState(self.progress);
          setJourneyState(state);
          onActiveDestinationChange(state.activeDestinationId);
        },
      });
      triggerRef.current = st;
    }, sectionRef);

    return () => {
      triggerRef.current = null;
      ctx.revert();
    };
  }, [reducedMotion, onActiveDestinationChange]);

  const currentDest =
    destinations.find((d) => d.id === journeyState.activeDestinationId) ||
    destinations[0];

  return (
    <section
      id="journey"
      ref={sectionRef}
      aria-label="Interactive Journey Across Three Countries"
      className={`relative w-full ${
        reducedMotion ? "min-h-[100dvh]" : "h-[310dvh]"
      }`}
    >
      {/* Sticky Full-Viewport Cinematic Stage */}
      <div className="sticky top-0 w-full h-[100dvh] overflow-hidden flex flex-col justify-between pt-24 pb-8 px-4 sm:px-8">
        {/* Three Living Destination Background Worlds */}
        {destinations.map((dest) => (
          <DestinationScene
            key={dest.id}
            destination={dest}
            progress={journeyState.sceneLocalProgress[dest.id]}
            weight={journeyState.sceneWeights[dest.id]}
            active={journeyState.activeDestinationId === dest.id}
            reducedMotion={reducedMotion}
          />
        ))}

        {/* Top Bar inside Stage: Editorial Departure Label + Progress Indicator */}
        <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs tracking-[0.18em] uppercase text-white/85 font-medium">
            <span>{dict.journey.departureLabel}</span>
            <span aria-hidden="true" className="text-white/40">
              ·
            </span>
            <span className="font-mono text-white/65">
              {currentDest.coordinates}
            </span>
          </div>

          <ScrollProgress
            activeDestinationId={journeyState.activeDestinationId}
            overallProgress={journeyState.overallProgress}
            onSelectDestination={handleSelectDestination}
            locale={locale}
          />
        </div>

        {/* Center / Main Country Narrative */}
        <div className="relative z-10 max-w-7xl w-full mx-auto my-auto py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-4 sm:space-y-5">
              <p
                data-testid="journey-active-kicker"
                className="editorial-kicker text-[#EDE6DA]/85"
              >
                {currentDest.kicker[locale]}
              </p>

              <h2
                data-testid="journey-active-title"
                className="headline-country font-bold text-white transition-all duration-300"
              >
                {currentDest.name[locale]}
              </h2>

              <p className="text-lg sm:text-2xl text-white/95 font-medium max-w-2xl leading-snug">
                «{currentDest.tagline[locale]}»
              </p>

              <p className="text-sm sm:text-base text-[#EDE6DA]/80 max-w-xl leading-relaxed">
                {currentDest.atmosphereNote[locale]}
              </p>

              {/* Unboxed location highlights with subtle · separators */}
              <div className="pt-1 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-white/75">
                {currentDest.highlights[locale].map((item, idx) => (
                  <React.Fragment key={item}>
                    {idx > 0 && (
                      <span aria-hidden="true" className="text-white/35">
                        ·
                      </span>
                    )}
                    <span>{item}</span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Right Asymmetric Spatial Glass Card */}
            <div className="lg:col-span-4">
              <GlassPanel className="p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-white/15 pb-3 text-xs text-white/75">
                  <span className="font-mono tabular-nums">
                    {currentDest.indexLabel}
                  </span>
                  <span>{currentDest.elevationOrRegion[locale]}</span>
                </div>

                <p className="text-sm text-[#EDE6DA]/85 leading-relaxed">
                  {currentDest.editorialDescription[locale]}
                </p>

                <GlassButton
                  variant="primary"
                  onClick={() => onExploreCountryTours(currentDest.id)}
                  className="w-full"
                >
                  <span>{currentDest.ctaLabel[locale]}</span>
                </GlassButton>
              </GlassPanel>
            </div>
          </div>
        </div>

        {/* Bottom Floating Destination Explorer Controls */}
        <div className="relative z-10 max-w-7xl w-full mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <DestinationExplorer
            activeDestinationId={journeyState.activeDestinationId}
            onSelectDestination={handleSelectDestination}
            locale={locale}
            explorerTitle={dict.journey.explorerTitle}
          />

          <span className="hidden md:inline-block text-xs text-white/60">
            {dict.journey.keyboardHint}
          </span>
        </div>
      </div>
    </section>
  );
};
