import type { Locale } from "./whatsapp";
import { getPublishedDeparturePrice, getUpcomingDepartures } from "./departures";

export type CurrencyCode = "KZT" | "USD" | "EUR" | "GEL" | "CNY" | "KGS";

export interface CurrencyMetadata {
  code: CurrencyCode;
  symbol: string;
  name: {
    ru: string;
    kz: string;
  };
  nativeLabel: string;
}

export const SUPPORTED_CURRENCIES: CurrencyMetadata[] = [
  {
    code: "KZT",
    symbol: "₸",
    name: {
      ru: "Казахстанский тенге",
      kz: "Қазақстан теңгесі",
    },
    nativeLabel: "Тенге",
  },
  {
    code: "USD",
    symbol: "$",
    name: {
      ru: "Доллар США",
      kz: "АҚШ доллары",
    },
    nativeLabel: "US Dollar",
  },
  {
    code: "EUR",
    symbol: "€",
    name: {
      ru: "Евро",
      kz: "Еуро",
    },
    nativeLabel: "Euro",
  },
  {
    code: "GEL",
    symbol: "₾",
    name: {
      ru: "Грузинский лари",
      kz: "Грузия лариі",
    },
    nativeLabel: "ლარი",
  },
  {
    code: "CNY",
    symbol: "¥",
    name: {
      ru: "Китайский юань",
      kz: "Қытай юані",
    },
    nativeLabel: "人民币",
  },
  {
    code: "KGS",
    symbol: "сом",
    name: {
      ru: "Кыргызский сом",
      kz: "Қырғыз сомы",
    },
    nativeLabel: "Сом",
  },
];

export const CURRENCY_MAP: Record<CurrencyCode, CurrencyMetadata> =
  SUPPORTED_CURRENCIES.reduce((acc, curr) => {
    acc[curr.code] = curr;
    return acc;
  }, {} as Record<CurrencyCode, CurrencyMetadata>);

/**
 * Standard baseline exchange rates relative to 1 KZT.
 * Verified to support all 6 currencies: KZT, USD, EUR, GEL, CNY, KGS.
 */
export const DEFAULT_EXCHANGE_RATES: Record<CurrencyCode, number> = {
  KZT: 1,
  USD: 0.002215,
  EUR: 0.001981,
  GEL: 0.005741,
  CNY: 0.0147,
  KGS: 0.193466,
};

export const ALLTOUR_CURRENCY_STORAGE_KEY = "alltour_selected_currency";

/**
 * Validates that an exchange rates source object supports all 6 required currencies.
 */
export function validateRatesSource(rates: unknown): rates is Record<CurrencyCode, number> {
  if (!rates || typeof rates !== "object") return false;
  const r = rates as Record<string, unknown>;
  const required: CurrencyCode[] = ["KZT", "USD", "EUR", "GEL", "CNY", "KGS"];
  return required.every(
    (code) => typeof r[code] === "number" && Number.isFinite(r[code]) && (r[code] as number) > 0
  );
}

/**
 * Attempts to fetch live rates from open exchange API, ensuring all 6 currencies are supported.
 * Falls back to verified default rates if fetch fails or data is incomplete.
 */
export interface ExchangeRateSnapshot {
  rates: Record<CurrencyCode, number>;
  source: "live" | "fallback";
  updatedAt: string | null;
}

export async function fetchExchangeRateSnapshot(): Promise<ExchangeRateSnapshot> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/KZT", { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    if (data && data.rates && validateRatesSource(data.rates)) {
      return { source: "live", updatedAt: new Date().toISOString(), rates: {
        KZT: 1,
        USD: Number(data.rates.USD),
        EUR: Number(data.rates.EUR),
        GEL: Number(data.rates.GEL),
        CNY: Number(data.rates.CNY),
        KGS: Number(data.rates.KGS),
      } };
    }
  } catch {
    // Graceful fallback to verified default rates
  } finally { clearTimeout(timeout); }
  return { rates: DEFAULT_EXCHANGE_RATES, source: "fallback", updatedAt: null };
}

export async function fetchLiveExchangeRates(): Promise<Record<CurrencyCode, number>> {
  return (await fetchExchangeRateSnapshot()).rates;
}

/**
 * Converts price from source currency to target currency without intermediate rounding.
 * Each price is calculated directly from original source amount and source currency.
 */
export function convertCurrency(
  sourceAmount: number,
  sourceCurrency: CurrencyCode,
  targetCurrency: CurrencyCode,
  rates: Record<CurrencyCode, number> = DEFAULT_EXCHANGE_RATES
): number {
  if (sourceCurrency === targetCurrency) {
    return sourceAmount;
  }
  const sourceRate = rates[sourceCurrency];
  const targetRate = rates[targetCurrency];
  if (!sourceRate || !targetRate) {
    throw new Error(`Missing rate for conversion from ${sourceCurrency} to ${targetCurrency}`);
  }
  // Calculated directly with full float precision, without intermediate rounding
  return (sourceAmount / sourceRate) * targetRate;
}

/**
 * Formats numeric amount to nearest integer with localized thousands separator (e.g. "12 450", "150 000").
 */
export function formatAmountNumber(amount: number, locale: Locale = "ru"): string {
  const intlLocale = locale === "kz" ? "kk-KZ" : "ru-KZ";
  const roundedAmount = Math.round(amount);

  return new Intl.NumberFormat(intlLocale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedAmount);
}

/**
 * Formats currency amount using Intl.NumberFormat:
 * - Rounded to nearest integer without fractional part (0 fraction digits) for all currencies.
 * - Grouped with thousands separators: e.g. "12 450", "150 000".
 * - Non-breaking space keeps amount and currency symbol together without wrapping.
 */
export function formatCurrencyPrice(
  amount: number,
  currency: CurrencyCode,
  locale: Locale = "ru"
): string {
  const formattedNumber = formatAmountNumber(amount, locale);
  const meta = CURRENCY_MAP[currency] || CURRENCY_MAP.KZT;
  // Non-breaking space keeps amount and currency symbol together without line wrap
  return `${formattedNumber}\u00A0${meta.symbol}`;
}

export interface TourPriceResult {
  formatted: string;
  fullFormatted: string;
  amountOnly: string;
  amountText: string;
  currencyCode: CurrencyCode;
  symbol: string;
  prefix: string;
  note: string | null;
  rawConverted: number | null;
  isPosterReference: boolean;
  isConverted: boolean;
}

/**
 * Formats tour price from original KZT values to active currency:
 * - Direct calculation without intermediate rounding.
 * - Converted prices (targetCurrency !== "KZT") include the approximate "≈ " indicator.
 * - Poster reference notes are structured for clean two-tier or dedicated line rendering.
 */
export function formatTourPrice(
  tour: {
    id?: string;
    priceKzt?: number;
    posterReferencePriceKzt?: number;
  },
  targetCurrency: CurrencyCode,
  locale: Locale = "ru",
  rates: Record<CurrencyCode, number> = DEFAULT_EXCHANGE_RATES,
  fallbackText?: string,
  asOf?: string,
): TourPriceResult {
  const isConverted = targetCurrency !== "KZT";
  const approxPrefix = isConverted ? "≈\u00A0" : "";
  const meta = CURRENCY_MAP[targetCurrency] || CURRENCY_MAP.KZT;

  const publishedPrice = getPublishedDeparturePrice(tour.id, asOf);
  const announcement = tour.id ? getUpcomingDepartures(asOf, tour.id)[0] : undefined;
  if (typeof tour.priceKzt !== "number" && announcement && announcement.publishedPriceKzt === null) {
    return formatTourPrice({}, targetCurrency, locale, rates, fallbackText);
  }
  if (typeof tour.priceKzt !== "number" && publishedPrice !== null) {
    const result = formatTourPrice({ priceKzt: publishedPrice }, targetCurrency, locale, rates, fallbackText);
    const note = locale === "kz" ? "Instagram жарияланымындағы баға" : "цена из публикации в Instagram";
    return { ...result, note, fullFormatted: `${result.formatted} (${note})` };
  }

  if (typeof tour.priceKzt === "number") {
    // Calculated directly from original source price with full precision
    const converted = convertCurrency(tour.priceKzt, "KZT", targetCurrency, rates);
    const amountOnly = formatAmountNumber(converted, locale);
    const amountText = `${amountOnly}\u00A0${meta.symbol}`;
    const formatted = `${approxPrefix}${amountText}`;
    return {
      formatted,
      fullFormatted: formatted,
      amountOnly,
      amountText,
      currencyCode: targetCurrency,
      symbol: meta.symbol,
      prefix: approxPrefix,
      note: null,
      rawConverted: converted,
      isPosterReference: false,
      isConverted,
    };
  }

  if (typeof tour.posterReferencePriceKzt === "number") {
    // Calculated directly from original source price with full precision
    const converted = convertCurrency(tour.posterReferencePriceKzt, "KZT", targetCurrency, rates);
    const amountOnly = formatAmountNumber(converted, locale);
    const amountText = `${amountOnly}\u00A0${meta.symbol}`;
    const formatted = `${approxPrefix}${amountText}`;
    const note = locale === "kz" ? "афиша бойынша" : "по афише";
    const fullFormatted = `${formatted} (${note})`;
    return {
      formatted,
      fullFormatted,
      amountOnly,
      amountText,
      currencyCode: targetCurrency,
      symbol: meta.symbol,
      prefix: approxPrefix,
      note,
      rawConverted: converted,
      isPosterReference: true,
      isConverted,
    };
  }

  const fallback = fallbackText || (locale === "kz" ? "Бағасы сұраныс бойынша" : "Стоимость по запросу");
  return {
    formatted: fallback,
    fullFormatted: fallback,
    amountOnly: fallback,
    amountText: fallback,
    currencyCode: targetCurrency,
    symbol: meta.symbol,
    prefix: "",
    note: null,
    rawConverted: null,
    isPosterReference: false,
    isConverted: false,
  };
}

