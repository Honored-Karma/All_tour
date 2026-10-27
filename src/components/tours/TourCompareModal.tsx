import React from "react";
import { X, Check, ArrowRight, MessageCircle } from "lucide-react";
import { tours, type Tour } from "../../data/tours";
import { getDestinationById } from "../../data/destinations";
import type { Locale } from "../../lib/whatsapp";
import { buildWhatsAppBookingUrl } from "../../lib/whatsapp";
import { GlassModal } from "../glass/GlassModal";
import { GlassButton } from "../glass/GlassButton";
import { Link } from "react-router-dom";
import type { Dictionary } from "../../i18n/ru";
import { getDictionary } from "../../i18n";
import { useCurrency } from "../../context/CurrencyContext";
import { PriceDisplay } from "../common/PriceDisplay";

interface TourCompareModalProps {
  open: boolean;
  onClose: () => void;
  selectedTourIds: string[];
  onRemoveTour: (tourId: string) => void;
  locale: Locale;
  dict?: Dictionary;
}

export const TourCompareModal: React.FC<TourCompareModalProps> = ({
  open,
  onClose,
  selectedTourIds,
  onRemoveTour,
  locale,
  dict,
}) => {
  const t = dict || getDictionary(locale);
  const { formatTourPrice } = useCurrency();
  const comparedTours = tours.filter((tour) => selectedTourIds.includes(tour.id));

  return (
    <GlassModal
      open={open}
      onClose={onClose}
      title={t.compare.modalTitle}
      closeLabel={t.compare.close}
    >
      {comparedTours.length === 0 ? (
        <div className="py-12 text-center space-y-3">
          <p className="text-sm text-muted">
            {t.compare.emptyNotice}
          </p>
        </div>
      ) : (
        <div className="space-y-6 overflow-x-auto pb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-w-[620px]">
            {comparedTours.map((tour) => {
              const dest = getDestinationById(tour.destinationId);
              const bookingUrl = buildWhatsAppBookingUrl({
                locale,
                destinationName: dest.name[locale],
                tourTitle: tour.title[locale],
              });

              return (
                <div
                  key={tour.id}
                  className="p-5 rounded-2xl bg-surface-soft border border-line flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-sage-ink">
                        {dest.name[locale]}
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveTour(tour.id)}
                        aria-label={t.compare.removeAria}
                        className="text-muted hover:text-ink transition-colors cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <img
                      src={tour.image}
                      alt={tour.title[locale]}
                      className="w-full aspect-[16/10] object-cover rounded-xl"
                    />

                    <h4 className="font-display text-base font-semibold text-ink leading-snug">
                      {tour.title[locale]}
                    </h4>

                    {/* Criteria */}
                    <div className="space-y-2 text-xs border-t border-line pt-3">
                      <div>
                        <span className="text-muted block">{t.compare.duration}</span>
                        <span className="text-ink font-medium">
                          {tour.duration ? tour.duration[locale] : t.compare.onRequest}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted block">{t.compare.format}</span>
                        <span className="text-ink font-medium">
                          {tour.tourType === "content_tour"
                            ? t.compare.types.content_tour
                            : tour.tourType === "mountain_nature"
                            ? t.compare.types.mountain_nature
                            : t.compare.types.cultural_city}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted block">{t.compare.priceRef}</span>
                        {(() => {
                          const pRes = formatTourPrice(
                            tour,
                            t.compare.onRequest
                          );
                          return (
                            <div>
                              <PriceDisplay
                                priceResult={pRes}
                                className="text-ink font-mono font-bold text-sm"
                              />
                              {pRes.note && (
                                <span className="text-[10px] text-muted font-sans block leading-tight mt-0.5">
                                  ({pRes.note})
                                </span>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                      <div>
                        <span className="text-muted block">{t.compare.included}</span>
                        <ul className="text-[11px] text-muted space-y-1 mt-1">
                          {tour.included[locale].slice(0, 3).map((item, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <Check className="w-3 h-3 text-sage-ink shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-line space-y-2">
                    <Link
                      to={`/tours/${tour.slug}`}
                      onClick={onClose}
                      className="w-full py-2 rounded-xl bg-surface-soft hover:bg-surface-hover text-xs text-ink text-center font-medium block transition-colors"
                    >
                      {t.compare.detailsLink}
                    </Link>
                    <GlassButton
                      variant="primary"
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 text-xs text-center justify-center"
                    >
                      <span>{t.compare.whatsappBtn}</span>
                    </GlassButton>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </GlassModal>
  );
};
