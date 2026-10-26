import React, { useState, useMemo } from "react";
import { Search, ChevronDown, MessageCircle } from "lucide-react";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { buildWhatsAppBookingUrl } from "../../lib/whatsapp";
import { GlassPanel } from "../glass/GlassPanel";
import { GlassButton } from "../glass/GlassButton";

interface FAQPageProps {
  dict: Dictionary;
  locale: Locale;
}

export const FAQPage: React.FC<FAQPageProps> = ({ dict, locale }) => {
  const fp = dict.faqPage;
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const categories = [
    { id: "all", label: fp.categories.all },
    { id: "booking", label: fp.categories.booking },
    { id: "payment", label: fp.categories.payment },
    { id: "dates", label: fp.categories.dates },
    { id: "documents", label: fp.categories.documents },
    { id: "transport", label: fp.categories.transport },
    { id: "accommodation", label: fp.categories.accommodation },
    { id: "expenses", label: fp.categories.expenses },
  ];

  const faqData = fp.items;

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
  }, [faqData, selectedCategory, searchQuery]);

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
          <p className="editorial-kicker text-[#0786c7]">{fp.kicker}</p>
          <h1 className="headline-section font-bold text-white tracking-tight">
            {fp.title}
          </h1>
          <p className="text-base sm:text-lg text-[#EDE6DA]/85 leading-relaxed">
            {fp.subtitle}
          </p>

          {/* Search Box */}
          <div className="relative pt-2">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={fp.searchPlaceholder}
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
              {fp.emptyResult}
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
                {fp.unresolvedTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#EDE6DA]/75">
                {fp.unresolvedText}
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
              <span>{fp.askBtn}</span>
            </GlassButton>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};
