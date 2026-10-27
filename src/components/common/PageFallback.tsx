import React from "react";
import type { Locale } from "../../lib/whatsapp";

interface PageFallbackProps {
  locale?: Locale;
}

export const PageFallback: React.FC<PageFallbackProps> = ({ locale = "ru" }) => {
  const isKz = locale === "kz";
  const label = isKz ? "Жүктелуде..." : "Загрузка...";

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      className="min-h-[70vh] w-full flex flex-col items-center justify-center p-8 bg-canvas"
    >
      <div className="w-10 h-10 rounded-full border-2 border-line border-t-sage animate-spin mb-4" />
      <span className="text-sm font-medium tracking-wider uppercase text-muted font-sans">
        {label}
      </span>
    </div>
  );
};
