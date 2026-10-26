import React from "react";
import { Link } from "react-router-dom";
import { businessConfig } from "../../config/business";

interface BrandLogoProps {
  variant?: "header" | "footer" | "mobile" | "card" | "full";
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = "header",
  className = "",
  onClick,
}) => {
  const isKz = typeof document !== "undefined" && document.documentElement.lang === "kk";
  const homeAriaLabel = isKz ? "ALL TOUR — Басты бет" : "ALL TOUR — Главная";

  if (variant === "header") {
    return (
      <Link
        to="/"
        onClick={onClick}
        aria-label={homeAriaLabel}
        className={`group inline-flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-[#0786c7] ${className}`}
      >
        <div className="relative p-1 rounded-xl bg-white/95 shadow-sm transition-transform duration-200 group-hover:scale-105">
          <img
            src={businessConfig.logoMark}
            alt="ALL TOUR Emblem"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
          />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display text-sm sm:text-base font-bold tracking-wider text-white">
            ALL <span className="text-[#0786c7]">TOUR</span>
          </span>
          <span className="text-[9px] font-mono tracking-[0.2em] text-[#d11d35] font-semibold uppercase mt-0.5">
            CONTENT TOUR
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "footer") {
    return (
      <Link
        to="/"
        onClick={onClick}
        aria-label={homeAriaLabel}
        className={`group inline-flex items-center gap-3 ${className}`}
      >
        <div className="p-2 rounded-2xl bg-white/95 shadow-md">
          <img
            src={businessConfig.logoTransparent}
            alt="ALL TOUR Official Logo"
            className="w-10 h-10 object-contain"
          />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display text-lg font-bold tracking-wider text-white">
            ALL <span className="text-[#0786c7]">TOUR</span>
          </span>
          <span className="text-[10px] font-mono tracking-[0.22em] text-[#d11d35] font-semibold uppercase mt-1">
            CONTENT TOUR
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "mobile") {
    return (
      <Link
        to="/"
        onClick={onClick}
        aria-label={homeAriaLabel}
        className={`inline-flex items-center gap-2.5 ${className}`}
      >
        <div className="p-1.5 rounded-xl bg-white/95 shadow-sm">
          <img
            src={businessConfig.logoMark}
            alt="ALL TOUR Logo"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display text-base font-bold text-white tracking-wider">
            ALL <span className="text-[#0786c7]">TOUR</span>
          </span>
          <span className="text-[9px] font-mono tracking-[0.2em] text-[#d11d35] font-semibold uppercase mt-0.5">
            CONTENT TOUR
          </span>
        </div>
      </Link>
    );
  }

  if (variant === "full") {
    return (
      <div className={`p-8 rounded-3xl bg-white/95 shadow-2xl flex flex-col items-center justify-center space-y-4 text-center border border-white/20 ${className}`}>
        <img
          src={businessConfig.logoTransparent}
          alt="ALL TOUR"
          className="w-24 h-24 object-contain"
        />
        <div className="space-y-1">
          <div className="font-display text-2xl font-bold tracking-wider text-[#0e171a]">
            ALL <span className="text-[#0786c7]">TOUR</span>
          </div>
          <div className="text-xs font-mono tracking-[0.3em] text-[#d11d35] font-bold uppercase">
            CONTENT TOUR · ALMATY
          </div>
        </div>
      </div>
    );
  }

  // card variant (default fallback)
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={businessConfig.logoMark}
        alt="ALL TOUR"
        className="w-6 h-6 object-contain rounded-lg bg-white/95 p-0.5"
      />
      <span className="font-display text-xs font-bold text-white tracking-wider">
        ALL <span className="text-[#0786c7]">TOUR</span>
      </span>
    </div>
  );
};
