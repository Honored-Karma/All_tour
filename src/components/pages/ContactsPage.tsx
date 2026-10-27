import React, { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import {
  MessageCircle,
  Phone,
  Instagram,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Compass,
} from "lucide-react";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { BUSINESS_CONFIG } from "../../config/business";
import { BrandLogo } from "../layout/BrandLogo";
import { BRAND_ASSETS } from "../../data/assets";
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
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [preferredTour, setPreferredTour] = useState("any");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [preparedWhatsAppLink, setPreparedWhatsAppLink] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    // Compose personalized WhatsApp inquiry
    const tourLabel =
      preferredTour === "china-urumqi"
        ? isKz
          ? "Үрімші (6 күн)"
          : "Урумчи (6 дней)"
        : preferredTour === "china-3d"
        ? isKz
          ? "Құлжа (3 күн)"
          : "Инин (Кульджа), 3 дня"
        : preferredTour === "kyrgyzstan"
        ? isKz
          ? "Қырғызстан"
          : "Кыргызстан"
        : preferredTour === "georgia"
        ? isKz
          ? "Грузия саяхаты"
          : "Путешествие в Грузию"
        : isKz
          ? "Жалпы кеңес"
          : "Общая консультация";

    const text = isKz
      ? `Сәлеметсіз бе, ALL TOUR! Менің атым: ${name}.
Байланыс: ${contact}.
Қызықтырған бағыт: ${tourLabel}.
${notes ? `Сұрағым: ${notes}` : ""}`
      : `Здравствуйте, ALL TOUR! Меня зовут: ${name}.
Мой контакт: ${contact}.
Интересует направление: ${tourLabel}.
${notes ? `Вопрос: ${notes}` : ""}`;

    const encoded = encodeURIComponent(text);
    const link = `https://wa.me/${BUSINESS_CONFIG.phoneWhatsAppRaw}?text=${encoded}`;

    setPreparedWhatsAppLink(link);
    setIsSubmitted(true);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const generalWhatsAppLink = `https://wa.me/${BUSINESS_CONFIG.phoneWhatsAppRaw}?text=${encodeURIComponent(
    isKz
      ? "Сәлеметсіз бе, ALL TOUR! Тур таңдауға көмектесіңіз."
      : "Здравствуйте, ALL TOUR! Хочу получить консультацию по турам."
  )}`;

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
                      {isKz ? "Жұмыс уақыты" : "Время работы"}
                    </div>
                    <div className="text-xs text-muted">
                      {isKz
                        ? "Күн сайын 09:00-ден 21:00-ге дейін, Алматы уақытымен."
                        : "Ежедневно с 09:00 до 21:00 по времени Алматы."}
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
            {bookingRequested ? (
              <BookingForm key={tourSlug || "general"} dict={dict} locale={locale} preselectedTour={bookingTour}
                initialDesiredDate={formatPlanDates(bookingPlan, locale)} initialTravelers={bookingPlan.travelers} />
            ) : (
            <div className="rounded-3xl bg-surface-soft border border-line p-6 sm:p-10 backdrop-blur-md h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-accent uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  {isKz ? "Турға өтінім" : "Заявка на тур"}
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-ink mb-2">
                  {isKz ? "Сапарға жазылу немесе кеңес алу" : "Задать вопрос или забронировать тур"}
                </h2>
                <p className="text-sm text-muted font-sans mb-8">
                  {isKz
                    ? "Форманы толтырыңыз. WhatsApp-та менеджерге жіберуге болатын хабарлама ашылады."
                    : "Заполните форму. В WhatsApp откроется сообщение, которое нужно отправить менеджеру."}
                </p>

                {isSubmitted ? (
                  <div className="rounded-2xl bg-sage/10 border border-sage/30 p-8 text-center space-y-4 my-6">
                    <div className="w-14 h-14 mx-auto rounded-full bg-sage/20 flex items-center justify-center text-sage-ink">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-ink">
                      {isKz ? "Хабарлама дайын" : "Сообщение готово"}
                    </h3>
                    <p className="text-sm text-muted max-w-md mx-auto font-sans">
                      {isKz
                        ? "WhatsApp-та хабарламаны менеджерге жіберіңіз. Чат ашылмаса, төмендегі батырманы басыңыз."
                        : "Отправьте сообщение менеджеру в WhatsApp. Если чат не открылся, нажмите кнопку ниже."}
                    </p>
                    <a
                      href={preparedWhatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sage text-on-accent font-semibold text-sm hover:brightness-110 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {isKz ? "WhatsApp-та ашу" : "Перейти в WhatsApp"}
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-2">
                        {isKz ? "Сіздің атыңыз *" : "Ваше имя *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isKz ? "Мысалы: Айгүл" : "Например: Алина"}
                        className="w-full px-4 py-3 rounded-xl bg-surface-soft border border-line text-ink placeholder-muted text-sm focus:outline-none focus:border-accent transition-colors font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-2">
                        {isKz ? "Телефон немесе WhatsApp *" : "Телефон / WhatsApp *"}
                      </label>
                      <input
                        type="tel"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="+7 (700) 000-00-00"
                        className="w-full px-4 py-3 rounded-xl bg-surface-soft border border-line text-ink placeholder-muted text-sm focus:outline-none focus:border-accent transition-colors font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-2">
                        {isKz ? "Қай бағыт қызықтырады?" : "Интересующее направление"}
                      </label>
                      <select
                        value={preferredTour}
                        onChange={(e) => setPreferredTour(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-ink text-sm focus:outline-none focus:border-accent transition-colors font-sans"
                      >
                        <option value="any">
                          {isKz ? "Таңдауға көмектесіңіз" : "Помогите выбрать"}
                        </option>
                        <option value="china-urumqi">
                          {isKz ? "Үрімші — 6 күн" : "Урумчи — 6 дней"}
                        </option>
                        <option value="china-3d">
                          {isKz ? "Құлжа — 3 күн" : "Инин (Кульджа) — 3 дня"}
                        </option>
                        <option value="kyrgyzstan">
                          {isKz ? "Қырғызстан" : "Кыргызстан"}
                        </option>
                        <option value="georgia">
                          {isKz ? "Грузия — Тбилиси және Казбеги" : "Грузия — Тбилиси и Казбеги"}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-muted uppercase tracking-wider mb-2">
                        {isKz ? "Қосымша сұрақ немесе саяхатшылар саны" : "Ваш вопрос или количество гостей"}
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={
                          isKz
                            ? "Қашан барғыңыз келеді? Қанша адам барасыздар?"
                            : "Когда хотите поехать и сколько будет человек"
                        }
                        className="w-full px-4 py-3 rounded-xl bg-surface-soft border border-line text-ink placeholder-muted text-sm focus:outline-none focus:border-accent transition-colors font-sans resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-accent hover:bg-accent-hover text-on-accent font-semibold text-sm transition-all shadow-lg shadow-accent/10 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      {isKz ? "WhatsApp-ты ашу" : "Открыть WhatsApp"}
                    </button>

                    <div className="text-[11px] text-center text-muted font-sans">
                      {isKz
                        ? "Деректер WhatsApp-та хабарлама жібергенде менеджерге жетеді."
                        : "Данные попадут к менеджеру, когда вы отправите сообщение в WhatsApp."}
                    </div>
                  </form>
                )}
              </div>

              {/* Photo backdrop accent */}
              <div className="mt-8 pt-6 border-t border-line flex items-center justify-between text-xs text-muted">
                <span>© {BUSINESS_CONFIG.companyName} {BUSINESS_CONFIG.brandSubline}</span>
                <span className="font-mono">{BUSINESS_CONFIG.city}</span>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
