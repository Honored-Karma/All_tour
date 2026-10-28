import records from "../data/departures.json";

export interface TourDeparture {
  id: string;
  tourId: string;
  startDate: string;
  endDate: string;
  publishedPriceKzt: number | null;
  status: "announced" | "sold_out" | "cancelled";
  sourceUrl: string;
  sourcePublishedAt: string | null;
  checkedAt: string;
}

export const departures = records as TourDeparture[];

export function localToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Qyzylorda", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** Published announcements are not inventory or a confirmed reservation. */
export function getUpcomingDepartures(today = localToday(), tourId?: string): TourDeparture[] {
  return departures.filter((item) => item.status === "announced" && item.startDate >= today && (!tourId || item.tourId === tourId))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
}

export function getPublishedDeparturePrice(tourId?: string, today = localToday()): number | null {
  if (!tourId) return null;
  // Never reuse a past campaign's price for a later departure without a price.
  return getUpcomingDepartures(today, tourId)[0]?.publishedPriceKzt ?? null;
}

export function formatDepartureDates(departure: Pick<TourDeparture, "startDate" | "endDate">, locale: "ru" | "kz"): string {
  const formatter = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", year: "numeric" });
  // Some Chromium installations lack Kazakh month names and return "M11".
  const months = ["қаңтар", "ақпан", "наурыз", "сәуір", "мамыр", "маусым", "шілде", "тамыз", "қыркүйек", "қазан", "қараша", "желтоқсан"];
  const format = (value: string) => {
    const [year, month, day] = value.split("-").map(Number);
    return locale === "kz" ? `${day} ${months[month - 1]} ${year} ж.` : formatter.format(new Date(`${value}T12:00:00`));
  };
  const start = format(departure.startDate);
  return departure.endDate === departure.startDate ? start : `${start} — ${format(departure.endDate)}`;
}
