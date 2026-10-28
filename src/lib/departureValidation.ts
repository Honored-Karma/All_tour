import { localToday, type TourDeparture } from "./departures";

const isDate = (value: unknown): value is string => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

export function validateDepartureRecords(input: unknown, knownTours: Set<string>, today = localToday()): { records: TourDeparture[]; errors: string[] } {
  const errors: string[] = [];
  const records: TourDeparture[] = [];
  if (!Array.isArray(input) || input.length > 500) return { records, errors: ["Ожидается список не более чем из 500 выездов."] };
  const ids = new Set<string>();
  input.forEach((value, index) => {
    const label = `Выезд ${index + 1}`;
    if (!value || typeof value !== "object" || Array.isArray(value)) { errors.push(`${label}: неверный формат.`); return; }
    const item = value as Record<string, unknown>;
    if (typeof item.id !== "string" || !/^[a-zA-Z0-9_-]{1,100}$/.test(item.id) || ids.has(item.id)) errors.push(`${label}: нужен уникальный идентификатор.`);
    ids.add(String(item.id));
    if (typeof item.tourId !== "string" || !knownTours.has(item.tourId)) errors.push(`${label}: выберите тур из каталога.`);
    if (!isDate(item.startDate) || !isDate(item.endDate) || item.endDate < item.startDate) errors.push(`${label}: проверьте начало и конец поездки.`);
    if (!isDate(item.checkedAt) || item.checkedAt > today) errors.push(`${label}: дата проверки не может быть в будущем.`);
    if (item.sourcePublishedAt !== null && (!isDate(item.sourcePublishedAt) || String(item.sourcePublishedAt) > String(item.checkedAt))) errors.push(`${label}: проверьте дату публикации.`);
    if (item.publishedPriceKzt !== null && (typeof item.publishedPriceKzt !== "number" || !Number.isSafeInteger(item.publishedPriceKzt) || item.publishedPriceKzt <= 0)) errors.push(`${label}: укажите положительную цену в тенге или оставьте поле пустым.`);
    if (!["announced", "sold_out", "cancelled"].includes(String(item.status))) errors.push(`${label}: неизвестный статус.`);
    try {
      const url = new URL(String(item.sourceUrl));
      if (url.protocol !== "https:" || url.username || url.password || !["instagram.com", "www.instagram.com", "t.me"].includes(url.hostname)) throw new Error();
    } catch { errors.push(`${label}: нужна HTTPS-ссылка на источник в Instagram или Telegram.`); }
    records.push({ id: String(item.id), tourId: String(item.tourId), startDate: String(item.startDate), endDate: String(item.endDate), publishedPriceKzt: item.publishedPriceKzt as number | null, status: item.status as TourDeparture["status"], sourceUrl: String(item.sourceUrl), sourcePublishedAt: item.sourcePublishedAt as string | null, checkedAt: String(item.checkedAt) });
  });
  return { records, errors };
}
