import { responsiveMedia } from "../../lib/media";
import React from "react";
import { Link } from "react-router-dom";
import { Compass, Users, MapPin, ShieldCheck, MessageCircle } from "lucide-react";
import { OFFICIAL_LOGO } from "../../data/assets";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { buildWhatsAppBookingUrl } from "../../lib/whatsapp";
import { BrandLogo } from "../layout/BrandLogo";
import { GlassPanel } from "../glass/GlassPanel";
import { GlassButton } from "../glass/GlassButton";
import instagramResearch from "../../data/instagramResearch.json";

interface AboutPageProps {
  dict: Dictionary;
  locale: Locale;
}

export const AboutPage: React.FC<AboutPageProps> = ({ dict, locale }) => {
  const ap = dict.aboutPage;
  const whatsappUrl = buildWhatsAppBookingUrl({ locale });

  const icons = [MapPin, Compass, Users, ShieldCheck];
  const values = ap.values.map((val, idx) => ({
    icon: icons[idx] || MapPin,
    title: val.title,
    description: val.description,
  }));

  return (
    <div className="min-h-screen bg-canvas text-ink pt-28 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Header Hero */}
        <div className="space-y-4 max-w-3xl border-b border-line pb-8">
          <p className="editorial-kicker text-sage-ink">{ap.kicker}</p>
          <h1 className="headline-section font-bold text-ink tracking-tight">
            {ap.title}
          </h1>
          <p className="text-base sm:text-lg text-muted leading-relaxed">
            {ap.subtitle}
          </p>
        </div>

        {/* Brand & Identity Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <BrandLogo variant="full" className="w-full max-w-md" />
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
              {ap.philosophyTitle}
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              {ap.philosophyP1}
            </p>
            <p className="text-sm text-muted leading-relaxed">
              {ap.philosophyP2}
            </p>
          </div>
        </div>

        {/* Real Documentary Group Photo */}
        <section className="space-y-4 pt-4 border-t border-line">
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-ink">
              {ap.groupPhotoTitle}
            </h2>
            <p className="text-xs sm:text-sm text-muted">
              {ap.groupPhotoSubtitle}
            </p>
          </div>

          <div className="photo-surface relative rounded-3xl overflow-hidden border border-line shadow-2xl aspect-[16/9] sm:aspect-[21/9]">
            <img
              src={OFFICIAL_LOGO.groupChinaPhoto} srcSet={responsiveMedia(OFFICIAL_LOGO.groupChinaPhoto)} sizes="(min-width: 1280px) 1216px, calc(100vw - 64px)" loading="lazy" decoding="async"
              alt={ap.groupPhotoAlt}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent 60%, rgba(9, 15, 18, 0.85) 100%)",
              }}
            />
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-ink">
              <span className="font-medium">{ap.groupPhotoCaption}</span>
              <span className="font-mono text-muted">Instagram: @all_tour.kz</span>
            </div>
          </div>
        </section>

        {/* 4 Core Principles */}
        <section className="space-y-3 border-t border-line pt-6">
          <h2 className="text-xl font-semibold">{dict.departures.aboutSourceTitle}</h2>
          <p className="text-sm text-muted max-w-3xl leading-relaxed">{dict.departures.aboutSourceText}</p>
          <div className="flex flex-wrap gap-5 text-sm">
            <a href={instagramResearch.profileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">Instagram @all_tour.kz</a>
            <a href={instagramResearch.reviewHighlightsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">{dict.nav.reviews} · Instagram</a>
            <a href={instagramResearch.telegramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">Telegram ALL TOUR</a>
          </div>
        </section>
        <section className="space-y-6 pt-4 border-t border-line">
          <h2 className="font-display text-xl font-bold text-ink">
            {ap.howWeWorkTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <GlassPanel key={idx} className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-sage/15 border border-sage/30 flex items-center justify-center text-sage-ink">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-ink leading-snug">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    {val.description}
                  </p>
                </GlassPanel>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="pt-4 border-t border-line">
          <GlassPanel className="p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-display text-xl font-bold text-ink">
                {ap.ctaTitle}
              </h3>
              <p className="text-sm text-muted leading-relaxed">
                {ap.ctaText}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/tours"
                className="liquid-glass-button-secondary px-5 py-3 rounded-xl text-sm font-medium"
              >
                {ap.viewToursBtn}
              </Link>
              <GlassButton
                variant="primary"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span>{ap.whatsappBtn}</span>
              </GlassButton>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
