import React, { useState, useMemo } from "react";
import { Search, ChevronDown, MessageCircle, HelpCircle } from "lucide-react";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { buildWhatsAppBookingUrl } from "../../lib/whatsapp";
import { GlassPanel } from "../glass/GlassPanel";
import { GlassButton } from "../glass/GlassButton";

interface FAQPageProps {
  dict: Dictionary;
  locale: Locale;
}

interface FAQItem {
  category: "booking" | "payment" | "dates" | "documents" | "transport" | "accommodation" | "expenses";
  q: string;
  a: string;
}

export const FAQPage: React.FC<FAQPageProps> = ({ dict, locale }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const categories = [
    { id: "all", label: "Все вопросы" },
    { id: "booking", label: "Бронирование" },
    { id: "payment", label: "Оплата" },
    { id: "dates", label: "Даты и набор" },
    { id: "documents", label: "Документы" },
    { id: "transport", label: "Транспорт" },
    { id: "accommodation", label: "Проживание" },
    { id: "expenses", label: "Доп. расходы" },
  ];

  const faqData: FAQItem[] = [
    {
      category: "booking",
      q: "Как забронировать тур в ALL TOUR?",
      a: "Выберите интересующий вас маршрут на сайте, нажмите кнопку «В WhatsApp» или заполните короткую форму заявки. В открывшемся чате менеджер лично проверит наличие мест на выбранные даты, сообщит актуальные условия и закрепит бронирование. Мы не списываем оплату автоматически через сайт.",
    },
    {
      category: "booking",
      q: "Можно ли поехать семьёй или компанией друзей?",
      a: "Да, к нам обращаются как индивидуальные путешественники, так и пары, семьи с детьми и корпоративные группы. Укажите количество участников в заявке, и мы предложим оптимальное размещение и формат выезда.",
    },
    {
      category: "payment",
      q: "Как происходит оплата тура?",
      a: "Способ и условия внесения предоплаты/оплаты согласовываются напрямую с менеджером после подтверждения наличия свободных мест на ваши даты. Сайт не требует ввода банковских карт.",
    },
    {
      category: "payment",
      q: "Почему на сайте указано «Уточнить стоимость» или «по афише»?",
      a: "Цены на исходных рекламных материалах являются справочными данными конкретных сезонных программ. Чтобы наши путешественники всегда получали актуальную информацию с учётом действующих тарифов и сезона, итоговая сумма подтверждается менеджером.",
    },
    {
      category: "dates",
      q: "Где посмотреть расписание ближайших выездов?",
      a: "График выездов и набор групп регулярно обновляются в зависимости от сезона и погоды. Актуальные ближайшие даты вы можете уточнить напрямую в WhatsApp или посмотреть в анонсах нашего Instagram @all_tour.kz.",
    },
    {
      category: "dates",
      q: "За сколько дней до поездки нужно бронировать места?",
      a: "Рекомендуем обращаться за 1–2 недели до желаемой даты на однодневные туры и за 2–4 недели на международные маршруты в Китай и Грузию, чтобы успеть забронировать отель и комфортные места в транспорте.",
    },
    {
      category: "documents",
      q: "Какие документы нужны для поездки в Кыргызстан?",
      a: "Для граждан Республики Казахстан старше 16 лет достаточно оригинала действующего удостоверения личности РК или заграничного паспорта. Для несовершеннолетних детей требуются заграничный паспорт и документы сопровождения. Перед выездом менеджер всегда сверяет актуальный список.",
    },
    {
      category: "documents",
      q: "Какие документы требуются для поездки в Китай и Грузию?",
      a: "Для выездов в Китай (Урумчи, Инин) и Грузию требуется действующий заграничный паспорт с достаточным сроком действия. Правила безвизового въезда зависят от вашего гражданства. В турах в Китай наши гиды также помогают с заполнением миграционных карт, установкой WeChat и VPN.",
    },
    {
      category: "transport",
      q: "Откуда отправляются группы?",
      a: "Все наши выезды начинаются в городе Алматы. Точная локация сбора группы или детали рейса сообщаются менеджером и гидом в общем чате поездки.",
    },
    {
      category: "transport",
      q: "Какой транспорт используется на маршрутах?",
      a: "В зависимости от направления используются комфортабельные туристические автобусы, микроавтобусы или регулярные авиарейсы с сопровождением гидов.",
    },
    {
      category: "accommodation",
      q: "Какое проживание предусмотрено в многодневных турах?",
      a: "В турах в Урумчи и Китай проживание организовано в проверенных отелях (с завтраками шведский стол). Категория и детали размещения предоставляются в описании конкретного тура.",
    },
    {
      category: "expenses",
      q: "Какие дополнительные расходы могут возникнуть?",
      a: "В наших карточках туров чётко указано, что входит, а что оплачивается отдельно. Например, в однодневном туре в Кыргызстан трансфер и гид включены, а обед и билет на канатную дорогу/зиплайн оплачиваются на месте. В турах в Китай питание вне завтраков и сувениры также планируются индивидуально.",
    },
  ];

  const filteredItems = useMemo(() => {
    return faqData.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q);
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const toggleItem = (idx: number) => {
    setOpenItems((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const whatsappUrl = buildWhatsAppBookingUrl({ locale });

  return (
    <div className="min-h-screen bg-[#0d1518] text-[#EDE6DA] pt-28 pb-24 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <p className="editorial-kicker text-[#0786c7]">ВОПРОСЫ И ОТВЕТЫ</p>
          <h1 className="headline-section font-bold text-white tracking-tight">
            Всё, что важно знать перед началом пути.
          </h1>
          <p className="text-base sm:text-lg text-[#EDE6DA]/85 leading-relaxed">
            Подробная информация о бронировании, оплате, документах и правилах выездов с ALL TOUR. Если у вас остался вопрос — мы всегда на связи в WhatsApp.
          </p>

          {/* Search Box */}
          <div className="relative pt-2">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по вопросу или теме (например: документы, оплата, багаж)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/6 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#0786c7]"
            />
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
                selectedCategory === cat.id
                  ? "bg-[#0786c7] text-white border-[#0786c7]"
                  : "bg-white/5 border-white/12 text-[#EDE6DA]/75 hover:bg-white/10"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredItems.length === 0 ? (
            <GlassPanel className="p-8 text-center text-sm text-white/70">
              По вашему запросу вопросов не найдено. Напишите нам в WhatsApp, и менеджер ответит напрямую.
            </GlassPanel>
          ) : (
            filteredItems.map((item, idx) => {
              const isOpen = openItems.includes(idx);
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/12 bg-white/[0.03] overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                  >
                    <span className="font-display text-sm sm:text-base font-semibold text-white leading-snug">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#0786c7] shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-[#EDE6DA]/80 leading-relaxed border-t border-white/5">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Contact Help */}
        <div className="pt-4 border-t border-white/10">
          <GlassPanel className="p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="font-display text-base sm:text-lg font-bold text-white">
                Не нашли ответ на свой вопрос?
              </h3>
              <p className="text-xs sm:text-sm text-[#EDE6DA]/75">
                Задайте его менеджеру ALL TOUR — поможем со всеми нюансами маршрута.
              </p>
            </div>
            <GlassButton
              variant="primary"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span>Задать вопрос в WhatsApp ↗</span>
            </GlassButton>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
