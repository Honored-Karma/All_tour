import React from "react";
import { Link } from "react-router-dom";
import { Compass, Users, MapPin, ShieldCheck, ArrowRight, MessageCircle } from "lucide-react";
import { businessConfig } from "../../config/business";
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
  const whatsappUrl = buildWhatsAppBookingUrl({ locale });

  const values = [
    {
      icon: MapPin,
      title: "Прямой старт из Алматы",
      description:
        "Все наши маршруты спроектированы с выездом или вылетом из Алматы — без запутанных самостоятельных стыковок и лишних хлопот.",
    },
    {
      icon: Compass,
      title: "Три контрастных мира",
      description:
        "Горная прохлада Тянь-Шаня и Иссык-Куля, историческая архитектура Грузии и культурный масштаб Китая в одной системе направлений.",
    },
    {
      icon: Users,
      title: "Живое сопровождение гидов",
      description:
        "Наши гиды (Ардак, Дильмина, Бекзат, Шабазхан, Айхан, Гулден) создают дружескую атмосферу в дороге и помогают участникам на каждом этапе пути.",
    },
    {
      icon: ShieldCheck,
      title: "Прямой диалог без бюрократии",
      description:
        "Мы не используем автоматические непроверенные списания: каждое бронирование согласовывается лично менеджером в WhatsApp с проверкой мест.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d1518] text-[#EDE6DA] pt-28 pb-24 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-14">
        {/* Header Hero */}
        <div className="space-y-4 max-w-3xl border-b border-white/10 pb-8">
          <p className="editorial-kicker text-[#0786c7]">О КОМПАНИИ ALL TOUR</p>
          <h1 className="headline-section font-bold text-white tracking-tight">
            Путешествия, которые объединяют людей и открывают границы.
          </h1>
          <p className="text-base sm:text-lg text-[#EDE6DA]/85 leading-relaxed">
            ALL TOUR (CONTENT TOUR) — туристическая команда из Алматы. Мы организуем авторские выезды, контент-туры и групповые поездки в Кыргызстан, Грузию и Китай.
          </p>
        </div>

        {/* Brand & Identity Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex justify-center">
            <BrandLogo variant="full" className="w-full max-w-md" />
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Наша философия: Меньше формальностей. Больше живых эмоций.
            </h2>
            <p className="text-sm sm:text-base text-[#EDE6DA]/80 leading-relaxed">
              Мы верим, что настоящее путешествие — это не просто трансфер до отеля, а общение, совместные кадры, яркие открытия и тёплые воспоминания. Каждая поездка ALL TOUR создаётся для тех, кто ценит продуманную логистику, заботливых гидов и комфорт.
            </p>
            <p className="text-sm text-[#EDE6DA]/70 leading-relaxed">
              В наших программах вы найдёте как короткие выезды на выходные (Небесный мост в Кыргызстане или 3-дневный тур в Китай), так и основательные 6-дневные экспедиции в Урумчи и путешествия по Кавказу.
            </p>
          </div>
        </div>

        {/* Real Documentary Group Photo */}
        <section className="space-y-4 pt-4 border-t border-white/10">
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-white">
              Живые кадры из наших поездок
            </h2>
            <p className="text-xs sm:text-sm text-[#EDE6DA]/70">
              Настоящая группа путешественников ALL TOUR после завершения контент-тура в Китае.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl aspect-[16/9] sm:aspect-[21/9]">
            <img
              src={OFFICIAL_LOGO.groupChinaPhoto}
              alt="Группа путешественников ALL TOUR"
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
              <span className="font-medium">Контент-тур ALL TOUR в Китае</span>
              <span className="font-mono text-white/70">Instagram: @all_tour.kz</span>
            </div>
          </div>
        </section>

        {/* 4 Core Principles */}
        <section className="space-y-6 pt-4 border-t border-white/10">
          <h2 className="font-display text-xl font-bold text-white">
            Как мы работаем
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
                Хотите поехать с нами в следующий тур?
              </h3>
              <p className="text-sm text-[#EDE6DA]/75 leading-relaxed">
                Напишите в WhatsApp — менеджер расскажет о ближайших выездах из Алматы и поможет подобрать тур для вас или вашей компании.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/tours"
                className="liquid-glass-button-secondary px-5 py-3 rounded-xl text-sm font-medium"
              >
                Смотреть туры
              </Link>
              <GlassButton
                variant="primary"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span>Написать в WhatsApp ↗</span>
              </GlassButton>
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
