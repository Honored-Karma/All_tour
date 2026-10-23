import React, { useState } from "react";
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
import { generateWhatsAppBookingLink } from "../../lib/whatsapp";
import { BRAND_ASSETS } from "../../data/assets";

interface ContactsPageProps {
  dict: Dictionary;
  locale: Locale;
}

export const ContactsPage: React.FC<ContactsPageProps> = ({ dict, locale }) => {
  const isKz = locale === "kz";
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [preferredTour, setPreferredTour] = useState("any");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;

    // Compose personalized WhatsApp inquiry
    const tourLabel =
      preferredTour === "china-urumqi"
        ? isKz
          ? "Үрімжі (6 күн)"
          : "Урумчи (6 дней)"
        : preferredTour === "china-3d"
        ? isKz
          ? "Қытай контент-туры (3 күн)"
          : "Китай контент-тур (3 дня)"
        : preferredTour === "kyrgyzstan"
        ? isKz
          ? "Қырғызстан контент-туры"
          : "Кыргызстан контент-тур"
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

    setIsSubmitted(true);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const generalWhatsAppLink = `https://wa.me/${BUSINESS_CONFIG.phoneWhatsAppRaw}?text=${encodeURIComponent(
    isKz
      ? "Сәлеметсіз бе, ALL TOUR! Туралы кеңес алғым келеді."
      : "Здравствуйте, ALL TOUR! Хочу получить консультацию по турам."
  )}`;

  return (
    <div className="pt-28 pb-20 min-h-screen">
      {/* Hero Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono tracking-wider uppercase mb-4">
          <MessageCircle className="w-3.5 h-3.5" />
          {isKz ? "Байланыс орталығы" : "Прямая связь с ALL TOUR"}
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-4 tracking-tight">
          {isKz ? "Бізбен байланысыңыз" : "Контакты и бронирование"}
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#EDE6DA]/70 font-sans leading-relaxed">
          {isKz
            ? "Сұрақтарыңыз бар ма немесе орын брондағыңыз келе ме? Біздің кураторлар 15 минут ішінде WhatsApp арқылы жауап береді."
            : "Хотите забронировать место, узнать актуальные даты выездов или задать вопрос гидам? Мы на связи каждый день с 09:00 до 21:00."}
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Direct channels & Brand Identity */}
          <div className="lg:col-span-5 space-y-6">
            {/* Brand Card with Logo */}
            <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="mb-6">
                <BrandLogo variant="full" />
              </div>

              <p className="text-sm text-[#EDE6DA]/80 leading-relaxed mb-6 font-sans">
                {isKz
                  ? "ALL TOUR — авторлық және контент-турлар ұйымдастырушысы. Біз Алматыдан Қырғызстан, Қытай және Грузияға ұмытылмас сапарлар мен кәсіби фотосессиялар өткіземіз."
                  : "ALL TOUR — туроператор живых путешествий и контент-туров из Алматы. Создаём авторские маршруты по Кыргызстану, Китаю и Грузии с включённой мобильной съёмкой для каждого гостя."}
              </p>

              {/* Direct action links */}
              <div className="space-y-3">
                <a
                  href={generalWhatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] font-semibold transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-[#25D366]" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-[#25D366]/80 font-mono">WhatsApp</div>
                      <div className="text-sm text-white font-mono">{BUSINESS_CONFIG.phoneWhatsAppDisplay}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>

                <a
                  href={BUSINESS_CONFIG.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-amber-500/10 hover:from-pink-500/20 hover:via-purple-500/20 hover:to-amber-500/20 border border-pink-500/30 text-pink-300 font-semibold transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs text-pink-300/80 font-mono">Instagram</div>
                      <div className="text-sm text-white font-mono">{BUSINESS_CONFIG.instagramHandle}</div>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>

            {/* Departure Hub Info */}
            <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-6 sm:p-8 backdrop-blur-md">
              <h3 className="text-lg font-serif font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-400" />
                {isKz ? "Жөнелту орны және жиын" : "Точка сбора и отправления"}
              </h3>
              <div className="space-y-4 text-sm text-[#EDE6DA]/75 font-sans">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {isKz ? "Алматы қаласы" : "г. Алматы (Казахстан)"}
                    </div>
                    <div className="text-xs text-[#EDE6DA]/60">
                      {isKz
                        ? "Турлар Алматының орталығынан басталады. Нақты мекенжай брондау кезінде чек-листпен жіберіледі."
                        : "Все автобусные и групповые туры отправляются из центра Алматы. Точная локация и памятка отправляются в персональный чат после подтверждения."}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {isKz ? "Жұмыс уақыты" : "Режим поддержки"}
                    </div>
                    <div className="text-xs text-[#EDE6DA]/60">
                      {isKz
                        ? "Күн сайын 09:00 — 21:00 (Астана уақыты). Жауап беру уақыты — 10-15 минут."
                        : "Ежедневно 09:00 — 21:00 по времени Алматы. Среднее время ответа в WhatsApp — 10–15 минут."}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {isKz ? "Ресми құжаттар" : "Договор и чек"}
                    </div>
                    <div className="text-xs text-[#EDE6DA]/60">
                      {isKz
                        ? "Әрбір саяхатшымен онлайн шарт жасалады және ресми төлем чегі беріледі."
                        : "С каждым путешественником заключается официальный туристический договор, выдаётся фискальный чек Kaspi / банк."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Interactive Form */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white/[0.03] border border-white/10 p-6 sm:p-10 backdrop-blur-md h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-red-400 uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  {isKz ? "Жылдам жазылу" : "Быстрая заявка куратору"}
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
                  {isKz ? "Сапарға жазылу немесе кеңес алу" : "Задать вопрос или забронировать тур"}
                </h2>
                <p className="text-sm text-[#EDE6DA]/70 font-sans mb-8">
                  {isKz
                    ? "Мәліметтерді толтырыңыз, біз сіздің WhatsApp нөміріңізге тур бағдарламасын, бос орындар кестесін және нақты бағасын жібереміз."
                    : "Заполните форму ниже — запрос сразу поступит куратору направления, и вы получите полную программу тура с актуальными датами и свободными местами."}
                </p>

                {isSubmitted ? (
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-8 text-center space-y-4 my-6">
                    <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-white">
                      {isKz ? "Өтінішіңіз қабылданды!" : "Заявка успешно отправлена!"}
                    </h3>
                    <p className="text-sm text-[#EDE6DA]/80 max-w-md mx-auto font-sans">
                      {isKz
                        ? "Чат WhatsApp-та ашылды. Егер ашылмаса, төмендегі батырманы басыңыз."
                        : "Диалог с куратором открыт в WhatsApp. Если окно не открылось автоматически, нажмите кнопку ниже."}
                    </p>
                    <a
                      href={generalWhatsAppLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] text-black font-semibold text-sm hover:brightness-110 transition-all"
                    >
                      <MessageCircle className="w-4 h-4" />
                      {isKz ? "WhatsApp-та ашу" : "Перейти в WhatsApp"}
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-xs font-mono text-[#EDE6DA]/70 uppercase tracking-wider mb-2">
                        {isKz ? "Сіздің атыңыз *" : "Ваше имя *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={isKz ? "Мысалы: Айгүл" : "Например: Алина"}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 transition-colors font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#EDE6DA]/70 uppercase tracking-wider mb-2">
                        {isKz ? "Телефон немесе WhatsApp *" : "Телефон / WhatsApp *"}
                      </label>
                      <input
                        type="tel"
                        required
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="+7 (700) 000-00-00"
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 transition-colors font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#EDE6DA]/70 uppercase tracking-wider mb-2">
                        {isKz ? "Қай бағыт қызықтырады?" : "Интересующее направление"}
                      </label>
                      <select
                        value={preferredTour}
                        onChange={(e) => setPreferredTour(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-[#142024] border border-white/10 text-white text-sm focus:outline-none focus:border-red-500 transition-colors font-sans"
                      >
                        <option value="any">
                          {isKz ? "Барлық бағыттар бойынша кеңес" : "Общая консультация / Пока выбираю"}
                        </option>
                        <option value="china-urumqi">
                          {isKz ? "Қытай — Үрімжі сауда және тау тур (6 күн, 145 000 ₸)" : "Китай — Урумчи гранд-тур (6 дней, 145 000 ₸)"}
                        </option>
                        <option value="china-3d">
                          {isKz ? "Қытай — Контент-тур (3 күн, 85 000 ₸)" : "Китай — Контент-тур (3 дня, 85 000 ₸)"}
                        </option>
                        <option value="kyrgyzstan">
                          {isKz ? "Қырғызстан — Ыстықкөл және каньондар контент-туры" : "Кыргызстан — Иссык-Куль, каньоны и Тянь-Шань"}
                        </option>
                        <option value="georgia">
                          {isKz ? "Грузия — Тбилиси, Казбек және Кахетия" : "Грузия — Тбилиси, Казбеги, Кахетия"}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-[#EDE6DA]/70 uppercase tracking-wider mb-2">
                        {isKz ? "Қосымша сұрақ немесе саяхатшылар саны" : "Ваш вопрос или количество гостей"}
                      </label>
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder={
                          isKz
                            ? "Қашан барғыңыз келеді? Қанша адам барасыздар?"
                            : "Планируемые даты выезда, сколько человек, нужен ли загранпаспорт..."
                        }
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-red-500 transition-colors font-sans resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-sm transition-all shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      {isKz ? "WhatsApp арқылы кеңес алу" : "Отправить и получить программу в WhatsApp"}
                    </button>

                    <div className="text-[11px] text-center text-[#EDE6DA]/50 font-sans">
                      {isKz
                        ? "Батырманы басу арқылы сіз дербес деректерді өңдеуге келісім бересіз."
                        : "Нажимая кнопку, вы соглашаетесь на обработку персональных данных для подбора тура."}
                    </div>
                  </form>
                )}
              </div>

              {/* Photo backdrop accent */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-[#EDE6DA]/60">
                <span>© {BUSINESS_CONFIG.companyName} {BUSINESS_CONFIG.brandSubline}</span>
                <span className="font-mono">{BUSINESS_CONFIG.city}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
