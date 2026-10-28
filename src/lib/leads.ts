import type { BookingRequestPayload } from "./whatsapp";

export function isLeadCaptureEnabled(): boolean {
  return typeof import.meta !== "undefined" && !!import.meta.env &&
    import.meta.env.VITE_LEAD_CAPTURE !== "false" && (import.meta.env.DEV || import.meta.env.VITE_LEAD_CAPTURE === "true");
}

export async function saveLead(payload: BookingRequestPayload & { mode: "tour" | "consultation"; tourId: string; attribution?: Record<string, string> }, key: string): Promise<string> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json", "Idempotency-Key": key }, body: JSON.stringify(payload), signal: controller.signal });
    const result = await response.json();
    if (!response.ok || typeof result.id !== "string" || !/^AT-\d{8}-[A-F0-9]{8}$/.test(result.id)) throw new Error("Lead was not acknowledged");
    return result.id;
  } finally { clearTimeout(timer); }
}
