import React, { useState } from "react";
import type { Dictionary } from "../../i18n/ru";

interface WhyTravelProps {
  dict: Dictionary;
}

export const WhyTravel: React.FC<WhyTravelProps> = ({ dict }) => {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 bg-[#101a1e] border-t border-white/10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
        {/* Left: Large Documentary Photograph */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div
            style={{
              background:
                "radial-gradient(circle at 50% 35%, #2a5c6a 0%, #14252c 70%, #0d1518 100%)",
            }}
            className="relative w-full h-full min-h-[360px] lg:min-h-[520px] rounded-3xl overflow-hidden border border-white/15"
          >
            {!imgFailed && (
              <img
                src="/media/editorial-travel.jpg"
                alt={dict.whyTravel.caption}
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={() => setImgFailed(true)}
                className="w-full h-full object-cover"
              />
            )}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, transparent 35%, rgba(10, 17, 21, 0.92) 100%)",
              }}
            />
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <blockquote className="text-xs sm:text-sm text-white/95 leading-relaxed">
                {dict.whyTravel.featuredQuote}
              </blockquote>
              <div className="text-xs text-[#6BAFB3] font-mono">
                — {dict.whyTravel.featuredQuoteAuthor}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editorial Sequence of Text Blocks */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-10 lg:pl-6">
          <div className="space-y-4">
            <p className="editorial-kicker text-[#6BAFB3]">
              {dict.whyTravel.kicker}
            </p>
            <h2 className="headline-section font-bold text-white">
              {dict.whyTravel.title}
            </h2>
            <p className="text-base text-[#EDE6DA]/80 leading-relaxed">
              {dict.whyTravel.lead}
            </p>
          </div>

          <div className="divide-y divide-white/12 border-t border-b border-white/12">
            {dict.whyTravel.items.map((item) => (
              <div
                key={item.index}
                className="py-6 flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-6"
              >
                <span className="font-mono text-xs text-[#6BAFB3] tabular-nums shrink-0">
                  {item.index}.
                </span>
                <div className="space-y-1.5">
                  <h3 className="font-display text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#EDE6DA]/75 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
