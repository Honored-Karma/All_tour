import React from "react";
import { destinations, type DestinationId } from "../../data/destinations";
import type { Locale } from "../../lib/whatsapp";

interface ScrollProgressProps {
  activeDestinationId: DestinationId;
  overallProgress: number;
  onSelectDestination: (id: DestinationId) => void;
  locale: Locale;
}

export const ScrollProgress: React.FC<ScrollProgressProps> = ({
  activeDestinationId,
  overallProgress,
  onSelectDestination,
  locale,
}) => {
  const activeDest =
    destinations.find((d) => d.id === activeDestinationId) || destinations[0];
  const percentage = Math.round(overallProgress * 100);

  return (
    <div
      aria-label="Scene progress"
      className="liquid-glass-subtle rounded-2xl px-4 py-3 flex items-center gap-4 text-xs text-white/85"
    >
      <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
        <span className="font-mono tabular-nums font-semibold text-white">
          {activeDest.indexLabel}
        </span>
        <span aria-hidden="true" className="text-white/35">
          ·
        </span>
        <span className="uppercase tracking-wider text-white/90 font-medium">
          {activeDest.name[locale]}
        </span>
      </div>

      <div className="w-24 sm:w-32 h-1 bg-white/15 rounded-full overflow-hidden shrink-0">
        <div
          className="h-full bg-white transition-transform duration-150 ease-out origin-left"
          style={{
            transform: `scaleX(${Math.max(0.06, overallProgress).toFixed(3)})`,
          }}
        />
      </div>

      <div className="hidden sm:flex items-center gap-1.5">
        {destinations.map((dest) => {
          const active = dest.id === activeDestinationId;
          return (
            <button
              key={dest.id}
              type="button"
              onClick={() => onSelectDestination(dest.id)}
              aria-label={`${dest.stepNumber} ${dest.name[locale]}`}
              className={`w-6 h-6 rounded-md text-[11px] font-mono tabular-nums transition-colors cursor-pointer ${
                active
                  ? "bg-white/25 text-white font-semibold"
                  : "text-white/55 hover:text-white hover:bg-white/10"
              }`}
            >
              {dest.stepNumber}
            </button>
          );
        })}
      </div>

      <span className="font-mono tabular-nums text-[11px] text-white/65 hidden md:inline-block w-9 text-right">
        {percentage}%
      </span>
    </div>
  );
};
