import { publicRoutes } from "../config/routes";
import { tours } from "../data/tours";
import type { Locale } from "./whatsapp";

type EventName = "page_view" | "tour_view" | "planner_search" | "form_start" | "form_invalid" | "message_ready" | "lead_saved" | "whatsapp_open" | "app_error";
interface Properties { locale?: Locale; route?: string; tourId?: string; count?: number; source?: "form" | "link" | "finder" | "route" }
const CAMPAIGN_KEY = "alltour_campaign";

export function readCampaign(): Record<string, string> {
  const result: Record<string, string> = {};
  if (typeof window === "undefined") return result;
  try {
    const stored = JSON.parse(window.sessionStorage.getItem(CAMPAIGN_KEY) || "{}");
    for (const key of ["utm_source", "utm_medium", "utm_campaign"]) if (typeof stored?.[key] === "string" && /^[a-z0-9_.-]{1,80}$/i.test(stored[key])) result[key] = stored[key];
  } catch {}
  return result;
}

export function rememberCampaign(search: string) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(search);
  const campaign: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign"]) {
    const value = params.get(key);
    if (value && /^[a-z0-9_.-]{1,80}$/i.test(value)) campaign[key] = value;
  }
  if (Object.keys(campaign).length) try { window.sessionStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaign)); } catch {}
}

/** First-party events only. Never include names, phones, messages or query strings. */
export function trackEvent(name: EventName, properties: Properties = {}) {
  if (typeof window === "undefined") return;
  const data: Record<string, string | number> = { event: `alltour_${name}` };
  if (properties.locale) data.locale = properties.locale;
  if (properties.source) data.source = properties.source;
  if (properties.route) data.route = publicRoutes.includes(properties.route) ? properties.route : "/404";
  if (properties.tourId && tours.some((tour) => tour.id === properties.tourId)) data.tour_id = properties.tourId;
  if (Number.isFinite(properties.count)) data.count = properties.count!;
  Object.assign(data, readCampaign());
  const target = window as Window & { dataLayer?: Record<string, string | number>[] };
  (target.dataLayer ||= []).push(data);
  if (target.dataLayer.length > 200) target.dataLayer.splice(0, target.dataLayer.length - 200);
  window.dispatchEvent(new window.CustomEvent("alltour:analytics", { detail: data }));
}
