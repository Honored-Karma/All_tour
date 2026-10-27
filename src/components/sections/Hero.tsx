import React, { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import type { Dictionary } from "../../i18n/ru";
import { buildWhatsAppBookingUrl, type Locale } from "../../lib/whatsapp";
import { GlassButton } from "../glass/GlassButton";

const scenes = [
  { id: "kyrgyzstan", image: "/media/kyrgyzstan-2", mobile: "/media/kyrgyzstan-2-sm.webp", position: "50% 50%", gradient: "#183f48" },
  { id: "georgia", image: "/media/georgia-2", mobile: "/media/georgia-2-sm.webp", position: "65% 50%", gradient: "#423b30" },
  { id: "china", image: "/media/china-hero", position: "45% 50%", gradient: "#233d29" },
] as const;

interface HeroProps {
  dict: Dictionary;
  locale: Locale;
  reducedMotion: boolean;
  onExploreClick: () => void;
}

function SceneImage({ index, alt }: { index: number; alt: string }) {
  const [failed, setFailed] = useState(false);
  const scene = scenes[index];
  return (
    <div className="hero-landscape" style={{ background: scene.gradient }}>
      {!failed && (
        <picture>
          {"mobile" in scene && <source media="(max-width: 640px)" srcSet={scene.mobile} type="image/webp" />}
          <source srcSet={`${scene.image}.webp`} type="image/webp" />
          <img
            src={`${scene.image}.jpg`}
            alt={alt}
            loading="eager"
            fetchPriority={index === 0 ? "high" : "low"}
            decoding="async"
            style={{ objectPosition: scene.position }}
            onError={() => setFailed(true)}
          />
        </picture>
      )}
    </div>
  );
}

export const Hero: React.FC<HeroProps> = ({ dict, locale, reducedMotion, onExploreClick }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [activeScene, setActiveScene] = useState(-1);
  const copy = dict.heroPlaces;

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    let frame = 0;
    let start = 0;
    let distance = 1;
    let previousChapter = -2;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const update = () => {
      frame = 0;
      const progress = clamp((window.scrollY - start) / distance);
      stage.style.setProperty("--cloud-play-state", progress < 1 && !document.hidden ? "running" : "paused");
      const exit = clamp((progress - 0.88) / 0.12);
      const softExit = exit * exit * (3 - 2 * exit);
      stage.style.setProperty("--hero-exit", String(softExit));
      const chapter = progress < 0.16 ? -1 : progress < 0.36 ? 0 : progress < 0.69 ? 1 : 2;
      if (chapter !== previousChapter) {
        previousChapter = chapter;
        setActiveScene(chapter);
      }
      if (introRef.current) {
        introRef.current.style.opacity = String(1 - clamp(progress / 0.15));
        introRef.current.style.transform = `translate3d(0, ${-progress * 160}px, 0)`;
      }
      scenes.forEach((_, index) => {
        const image = imageRefs.current[index];
        const caption = captionRefs.current[index];
        const bar = progressRefs.current[index];
        const entry = index === 0 ? 0 : index === 1 ? 0.29 : 0.62;
        const reveal = index === 0 ? 1 : clamp((progress - entry) / 0.13);
        const local = clamp((progress - entry) / 0.38);
        if (image) {
          image.style.opacity = String(reveal);
          image.style.transform = `translate3d(0, ${(1 - local) * 2}%, 0) scale(${1.08 - local * 0.08})`;
        }
        const captionStart = index === 0 ? 0.15 : index === 1 ? 0.37 : 0.7;
        const captionEnd = index === 0 ? 0.29 : index === 1 ? 0.62 : 1;
        const visibility = clamp((progress - captionStart) / 0.055) * (index === 2 ? 1 - softExit : 1 - clamp((progress - captionEnd) / 0.055));
        if (caption) {
          caption.style.opacity = String(visibility);
          caption.style.transform = `translate3d(0, ${(1 - visibility) * 24}px, 0)`;
        }
        if (bar) bar.style.transform = `scaleX(${clamp((progress - index / 3) * 3)})`;
      });
    };
    const queueUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const measure = () => {
      start = section.getBoundingClientRect().top + window.scrollY;
      distance = Math.max(1, section.offsetHeight - stage.offsetHeight);
      queueUpdate();
    };
    measure();
    window.addEventListener("scroll", queueUpdate, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", queueUpdate);
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
    observer?.observe(section);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", queueUpdate);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", queueUpdate);
      observer?.disconnect();
    };
  }, [reducedMotion]);

  const selectScene = (index: number) => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const progress = [0.24, 0.52, 0.87][index];
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (section.offsetHeight - stage.offsetHeight) * progress, behavior: "smooth" });
  };

  const introduction = (
    <div className="hero-intro-content">
      <p className="editorial-kicker text-muted hero-enter hero-enter-1">{copy.kicker}</p>
      <h1 className="headline-hero font-bold text-ink hero-enter hero-enter-2">{dict.hero.title}</h1>
      <p className="hero-intro-description hero-enter hero-enter-3">{dict.hero.subtitle}</p>
      <div className="flex flex-wrap items-center gap-3.5 pt-3 hero-enter hero-enter-4">
        <GlassButton variant="primary" onClick={onExploreClick}>{dict.hero.exploreCta}</GlassButton>
        <GlassButton variant="secondary" href={buildWhatsAppBookingUrl({ locale })} target="_blank" rel="noopener noreferrer">
          {dict.hero.whatsappCta}
        </GlassButton>
      </div>
    </div>
  );

  if (reducedMotion) {
    return (
      <section id="hero" className="photo-surface hero-static" aria-label={copy.label}>
        <div className="hero-static-intro">
          <SceneImage index={0} alt={copy.scenes[0].alt} />
          <div className="hero-cinema-scrim" />
          <div className="hero-static-content">{introduction}</div>
        </div>
        {scenes.map((scene, index) => (
          <figure key={scene.id} className="hero-static-scene">
            <SceneImage index={index} alt={copy.scenes[index].alt} />
            <div className="hero-cinema-scrim" />
            <figcaption className="hero-place-caption">
              <h2>{copy.scenes[index].title}</h2>
              <p>{copy.scenes[index].description}</p>
            </figcaption>
          </figure>
        ))}
      </section>
    );
  }

  return (
    <section id="hero" ref={sectionRef} className="photo-surface hero-scroll-story" aria-label={copy.label}>
      <div ref={stageRef} className="hero-cinema-stage">
        <div className="hero-cinema-images" aria-hidden="true">
          {scenes.map((scene, index) => (
            <div key={scene.id} ref={(node) => { imageRefs.current[index] = node; }} className={`hero-cinema-image hero-cinema-image-${index}`}>
              <SceneImage index={index} alt="" />
            </div>
          ))}
        </div>
        <div className="hero-atmosphere" aria-hidden="true">
          <div className="hero-cloud hero-cloud-left"><span /></div>
          <div className="hero-cloud hero-cloud-right"><span /></div>
          <div className="hero-cloud hero-cloud-low"><span /></div>
        </div>
        <div className="hero-cinema-scrim" />
        <div ref={introRef} className="hero-cinema-intro" inert={activeScene !== -1}>
          {introduction}
        </div>
        {scenes.map((scene, index) => (
          <div key={scene.id} ref={(node) => { captionRefs.current[index] = node; }} className="hero-place-caption hero-animated-caption" aria-hidden={activeScene !== index}>
            <h2>{copy.scenes[index].title}</h2>
            <p>{copy.scenes[index].description}</p>
          </div>
        ))}
        <div className="hero-cinema-bottom">
          <button type="button" onClick={() => activeScene === 2 ? onExploreClick() : selectScene(Math.max(0, activeScene + 1))} className="hero-scroll-cue">
            <span>{activeScene === 2 ? dict.hero.exploreCta : copy.scrollHint}</span>
            <ArrowDown size={16} aria-hidden="true" />
          </button>
          <nav aria-label={copy.navigationLabel} className="hero-scene-navigation">
            {scenes.map((scene, index) => (
              <button key={scene.id} type="button" aria-current={activeScene === index || (activeScene === -1 && index === 0) ? "step" : undefined} onClick={() => selectScene(index)}>
                <span className="hero-scene-button-label"><span className="hero-scene-index">0{index + 1}</span>{copy.scenes[index].title}</span>
                <span className="hero-scene-track" aria-hidden="true"><span ref={(node) => { progressRefs.current[index] = node; }} /></span>
              </button>
            ))}
          </nav>
          <button type="button" onClick={onExploreClick} className="hero-skip-story">{copy.skipLabel}</button>
        </div>
      </div>
    </section>
  );
};
