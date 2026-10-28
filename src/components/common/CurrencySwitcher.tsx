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
  const { currency, setCurrency, isLiveRates } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (isOpen) containerRef.current?.querySelector<HTMLElement>('[role="option"][aria-selected="true"]')?.focus();
  }, [isOpen]);

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
      if (e.key === "Escape" && !e.defaultPrevented) {
        e.preventDefault();
        e.stopImmediatePropagation();
        setIsOpen(false);
        triggerRef.current?.focus();
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
    triggerRef.current?.focus();
  };

  const isKz = locale === "kz";

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Trigger Button: Shows code and symbol to avoid ambiguity */}
      <button
        ref={triggerRef}
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
            ? "flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-surface-soft hover:bg-surface-hover text-ink transition-colors cursor-pointer border border-line w-full"
            : "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-soft hover:bg-surface-hover text-ink hover:text-ink transition-colors cursor-pointer border border-line text-xs font-mono"
        }
      >
        <span className="inline-flex items-center gap-1">
          <span className="font-bold tracking-wider text-ink">
            {activeMeta.code}
          </span>
          {activeMeta.code === "KGS" ? (
            <span className="inline-flex items-center shrink-0">
              <SomIcon className="w-3.5 h-3.5 text-ink shrink-0" />
              <span className="sr-only">кыргызских сомов</span>
            </span>
          ) : (
            <span className="text-muted font-sans font-medium">
              {activeMeta.symbol}
            </span>
          )}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-muted transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          onKeyDown={(event) => {
            if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setIsOpen(false); triggerRef.current?.focus(); return; }
            const options = Array.from(containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="option"]') || []);
            const current = options.indexOf(document.activeElement as HTMLButtonElement);
            const next = event.key === "ArrowDown" ? (current + 1) % options.length : event.key === "ArrowUp" ? (current - 1 + options.length) % options.length : event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : null;
            if (next !== null) { event.preventDefault(); options[next]?.focus(); }
            if (event.key === "Tab") setIsOpen(false);
          }}
          aria-label={isKz ? "Валюталар тізімі" : "Список валют"}
          data-testid="currency-dropdown"
          className={`absolute mt-2 rounded-2xl bg-surface/95 border border-line p-1.5 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
            variant === "mobile" ? "left-0 right-0 w-full" : "right-0 w-64"
          }`}
        >
          <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted border-b border-line mb-1">
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
                  tabIndex={isSelected ? 0 : -1}
                  aria-selected={isSelected}
                  data-testid={`currency-option-${item.code}`}
                  data-currency={item.code}
                  onClick={() => handleSelect(item.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all cursor-pointer group ${
                    isSelected
                      ? "bg-accent/20 text-ink border border-accent/30"
                      : "text-muted hover:bg-surface-hover hover:text-ink border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {/* Explicit currency code prominently displayed */}
                    <span
                      className={`font-mono text-xs px-1.5 py-0.5 rounded font-bold ${
                        isSelected
                          ? "bg-accent text-on-accent"
                          : "bg-surface-soft text-ink group-hover:bg-surface-hover"
                      }`}
                    >
                      {item.code}
                    </span>

                    {/* Symbol and full name */}
                    <div className="flex items-center gap-1.5 text-xs">
                      {item.code === "KGS" ? (
                        <span className="inline-flex items-center shrink-0" title="сом">
                          <SomIcon className="w-3.5 h-3.5 text-ink shrink-0" />
                          <span className="sr-only">кыргызских сомов</span>
                        </span>
                      ) : (
                        <span className="font-semibold text-ink">
                          {item.symbol}
                        </span>
                      )}
                      <span className="text-muted text-[11px]">
                        {item.name[locale]}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-accent shrink-0 ml-2" />
                  )}
                </button>
              );
            })}
          </div>
          <p className="px-3 pt-2 text-[11px] text-muted">{locale === "kz" ? (isLiveRates ? "Онлайн курс бойынша шамамен есептеу." : "Анықтамалық курс бойынша шамамен есептеу.") : (isLiveRates ? "Приблизительный пересчёт по онлайн-курсу." : "Приблизительный пересчёт по справочному курсу.")}</p>
        </div>
      )}
    </div>
  );
};
