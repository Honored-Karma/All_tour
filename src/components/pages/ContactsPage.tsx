import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  MessageCircle,
  Instagram,
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { BUSINESS_CONFIG } from "../../config/business";
import { buildWhatsAppBookingUrl } from "../../lib/whatsapp";
import { BrandLogo } from "../layout/BrandLogo";
import { getTourBySlug } from "../../data/tours";
import { BookingForm } from "../booking/BookingForm";
import { readTourPlan, formatPlanDates } from "../../lib/tourPlanner";

interface ContactsPageProps {
  dict: Dictionary;
  locale: Locale;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ dict, locale }) => {
  const isKz = locale === "kz";
  const [searchParams] = useSearchParams();
  const { hash } = useLocation();
  const tourSlug = searchParams.get("tour");
  const bookingTour = tourSlug ? getTourBySlug(tourSlug) : undefined;
  const bookingPlan = readTourPlan(searchParams);
  const bookingRequested = hash === "#booking" || !!tourSlug;
  const generalWhatsAppLink = buildWhatsAppBookingUrl({ locale });

  return (
    <div className="pt-28 pb-20 min-h-screen">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 text-accent text-xs font-mono tracking-wider uppercase mb-4">
          <MessageCircle className="w-3.5 h-3.5" />
          {isKz ? "ALL TOUR байланысы" : "Связаться с ALL TOUR"}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-ink mb-4 tracking-tight">
          {isKz ? "Бізбен байланысыңыз" : "Контакты и бронирование"}
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted font-sans leading-relaxed">
          {isKz
            ? "Тур, күндер немесе бос орындар туралы білгіңіз келсе, WhatsApp-қа жазыңыз."
            : "Напишите в WhatsApp, чтобы узнать даты, стоимость и свободные места."}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct channels & Brand Identity */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand Card with Logo */}
            <div className="rounded-3xl bg-surface-soft border border-line p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

              <div className="mb-6">
                <BrandLogo variant="full" />
              </div>

              <p className="text-sm text-muted leading-relaxed mb-6 font-sans">
                {isKz
                  ? "Алматыдан Қырғызстанға, Қытайға және Грузияға турлар ұйымдастырамыз."
                  : "Организуем туры из Алматы в Кыргызстан, Китай и Грузию."}
              </p>

              {/* Direct action links */}
              <div className="space-y-3">
                <a
                  href={generalWhatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-sage/15 hover:bg-sage/25 border border-sage/40 text-sage-ink font-semibold transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-sage-ink" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-sage-ink/80 font-mono">WhatsApp</div>
                      <div className="text-sm text-ink font-mono">{BUSINESS_CONFIG.phoneWhatsAppDisplay}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>

                <a
                  href={BUSINESS_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-accent/5 hover:bg-accent/10 border border-accent/20 text-accent font-semibold transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-accent font-mono">Instagram</div>
                      <div className="text-sm text-ink font-mono">{BUSINESS_CONFIG.instagramHandle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Departure Hub Info */}
            <div className="rounded-3xl bg-surface-soft border border-line p-6 sm:p-8 backdrop-blur-md">
              <h3 className="text-lg font-serif font-semibold text-ink mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-accent" />
                {isKz ? "Жөнелту орны және жиын" : "Точка сбора и отправления"}
              </h3>
              <div className="space-y-4 text-sm text-muted font-sans">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-surface-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-sand" />
                  </div>
                  <div>
                    <div className="font-semibold text-ink">
                      {isKz ? "Алматы қаласы" : "Алматы"}
                    </div>
                    <div className="text-xs text-muted">
                      {isKz
                        ? "Жиналу орны мен уақытын сапар алдында хабарлаймыз."
                        : "Место и время сбора сообщим перед поездкой."}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-surface-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-sage-ink" />
                  </div>
                  <div>
                    <div className="font-semibold text-ink">
                      {isKz ? "Менеджермен байланыс" : "Связь с менеджером"}
                    </div>
                    <div className="text-xs text-muted">
                      {isKz
                        ? "Сапар күндері мен шарттарын WhatsApp арқылы нақтылаңыз."
                        : "Уточните даты и условия поездки в WhatsApp."}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-surface-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-sage-ink" />
                  </div>
                  <div>
                    <div className="font-semibold text-ink">
                      {isKz ? "Брондау және төлем" : "Бронирование и оплата"}
                    </div>
                    <div className="text-xs text-muted">
                      {isKz
                        ? "Менеджер бос орындарды тексеріп, төлем шарттарын түсіндіреді."
                        : "Менеджер проверит места и расскажет об условиях оплаты."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Interactive Form */}
          <div className="lg:col-span-7">
            <BookingForm key={tourSlug || "general"} dict={dict} locale={locale}
              mode={bookingRequested ? "tour" : "consultation"} preselectedTour={bookingTour}
              initialDesiredDate={formatPlanDates(bookingPlan, locale)} initialTravelers={bookingPlan.travelers} />
          </div>
        </div>
      </div>
    </div>
  );
};
