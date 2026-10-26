import type { Tour } from "../data/tours";

export type DurationFilter = "all" | "short" | "multi";

export function matchesTourDuration(
  tour: Pick<Tour, "durationDays">,
  filter: DurationFilter,
): boolean {
  if (filter === "all") return true;
  const days = tour.durationDays;
  if (days === undefined || !Number.isInteger(days) || days < 1) return false;
  return filter === "short" ? days <= 3 : days >= 5 && days <= 6;
}
