import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, MessageCircle, Instagram, MapPin } from "lucide-react";
import { BUSINESS_CONFIG } from "../../config/business";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { destinations } from "../../data/destinations";
import { GlassModal } from "../glass/GlassModal";
import { BrandLogo } from "./BrandLogo";
import { isLeadCaptureEnabled } from "../../lib/leads";

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
      className="bg-canvas border-t border-line text-muted py-16 px-4 sm:px-8 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-line">
        {/* Brand Column */}
        <div className="md:col-span-5 space-y-4">
          <BrandLogo locale={locale} variant="footer" />
          <p className="text-sm text-muted max-w-sm leading-relaxed font-sans">
            {dict.footer.tagline}
          </p>
          <div className="flex items-center gap-2 text-xs text-muted font-mono">
            <MapPin className="w-3.5 h-3.5 text-accent" />
            <span>{dict.footer.departureInfo}</span>
          </div>
        </div>

        {/* Navigation & Destinations */}
        <div className="md:col-span-3 space-y-3">
          <h3 className="text-xs font-mono tracking-wider uppercase text-muted">
            {dict.footer.directionsTitle}
          </h3>
          <ul className="space-y-2 text-sm">
            {destinations.map((dest) => (
              <li key={dest.id}>
                <Link
                  to={`/destinations/${dest.id}`}
                  className="text-muted hover:text-ink hover:translate-x-1 inline-block transition-all"
                >
                  {dest.name[locale]}
                </Link>
              </li>
            ))}
            <li className="pt-2 border-t border-line">
              <Link
                to="/tours"
                className="text-accent hover:text-accent font-semibold inline-flex items-center gap-1 transition-colors"
              >
                <span>{dict.nav.tours}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Company & Info */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-mono tracking-wider uppercase text-muted">
            {dict.footer.companyTitle}
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="/about"
                className="text-muted hover:text-ink transition-colors"
              >
                {dict.nav.about}
              </Link>
            </li>
            <li>
              <Link
                to="/reviews"
                className="text-muted hover:text-ink transition-colors"
              >
                {dict.nav.reviews}
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className="text-muted hover:text-ink transition-colors"
              >
                {dict.footer.faqKnowledgeBase}
              </Link>
            </li>
            <li>
              <Link
                to="/contacts"
                className="text-muted hover:text-ink transition-colors"
              >
                {dict.nav.contacts}
              </Link>
            </li>
          </ul>
        </div>

        {/* Direct Contacts */}
        <div className="md:col-span-2 space-y-3">
          <h3 className="text-xs font-mono tracking-wider uppercase text-muted">
            {dict.footer.contactsTitle}
          </h3>
          <div className="flex flex-col space-y-2.5 text-sm">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sage-ink hover:brightness-125 transition-all w-fit"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
            <a
              href={BUSINESS_CONFIG.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-accent hover:brightness-125 transition-all w-fit"
            >
              <Instagram className="w-4 h-4" />
              <span>Instagram</span>
            </a>
            <div className="pt-2 text-[11px] text-muted leading-relaxed font-sans">
              {dict.footer.workingHours}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-muted">
        <p>
          © {new Date().getFullYear()} {BUSINESS_CONFIG.companyName} {BUSINESS_CONFIG.brandSubline}. {dict.footer.copyright}
        </p>
        <button
          type="button"
          onClick={() => setPrivacyOpen(true)}
          className="hover:text-ink underline underline-offset-4 transition-colors cursor-pointer"
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
        <div className="space-y-4 text-sm leading-relaxed text-muted">
          <h3 className="font-display text-lg text-ink font-bold">
            {dict.footer.privacyModalTitle}
          </h3>
          <p>{isLeadCaptureEnabled() ? dict.bookingForm.captureNotice : dict.footer.privacyModalText}</p>
          <p>{dict.bookingForm.preferenceNotice}</p>
        </div>
      </GlassModal>
    </footer>
  );
};
