import { businessConfig } from "../config/business";
import type { DestinationId } from "../data/destinations";

export type Locale = "ru" | "kz";

export interface BookingRequestPayload {
  name: string;
  destinationName?: string;
  destinationId?: DestinationId | "";
  tourTitle?: string;
  desiredDate: string;
  travelersCount: number | string;
  comment?: string;
  locale?: Locale;
}

export interface BookingValidationResult {
  valid: boolean;
  errors: {
    name?: string;
    destination?: string;
    desiredDate?: string;
    travelersCount?: string;
  };
}

export function validateBookingPayload(
  payload: BookingRequestPayload,
  locale: Locale = "ru"
): BookingValidationResult {
  const errors: BookingValidationResult["errors"] = {};

  const trimmedName = payload.name.trim();
  if (!trimmedName || trimmedName.length < 2) {
    errors.name =
      locale === "ru"
        ? "Укажите ваше имя (минимум 2 символа)"
        : "Атыңызды енгізіңіз (кемінде 2 таңба)";
  }

  if (!payload.destinationId && !payload.destinationName) {
    errors.destination =
      locale === "ru"
        ? "Выберите страну направления"
        : "Бағыт елін таңдаңыз";
  }

  const trimmedDate = payload.desiredDate.trim();
  if (!trimmedDate) {
    errors.desiredDate =
      locale === "ru"
        ? "Укажите желаемую дату или период поездки"
        : "Қалаған күнді немесе сапар кезеңін көрсетіңіз";
  }

  const countNum = Number(payload.travelersCount);
  if (!Number.isFinite(countNum) || countNum < 1 || countNum > 50) {
    errors.travelersCount =
      locale === "ru"
        ? "Укажите количество путешественников (от 1 до 50)"
        : "Саяхатшылар санын көрсетіңіз (1-ден 50-ге дейін)";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export function formatWhatsAppMessage(payload?: Partial<BookingRequestPayload>): string {
  const locale = payload?.locale || "ru";

  if (!payload || (!payload.destinationName && !payload.tourTitle && !payload.name)) {
    return locale === "ru"
      ? "Здравствуйте! Хочу подобрать тур с выездом из Алматы. Подскажите актуальные направления и даты."
      : "Сәлеметсіз бе! Алматыдан шығатын тур таңдағым келеді. Өзекті бағыттар мен күндерді айтып жібересіз бе?";
  }

  const lines: string[] = [];

  if (locale === "kz") {
    lines.push(`Сәлеметсіз бе! ${businessConfig.brandName} туры бойынша білгім келеді.`);
    lines.push("");
    if (payload.destinationName) {
      lines.push(`Бағыт: ${payload.destinationName}`);
    }
    if (payload.tourTitle) {
      lines.push(`Тур: ${payload.tourTitle}`);
    }
    if (payload.desiredDate?.trim()) {
      lines.push(`Күні: ${payload.desiredDate.trim()}`);
    }
    if (payload.travelersCount) {
      lines.push(`Адам саны: ${payload.travelersCount}`);
    }
    if (payload.name?.trim()) {
      lines.push(`Есімі: ${payload.name.trim()}`);
    }
    if (payload.comment?.trim()) {
      lines.push(`Пікір: ${payload.comment.trim()}`);
    }
    lines.push("");
    lines.push("Бос орындар мен өзекті бағаны айтып жібересіз бе?");
  } else {
    lines.push(`Здравствуйте! Хочу узнать о туре ${businessConfig.brandName}.`);
    lines.push("");
    if (payload.destinationName) {
      lines.push(`Направление: ${payload.destinationName}`);
    }
    if (payload.tourTitle) {
      lines.push(`Тур: ${payload.tourTitle}`);
    }
    if (payload.desiredDate?.trim()) {
      lines.push(`Дата: ${payload.desiredDate.trim()}`);
    }
    if (payload.travelersCount) {
      lines.push(`Количество человек: ${payload.travelersCount}`);
    }
    if (payload.name?.trim()) {
      lines.push(`Имя: ${payload.name.trim()}`);
    }
    if (payload.comment?.trim()) {
      lines.push(`Комментарий: ${payload.comment.trim()}`);
    }
    lines.push("");
    lines.push("Подскажите, пожалуйста, наличие мест и актуальную стоимость.");
  }

  return lines.join("\n");
}

export function buildWhatsAppBookingUrl(
  payload?: Partial<BookingRequestPayload>,
  customPhone?: string
): string {
  const cleanPhone = (customPhone || businessConfig.whatsappNumber).replace(/[^\d]/g, "");
  const message = formatWhatsAppMessage(payload);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export const generateWhatsAppBookingLink = buildWhatsAppBookingUrl;

