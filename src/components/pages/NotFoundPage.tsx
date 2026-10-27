import React from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowLeft, Home } from "lucide-react";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { GlassPanel } from "../glass/GlassPanel";

interface NotFoundPageProps {
  dict: Dictionary;
  locale: Locale;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ dict }) => {
  const nf = dict.notFound;

  return (
    <div
      data-testid="not-found-page"
      className="min-h-screen bg-[#0d1518] text-[#EDE6DA] pt-36 pb-20 px-4 sm:px-8 flex flex-col items-center justify-center text-center"
    >
      <GlassPanel className="max-w-md w-full p-8 sm:p-10 flex flex-col items-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#6BAFB3]">
          <Compass className="w-8 h-8 animate-pulse" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#6BAFB3] tracking-widest uppercase">
            {nf.badge}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
            {nf.title}
          </h1>
          <p className="text-sm text-[#EDE6DA]/70 font-sans leading-relaxed">
            {nf.description}
          </p>
        </div>

        <div className="pt-2 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/tours"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-semibold shadow-md shadow-teal-900/30 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" aria-hidden="true" />
            <span>{nf.backToCatalog}</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-semibold transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>{nf.backToHome}</span>
          </Link>
        </div>
      </GlassPanel>
    </div>
  );
};
