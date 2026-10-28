import { tours } from "../data/tours";
import { destinations } from "../data/destinations";
import { validateBookingPayload, type Locale } from "./whatsapp";

export interface LeadInput {
  name: string; contact: string; destinationId: string; destinationName: string;
  tourId: string | null; tourTitle: string; desiredDate: string; travelersCount: number;
  comment: string; locale: Locale; mode: "tour" | "consultation";
  attribution: Record<string, string>;
}

export function parseLeadInput(value: unknown): { input: LeadInput | null; errors: string[] } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { input: null, errors: ["Неверный формат заявки."] };
  const item = value as Record<string, unknown>;
  const errors: string[] = [];
  const text = (key: string, max: number) => {
    if (item[key] === undefined || item[key] === null) return "";
    if (typeof item[key] !== "string" || item[key].length > max) { errors.push(`Проверьте поле ${key}.`); return ""; }
    return item[key].trim();
  };
  const locale = item.locale === "kz" ? "kz" : "ru";
  const mode = item.mode === "consultation" ? "consultation" : "tour";
  const tourId = text("tourId", 100);
  const tour = tourId ? tours.find((entry) => entry.id === tourId) : undefined;
  if (tourId && !tour) errors.push("Выбранного тура нет в каталоге.");
  const destinationId = text("destinationId", 40);
  if (destinationId && !destinations.some((entry) => entry.id === destinationId)) errors.push("Неизвестное направление.");
  if (tour && destinationId && tour.destinationId !== destinationId) errors.push("Тур не соответствует направлению.");
  const destination = destinations.find((entry) => entry.id === (tour?.destinationId || destinationId));
  const attribution: Record<string, string> = {};
  if (item.attribution && typeof item.attribution === "object" && !Array.isArray(item.attribution)) {
    for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
      const value = (item.attribution as Record<string, unknown>)[key];
      if (typeof value === "string" && /^[a-z0-9_.-]{1,80}$/i.test(value)) attribution[key] = value;
    }
  }
  const input: LeadInput = {
    name: text("name", 80), contact: text("contact", 30), desiredDate: text("desiredDate", 160),
    comment: text("comment", 2000), travelersCount: Number(item.travelersCount),
    destinationId: destination?.id || "", destinationName: destination?.name[locale] || "",
    tourId: tour?.id || null, tourTitle: tour?.title[locale] || "", locale, mode,
    attribution,
  };
  const validation = validateBookingPayload({ ...input, destinationId: destination?.id || "" }, locale, { contact: true, destination: mode === "tour", date: mode === "tour" });
  errors.push(...Object.values(validation.errors).filter((error): error is string => !!error));
  return { input: errors.length ? null : input, errors };
}
