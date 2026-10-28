import type { Tour } from "../data/tours";
import { getUpcomingDepartures } from "./departures";

export type DurationFilter = "all" | "short" | "multi";

export function getSortableTourPrice(tour: Pick<Tour, "priceKzt" | "posterReferencePriceKzt"> & { id?: string }, asOf?: string): number | null {
  if (typeof tour.priceKzt === "number" && Number.isFinite(tour.priceKzt) && tour.priceKzt > 0) return tour.priceKzt;
  const announcement = tour.id ? getUpcomingDepartures(asOf, tour.id)[0] : undefined;
  if (announcement) return announcement.publishedPriceKzt;
  for (const price of [tour.posterReferencePriceKzt]) {
    if (typeof price === "number" && Number.isFinite(price) && price > 0) return price;
  }
  return null;
}

export function compareTourPrices(a: Pick<Tour, "priceKzt" | "posterReferencePriceKzt">, b: Pick<Tour, "priceKzt" | "posterReferencePriceKzt">, direction: "asc" | "desc"): number {
  const left = getSortableTourPrice(a);
  const right = getSortableTourPrice(b);
  if (left === null) return right === null ? 0 : 1;
  if (right === null) return -1;
  return direction === "asc" ? left - right : right - left;
}

export function matchesTourDuration(
  tour: Pick<Tour, "durationDays">,
  filter: DurationFilter,
): boolean {
  if (filter === "all") return true;
  const days = tour.durationDays;
  if (days === undefined || !Number.isInteger(days) || days < 1) return false;
  return filter === "short" ? days <= 3 : days >= 5 && days <= 6;
}
