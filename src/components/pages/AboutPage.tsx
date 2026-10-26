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
    <div className="min-h-screen bg-[#0d1518] text-[#EDE6DA] pt-28 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Header Hero */}
        <div className="space-y-4 max-w-3xl border-b border-white/10 pb-8">
          <p className="editorial-kicker text-[#0786c7]">{ap.kicker}</p>
          <h1 className="headline-section font-bold text-white tracking-tight">
            {ap.title}
          </h1>
          <p className="text-base sm:text-lg text-[#EDE6DA]/85 leading-relaxed">
            {ap.subtitle}
          </p>
        </div>

        {/* Brand & Identity Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <BrandLogo variant="full" className="w-full max-w-md" />
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              {ap.philosophyTitle}
            </h2>
            <p className="text-sm sm:text-base text-[#EDE6DA]/80 leading-relaxed">
              {ap.philosophyP1}
            </p>
            <p className="text-sm text-[#EDE6DA]/70 leading-relaxed">
              {ap.philosophyP2}
            </p>
          </div>
        </div>

        {/* Real Documentary Group Photo */}
        <section className="space-y-4 pt-4 border-t border-white/10">
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-white">
              {ap.groupPhotoTitle}
            </h2>
            <p className="text-xs sm:text-sm text-[#EDE6DA]/70">
              {ap.groupPhotoSubtitle}
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl aspect-[16/9] sm:aspect-[21/9]">
            <img
              src={OFFICIAL_LOGO.groupChinaPhoto}
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
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-white/90">
              <span className="font-medium">{ap.groupPhotoCaption}</span>
              <span className="font-mono text-white/70">Instagram: @all_tour.kz</span>
            </div>
          </div>
        </section>

        {/* 4 Core Principles */}
        <section className="space-y-6 pt-4 border-t border-white/10">
          <h2 className="font-display text-xl font-bold text-white">
            {ap.howWeWorkTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <GlassPanel key={idx} className="p-6 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0786c7]/15 border border-[#0786c7]/30 flex items-center justify-center text-[#0786c7]">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-white leading-snug">
                    {val.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#EDE6DA]/75 leading-relaxed">
                    {val.description}
                  </p>
                </GlassPanel>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="pt-4 border-t border-white/10">
          <GlassPanel className="p-8 sm:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h3 className="font-display text-xl font-bold text-white">
                {ap.ctaTitle}
              </h3>
              <p className="text-sm text-[#EDE6DA]/75 leading-relaxed">
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
