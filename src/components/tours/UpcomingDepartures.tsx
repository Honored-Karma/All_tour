import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import { tours } from "../../data/tours";
import { getUpcomingDepartures, formatDepartureDates } from "../../lib/departures";
import { useCurrency } from "../../context/CurrencyContext";
import type { Locale } from "../../lib/whatsapp";
import type { Dictionary } from "../../i18n/ru";

export function UpcomingDepartures({ dict, locale, tourId }: { dict: Dictionary; locale: Locale; tourId?: string }) {
  const upcoming = getUpcomingDepartures(undefined, tourId);
  const { formatPrice } = useCurrency();
  if (!upcoming.length) return null;
  const t = dict.departures;
  return (
    <section aria-label={t.title} className="space-y-5" data-testid="upcoming-departures">
      <div className="max-w-3xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-ink">{t.title}</h2>
        <p className="text-sm text-muted leading-relaxed">{t.notice}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {upcoming.map((departure) => {
          const tour = tours.find((item) => item.id === departure.tourId);
          if (!tour) return null;
          const params = new URLSearchParams({ lang: locale, tour: tour.slug, from: departure.startDate, to: departure.endDate, travelers: "2" });
          return (
            <article key={departure.id} className="rounded-2xl border border-line bg-surface p-5 sm:p-6 space-y-4">
              <p className="flex gap-2 items-center text-sm font-semibold text-sage-ink"><CalendarDays size={18} aria-hidden="true" />{formatDepartureDates(departure, locale)}</p>
              <h3 className="text-lg font-semibold"><Link to={`/tours/${tour.slug}?${params}`}>{tour.title[locale]}</Link></h3>
              <div>
                <p className="text-lg font-semibold">{departure.publishedPriceKzt === null ? t.priceOnRequest : formatPrice(departure.publishedPriceKzt)}</p>
                {departure.publishedPriceKzt !== null && <p className="text-xs text-muted">{t.publishedPrice}</p>}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-3 items-center">
                <Link to={`/contacts?${params}#booking`} className="min-h-11 inline-flex items-center gap-2 text-sm font-semibold text-accent">{dict.tours.card.bookBtn}<ArrowUpRight size={16} aria-hidden="true" /></Link>
                <a href={departure.sourceUrl} target="_blank" rel="noopener noreferrer" className="min-h-11 inline-flex items-center text-xs underline underline-offset-4 text-muted">{t.source}</a>
              </div>
              <p className="text-xs text-muted">{t.checkedAt} <time dateTime={departure.checkedAt}>{new Date(`${departure.checkedAt}T12:00:00`).toLocaleDateString(locale === "kz" ? "kk-KZ" : "ru-RU")}</time></p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
