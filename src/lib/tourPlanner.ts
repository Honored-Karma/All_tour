import { tours, type Tour, type TourType } from "../data/tours";
import { destinations, type DestinationId } from "../data/destinations";
import { matchesTourDuration, type DurationFilter } from "./tourFilters";
import { getUpcomingDepartures } from "./departures";

export interface TourPlan {
  destination: "all" | DestinationId;
  tour: string;
  from: string;
  to: string;
  travelers: number;
  duration: DurationFilter;
  type: "all" | TourType;
  flexible: boolean;
  publishedOnly: boolean;
}

export const defaultTourPlan: TourPlan = {
  destination: "all",
  tour: "",
  from: "",
  to: "",
  travelers: 2,
  duration: "all",
  type: "all",
  flexible: false,
  publishedOnly: false,
};

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function todayKey(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Qyzylorda",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function isDateKey(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    dateKey(new Date(`${value}T12:00:00`)) === value
  );
}

export function readTourPlan(params: URLSearchParams): TourPlan {
  const destination = params.get("destination");
  const duration = params.get("duration");
  const type = params.get("type");
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const travelers = Number(params.get("travelers") || 2);
  const plan: TourPlan = {
    destination: destinations.some((item) => item.id === destination)
      ? (destination as DestinationId)
      : "all",
    tour: params.get("tour") || "",
    from: isDateKey(from) && from >= todayKey() ? from : "",
    to: "",
    travelers:
      Number.isInteger(travelers) && travelers >= 1 && travelers <= 50
        ? travelers
        : 2,
    duration: duration === "short" || duration === "multi" ? duration : "all",
    type: [
      "content_tour",
      "mountain_nature",
      "cultural_city",
      "multi_day",
    ].includes(type || "")
      ? (type as TourType)
      : "all",
    flexible: params.get("flexible") === "true",
    publishedOnly: params.get("publishedOnly") === "true",
  };
  plan.to = plan.from && isDateKey(to) && to >= plan.from ? to : "";
  if (
    !tours.some(
      (tour) =>
        tour.slug === plan.tour &&
        (plan.destination === "all" || tour.destinationId === plan.destination),
    )
  )
    plan.tour = "";
  return plan;
}

export function writeTourPlan(
  plan: TourPlan,
  current = new URLSearchParams(),
): URLSearchParams {
  const params = new URLSearchParams(current);
  for (const key of Object.keys(defaultTourPlan) as (keyof TourPlan)[]) {
    const value = plan[key];
    if (value === defaultTourPlan[key]) params.delete(key);
    else params.set(key, String(value));
  }
  return params;
}

export function matchesTourPlan(tour: Tour, plan: TourPlan): boolean {
  if (plan.destination !== "all" && tour.destinationId !== plan.destination)
    return false;
  if (plan.tour && tour.slug !== plan.tour) return false;
  if (plan.type !== "all" && tour.tourType !== plan.type) return false;
  if (!matchesTourDuration(tour, plan.duration)) return false;
  // Published announcements are a separate opt-in filter; never imply live inventory.
  const dates = plan.publishedOnly
    ? [...tour.departureDates.filter((day) => day >= todayKey()), ...getUpcomingDepartures(undefined, tour.id).map((item) => item.startDate)]
    : tour.departureDates;
  if (plan.publishedOnly && dates.length === 0) return false;
  if (!plan.from || dates.length === 0) return true;
  const shift = (day: string, amount: number) => {
    const date = new Date(`${day}T12:00:00`);
    date.setDate(date.getDate() + amount);
    return dateKey(date);
  };
  const start = plan.flexible ? shift(plan.from, -3) : plan.from;
  const end = plan.flexible
    ? shift(plan.to || plan.from, 3)
    : plan.to || plan.from;
  return dates.some(
    (date) => isDateKey(date) && date >= start && date <= end,
  );
}

export function formatPlanDates(
  plan: Pick<TourPlan, "from" | "to" | "flexible">,
  locale: "ru" | "kz",
): string {
  const format = (day: string) =>
    new Date(`${day}T12:00:00`).toLocaleDateString(
      locale === "kz" ? "kk-KZ" : "ru-RU",
      { day: "numeric", month: "short", year: "numeric" },
    );
  if (!plan.from) return "";
  return `${format(plan.from)}${plan.to && plan.to !== plan.from ? ` — ${format(plan.to)}` : ""}${plan.flexible ? " (±3)" : ""}`;
}
