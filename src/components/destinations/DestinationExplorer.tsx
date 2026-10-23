import React from "react";
import { destinations, type DestinationId } from "../../data/destinations";
import type { Locale } from "../../lib/whatsapp";

interface DestinationExplorerProps {
  activeDestinationId: DestinationId;
  onSelectDestination: (id: DestinationId) => void;
  locale: Locale;
  explorerTitle: string;
}

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  activeDestinationId,
  onSelectDestination,
  locale,
  explorerTitle,
}) => {
  return (
    <div
      role="region"
      aria-label={explorerTitle}
      className="liquid-glass-panel p-2 sm:p-2.5 inline-flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2"
    >
      <span className="hidden xl:inline-block px-3 py-1.5 text-[11px] font-medium tracking-[0.16em] uppercase text-white/60 whitespace-nowrap shrink-0">
        {explorerTitle}
      </span>
      <div className="flex items-center gap-1 sm:gap-1.5" role="tablist">
        {destinations.map((dest) => {
          const isActive = dest.id === activeDestinationId;
          const label =
            locale === "ru"
              ? dest.id === "kyrgyzstan"
                ? "Кыргызстан"
                : dest.id === "georgia"
                ? "Грузия"
                : "Китай"
              : dest.id === "kyrgyzstan"
              ? "Қырғызстан"
              : dest.id === "georgia"
              ? "Грузия"
              : "Қытай";

          return (
            <button
              key={dest.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectDestination(dest.id)}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#6BAFB3] ${
                isActive
                  ? "bg-white text-[#111d22] shadow-sm font-semibold"
                  : "text-white/80 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="tabular-nums opacity-65 mr-1.5">{dest.stepNumber}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
