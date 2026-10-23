import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { X, ArrowUpRight, Heart, MessageCircle, Sparkles } from "lucide-react";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { BUSINESS_CONFIG } from "../../config/business";
import { destinations } from "../../data/destinations";
import { BrandLogo } from "./BrandLogo";

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
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const isKz = locale === "kz";
  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.phoneWhatsAppRaw}?text=${encodeURIComponent(
    isKz
      ? "Сәлеметсіз бе, ALL TOUR! Туралы толық ақпарат алғым келеді."
      : "Здравствуйте, ALL TOUR! Хочу узнать актуальные даты и программы туров."
  )}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation"
      className="fixed inset-0 z-50 xl:hidden bg-[#0a1013]/95 backdrop-blur-2xl flex flex-col justify-between p-5 sm:p-6 text-[#EDE6DA] overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Top Bar: Brand Logo & Controls */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <BrandLogo variant="mobile" onClick={onClose} />
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleLocale(locale === "ru" ? "kz" : "ru")}
            className="px-2.5 py-1.5 rounded-lg bg-white/10 text-xs font-mono text-white cursor-pointer"
          >
            <span className={locale === "ru" ? "font-bold text-red-400" : "opacity-60"}>
              RU
            </span>{" "}
            /{" "}
            <span className={locale === "kz" ? "font-bold text-red-400" : "opacity-60"}>
              KZ
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={dict.nav.mobileMenuClose}
            className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-white cursor-pointer hover:bg-white/20 transition-colors"
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
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
          >
            <span className="block text-xs font-mono text-[#EDE6DA]/40 uppercase">01</span>
            <span className="text-white font-semibold">{isKz ? "Басты бет" : "Главная"}</span>
          </Link>

          <Link
            to="/tours"
            onClick={onClose}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
          >
            <span className="block text-xs font-mono text-red-400 uppercase">Каталог</span>
            <span className="text-white font-semibold">{dict.nav.tours}</span>
          </Link>

          <Link
            to="/about"
            onClick={onClose}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
          >
            <span className="block text-xs font-mono text-[#EDE6DA]/40 uppercase">Компания</span>
            <span className="text-white font-semibold">{isKz ? "Біз туралы" : "О нас"}</span>
          </Link>

          <Link
            to="/reviews"
            onClick={onClose}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
          >
            <span className="block text-xs font-mono text-amber-400 uppercase">Истории</span>
            <span className="text-white font-semibold">{dict.nav.reviews}</span>
          </Link>

          <Link
            to="/faq"
            onClick={onClose}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
          >
            <span className="block text-xs font-mono text-[#EDE6DA]/40 uppercase">Инфо</span>
            <span className="text-white font-semibold">FAQ / Вопросы</span>
          </Link>

          <Link
            to="/contacts"
            onClick={onClose}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-colors"
          >
            <span className="block text-xs font-mono text-cyan-400 uppercase">Связь</span>
            <span className="text-white font-semibold">{dict.nav.contacts}</span>
          </Link>
        </div>

        {/* Favorites quick trigger */}
        <Link
          to="/tours?favorites=true"
          onClick={onClose}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-red-500/10 border border-red-500/20 text-white"
        >
          <div className="flex items-center gap-2.5">
            <Heart
              className={`w-4 h-4 ${
                favoritesCount > 0 ? "fill-red-500 text-red-500" : "text-white/70"
              }`}
            />
            <span className="text-sm font-semibold">
              {isKz ? "Таңдаулы турлар" : "Избранные туры"}
            </span>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-red-600 text-xs font-bold text-white">
            {favoritesCount}
          </span>
        </Link>

        {/* Destinations Group */}
        <div className="space-y-2">
          <p className="text-[11px] font-mono tracking-wider uppercase text-[#EDE6DA]/50">
            {dict.journey.explorerTitle}
          </p>
          <div className="grid grid-cols-1 gap-2">
            {destinations.map((dest) => (
              <Link
                key={dest.id}
                to={`/destinations/${dest.id}`}
                onClick={onClose}
                className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-colors"
              >
                <div>
                  <div className="font-serif text-sm font-semibold text-white">
                    {dest.name[locale]}
                  </div>
                  <div className="text-[11px] text-[#EDE6DA]/60">
                    {dest.tagline[locale]}
                  </div>
                </div>
                <span className="font-mono text-[10px] text-white/50 px-2 py-0.5 rounded bg-white/5">
                  {dest.indexLabel}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Action Buttons */}
      <div className="space-y-2.5 border-t border-white/10 pt-4">
        <Link
          to="/tours"
          onClick={onClose}
          className="w-full py-3.5 px-5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-semibold text-center flex items-center justify-center gap-2 shadow-lg shadow-red-900/30"
        >
          <Sparkles className="w-4 h-4" />
          <span>{dict.nav.cta}</span>
        </Link>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3.5 px-5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{dict.hero.whatsappCta}</span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>
    </div>
  );
};
