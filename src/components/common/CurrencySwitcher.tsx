import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useCurrency } from "../../context/CurrencyContext";
import { SUPPORTED_CURRENCIES, CURRENCY_MAP, type CurrencyCode } from "../../lib/currency";
import type { Locale } from "../../lib/whatsapp";
import { SomIcon } from "./SomIcon";

interface CurrencySwitcherProps {
  locale?: Locale;
  variant?: "header" | "mobile";
  className?: string;
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({
  locale = "ru",
  variant = "header",
  className = "",
}) => {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const activeMeta = CURRENCY_MAP[currency] || CURRENCY_MAP.KZT;

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  const isKz = locale === "kz";

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button: Shows code and symbol to avoid ambiguity */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        data-testid="currency-switcher-btn"
        aria-label={
          isKz
            ? `Валютаны таңдау: қазіргі ${activeMeta.code} (${activeMeta.symbol})`
            : `Выбрать валюту: текущая ${activeMeta.code} (${activeMeta.symbol})`
        }
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={
          variant === "mobile"
            ? "flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer border border-white/10 w-full"
            : "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/90 hover:text-white transition-colors cursor-pointer border border-white/10 text-xs font-mono"
        }
      >
        <span className="inline-flex items-center gap-1">
          <span className="font-bold tracking-wider text-white">
            {activeMeta.code}
          </span>
          {activeMeta.code === "KGS" ? (
            <span className="inline-flex items-center shrink-0">
              <SomIcon className="w-3.5 h-3.5 text-white/90 shrink-0" />
              <span className="sr-only">кыргызских сомов</span>
            </span>
          ) : (
            <span className="text-white/70 font-sans font-medium">
              {activeMeta.symbol}
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-white/60 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={isKz ? "Валюталар тізімі" : "Список валют"}
          data-testid="currency-dropdown"
          className={`absolute mt-2 rounded-2xl bg-[#0f171c]/95 border border-white/15 p-1.5 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
            variant === "mobile" ? "left-0 right-0 w-full" : "right-0 w-64"
          }`}
        >
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#EDE6DA]/50 border-b border-white/10 mb-1">
            {isKz ? "Валютаны таңдаңыз" : "Выберите валюту"}
          </div>

          <div className="space-y-0.5">
            {SUPPORTED_CURRENCIES.map((item) => {
              const isSelected = item.code === currency;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  data-testid={`currency-option-${item.code}`}
                  data-currency={item.code}
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-red-500/20 text-white border border-red-500/30"
                      : "text-white/80 hover:bg-white/10 hover:text-white border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Explicit currency code prominently displayed */}
                    <span
                      className={`font-mono text-xs px-1.5 py-0.5 rounded font-bold ${
                        isSelected
                          ? "bg-red-500 text-white"
                          : "bg-white/10 text-white/90 group-hover:bg-white/20"
                      }`}
                    >
                      {item.code}
                    </span>

                    {/* Symbol and full name */}
                    <div className="flex items-center gap-1.5 text-xs">
                      {item.code === "KGS" ? (
                        <span className="inline-flex items-center shrink-0" title="сом">
                          <SomIcon className="w-3.5 h-3.5 text-white shrink-0" />
                          <span className="sr-only">кыргызских сомов</span>
                        </span>
                      ) : (
                        <span className="font-semibold text-white">
                          {item.symbol}
                        </span>
                      )}
                      <span className="text-[#EDE6DA]/70 text-[11px]">
                        {item.name[locale]}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-red-400 shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
