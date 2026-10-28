import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { X, ArrowUpRight, Heart, MessageCircle, Sparkles } from "lucide-react";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { BUSINESS_CONFIG } from "../../config/business";
import { destinations } from "../../data/destinations";
import { BrandLogo } from "./BrandLogo";
import { CurrencySwitcher } from "../common/CurrencySwitcher";
import { useDialog } from "../../hooks/useDialog";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
  dict: Dictionary;
  locale: Locale;
  onToggleLocale: (next: Locale) => void;
  favoritesCount?: number;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  open,
  onClose,
  dict,
  locale,
  onToggleLocale,
  favoritesCount = 0,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  useDialog(open, dialogRef, onClose);

  if (!open) return null;

  const isKz = locale === "kz";
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.phoneWhatsAppRaw}?text=${encodeURIComponent(
    isKz
      ? "Сәлеметсіз бе, ALL TOUR! Турлар туралы толық ақпарат алғым келеді."
      : "Здравствуйте, ALL TOUR! Хочу узнать актуальные даты и программы туров."
  )}`;

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={dict.nav.mobileMenuOpen}
      className="fixed inset-0 z-50 xl:hidden bg-canvas backdrop-blur-2xl flex flex-col justify-between p-5 sm:p-6 text-ink overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Top Bar: Brand Logo & Controls */}
      <div className="flex items-center justify-between border-b border-line pb-4">
        <BrandLogo locale={locale} variant="mobile" onClick={onClose} />
        <div className="flex items-center gap-2">
          <CurrencySwitcher locale={locale} variant="header" />
          <button
            type="button"
            onClick={() => onToggleLocale(locale === "ru" ? "kz" : "ru")}
            aria-label={dict.nav.langSwitchAria}
            className="px-2.5 py-1.5 rounded-lg bg-surface-soft text-xs font-mono text-ink cursor-pointer"
          >
            <span className={locale === "ru" ? "font-bold text-accent" : "opacity-60"}>
              RU
            </span>{" "}
            /{" "}
            <span className={locale === "kz" ? "font-bold text-accent" : "opacity-60"}>
              KZ
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.nav.mobileMenuClose}
            className="w-9 h-9 rounded-xl bg-surface-soft flex items-center justify-center text-ink cursor-pointer hover:bg-surface-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Navigation List */}
      <nav className="my-auto py-6 space-y-6">
        {/* Core Pages */}
        <div className="grid grid-cols-2 gap-2 text-sm font-medium">
          <Link
            to="/"
            onClick={onClose}
            className="p-3 rounded-xl bg-surface-soft hover:bg-surface-hover border border-line transition-colors"
          >
            <span className="block text-xs font-mono text-muted uppercase">
              {dict.mobileNav.homeSub}
            </span>
            <span className="text-ink font-semibold">{dict.nav.home}</span>
          </Link>

          <Link
            to="/tours"
            onClick={onClose}
            className="p-3 rounded-xl bg-surface-soft hover:bg-surface-hover border border-line transition-colors"
          >
            <span className="block text-xs font-mono text-accent uppercase">
              {dict.mobileNav.catalogSub}
            </span>
            <span className="text-ink font-semibold">{dict.nav.tours}</span>
          </Link>

          <Link
            to="/about"
            onClick={onClose}
            className="p-3 rounded-xl bg-surface-soft hover:bg-surface-hover border border-line transition-colors"
          >
            <span className="block text-xs font-mono text-muted uppercase">
              {dict.mobileNav.aboutSub}
            </span>
            <span className="text-ink font-semibold">{dict.nav.about}</span>
          </Link>

          <Link
            to="/reviews"
            onClick={onClose}
            className="p-3 rounded-xl bg-surface-soft hover:bg-surface-hover border border-line transition-colors"
          >
            <span className="block text-xs font-mono text-sand uppercase">
              {dict.mobileNav.storiesSub}
            </span>
            <span className="text-ink font-semibold">{dict.nav.reviews}</span>
          </Link>

          <Link
            to="/faq"
            onClick={onClose}
            className="p-3 rounded-xl bg-surface-soft hover:bg-surface-hover border border-line transition-colors"
          >
            <span className="block text-xs font-mono text-muted uppercase">
              {dict.mobileNav.infoSub}
            </span>
            <span className="text-ink font-semibold">{dict.mobileNav.faqLabel}</span>
          </Link>

          <Link
            to="/contacts"
            onClick={onClose}
            className="p-3 rounded-xl bg-surface-soft hover:bg-surface-hover border border-line transition-colors"
          >
            <span className="block text-xs font-mono text-sage-ink uppercase">
              {dict.mobileNav.contactsSub}
            </span>
            <span className="text-ink font-semibold">{dict.nav.contacts}</span>
          </Link>
        </div>

        {/* Favorites quick trigger */}
        <Link
          to="/tours?favorites=true"
          onClick={onClose}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-accent/10 border border-accent/20 text-ink"
        >
          <div className="flex items-center gap-2.5">
            <Heart
              className={`w-4 h-4 ${
                favoritesCount > 0 ? "fill-accent text-accent" : "text-muted"
              }`}
            />
            <span className="text-sm font-semibold">
              {dict.mobileNav.favoritesLabel}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-accent text-xs font-bold text-on-accent">
            {favoritesCount}
          </span>
        </Link>

        {/* Destinations Group */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono tracking-wider uppercase text-muted">
            {dict.journey.explorerTitle}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                to={`/destinations/${dest.id}`}
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-surface-soft hover:bg-surface-hover border border-line text-left transition-colors"
              >
                <div>
                  <div className="font-display text-sm font-semibold text-ink">
                    {dest.name[locale]}
                  </div>
                  <div className="text-[11px] text-muted">
                    {dest.tagline[locale]}
                  </div>
                </div>
                <span className="font-mono text-[10px] text-muted px-2 py-0.5 rounded bg-surface-soft">
                  {dest.indexLabel}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Action Buttons */}
      <div className="space-y-2.5 border-t border-line pt-4">
        <Link
          to="/tours#tour-planner"
          onClick={onClose}
          className="w-full py-3.5 px-5 rounded-xl bg-accent hover:bg-accent-hover text-on-accent text-sm font-semibold text-center flex items-center justify-center gap-2 shadow-lg shadow-accent/10"
        >
          <Sparkles className="w-4 h-4" />
          <span>{dict.nav.cta}</span>
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-5 rounded-xl bg-sage/15 hover:bg-sage/25 border border-sage/30 text-sage-ink text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{dict.hero.whatsappCta}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>
    </div>
  );
};
