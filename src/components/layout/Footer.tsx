import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MessageCircle, Instagram, MapPin } from "lucide-react";
import { BUSINESS_CONFIG } from "../../config/business";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { destinations } from "../../data/destinations";
import { GlassModal } from "../glass/GlassModal";
import { BrandLogo } from "./BrandLogo";

interface FooterProps {
  dict: Dictionary;
  locale: Locale;
}

export const Footer: React.FC<FooterProps> = ({ dict, locale }) => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const isKz = locale === "kz";

  const whatsappUrl = `https://wa.me/${BUSINESS_CONFIG.phoneWhatsAppRaw}?text=${encodeURIComponent(
    isKz
      ? "Сәлеметсіз бе, ALL TOUR! Турлар туралы кеңес алғым келеді."
      : "Здравствуйте, ALL TOUR! Хочу получить консультацию по турам."
  )}`;

  return (
    <footer
      id="footer"
      className="bg-[#080d10] border-t border-white/10 text-[#EDE6DA]/80 py-16 px-4 sm:px-8 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <BrandLogo variant="footer" />
          <p className="text-sm text-[#EDE6DA]/70 max-w-sm leading-relaxed font-sans">
            {dict.footer.tagline}
          </p>
          <div className="flex items-center gap-2 text-xs text-[#EDE6DA]/55 font-mono">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>{dict.footer.departureInfo}</span>
          </div>
        </div>

        {/* Navigation & Destinations */}
        <div className="md:col-span-3 space-y-3">
          <h3 className="text-xs font-mono tracking-wider uppercase text-white/60">
            {dict.footer.directionsTitle}
          </h3>
          <ul className="space-y-2 text-sm">
            {destinations.map((dest) => (
              <li key={dest.id}>
                <Link
                  to={`/destinations/${dest.id}`}
                  className="text-[#EDE6DA]/75 hover:text-white hover:translate-x-1 inline-block transition-all"
                >
                  {dest.name[locale]}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-white/5">
              <Link
                to="/tours"
                className="text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1 transition-colors"
              >
                <span>{dict.nav.tours}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Company & Info */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-mono tracking-wider uppercase text-white/60">
            {dict.footer.companyTitle}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/about"
                className="text-[#EDE6DA]/75 hover:text-white transition-colors"
              >
                {dict.nav.about}
              </Link>
            </li>
            <li>
              <Link
                to="/reviews"
                className="text-[#EDE6DA]/75 hover:text-white transition-colors"
              >
                {dict.nav.reviews}
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="text-[#EDE6DA]/75 hover:text-white transition-colors"
              >
                {dict.footer.faqKnowledgeBase}
              </Link>
            </li>
            <li>
              <Link
                to="/contacts"
                className="text-[#EDE6DA]/75 hover:text-white transition-colors"
              >
                {dict.nav.contacts}
              </Link>
            </li>
          </ul>
        </div>

        {/* Direct Contacts */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-mono tracking-wider uppercase text-white/60">
            {dict.footer.contactsTitle}
          </h3>
          <div className="flex flex-col space-y-2.5 text-sm">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#25D366] hover:brightness-125 transition-all w-fit"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href={BUSINESS_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-pink-400 hover:brightness-125 transition-all w-fit"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram</span>
            </a>
            <div className="pt-2 text-[11px] text-[#EDE6DA]/50 leading-relaxed font-sans">
              {dict.footer.workingHours}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[#EDE6DA]/50">
        <p>
          © {new Date().getFullYear()} {BUSINESS_CONFIG.companyName} {BUSINESS_CONFIG.brandSubline}. {dict.footer.copyright}
        </p>
        <button
          type="button"
          onClick={() => setPrivacyOpen(true)}
          className="hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
        >
          {dict.footer.privacyTrigger}
        </button>
      </div>

      <GlassModal
        open={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title={dict.footer.privacyModalTitle}
        closeLabel={dict.tours.modal.closeLabel}
      >
        <div className="space-y-4 text-sm leading-relaxed text-[#EDE6DA]/85">
          <h3 className="font-serif text-lg text-white font-bold">
            {dict.footer.privacyModalTitle}
          </h3>
          <p>{dict.footer.privacyModalText}</p>
        </div>
      </GlassModal>
    </footer>
  );
};
