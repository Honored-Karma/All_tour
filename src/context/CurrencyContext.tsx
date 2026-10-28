import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { Locale } from "../lib/whatsapp";
import {
  type CurrencyCode,
  type TourPriceResult,
  SUPPORTED_CURRENCIES,
  DEFAULT_EXCHANGE_RATES,
  ALLTOUR_CURRENCY_STORAGE_KEY,
  fetchExchangeRateSnapshot,
  convertCurrency,
  formatCurrencyPrice,
  formatTourPrice as formatTourPriceUtil,
} from "../lib/currency";

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  rates: Record<CurrencyCode, number>;
  isLiveRates: boolean;
  locale: Locale;
  formatPrice: (amount: number, from?: CurrencyCode) => string;
  formatTourPrice: (
    tour: {
      priceKzt?: number;
      posterReferencePriceKzt?: number;
    },
    fallbackText?: string
  ) => TourPriceResult;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function getInitialCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "KZT";
  try {
    const saved = localStorage.getItem(ALLTOUR_CURRENCY_STORAGE_KEY);
    if (
      saved &&
      SUPPORTED_CURRENCIES.some((c) => c.code === saved)
    ) {
      return saved as CurrencyCode;
    }
  } catch {
    // Ignore storage errors
  }
  return "KZT";
}

interface CurrencyProviderProps {
  children: React.ReactNode;
  locale?: Locale;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
  locale = "ru",
}) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(getInitialCurrency);
  const [rates, setRates] =
    useState<Record<CurrencyCode, number>>(DEFAULT_EXCHANGE_RATES);
  const [isLiveRates, setIsLiveRates] = useState<boolean>(false);

  // Fetch live rates on mount to update if network is available
  useEffect(() => {
    let mounted = true;
    fetchExchangeRateSnapshot()
      .then((snapshot) => {
        if (mounted) {
          setRates(snapshot.rates);
          setIsLiveRates(snapshot.source === "live");
        }
      })
      .catch(() => {
        // Keeps verified fallback rates
      });
    return () => {
      mounted = false;
    };
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem(ALLTOUR_CURRENCY_STORAGE_KEY, code);
    } catch {
      // Ignore storage errors
    }
  }, []);

  const formatPrice = useCallback(
    (amount: number, from: CurrencyCode = "KZT") => {
      // Direct conversion without intermediate rounding
      const converted = convertCurrency(amount, from, currency, rates);
      return formatCurrencyPrice(converted, currency, locale);
    },
    [currency, rates, locale]
  );

  const formatTourPrice = useCallback(
    (
      tour: { priceKzt?: number; posterReferencePriceKzt?: number },
      fallbackText?: string
    ) => {
      return formatTourPriceUtil(tour, currency, locale, rates, fallbackText);
    },
    [currency, locale, rates]
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      rates,
      isLiveRates,
      locale,
      formatPrice,
      formatTourPrice,
    }),
    [currency, setCurrency, rates, isLiveRates, locale, formatPrice, formatTourPrice]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

const DEFAULT_CURRENCY_CONTEXT_VALUE: CurrencyContextValue = {
  currency: "KZT",
  setCurrency: () => {},
  rates: DEFAULT_EXCHANGE_RATES,
  isLiveRates: false,
  locale: "ru",
  formatPrice: (amount: number, from: CurrencyCode = "KZT") => {
    const converted = convertCurrency(amount, from, "KZT", DEFAULT_EXCHANGE_RATES);
    return formatCurrencyPrice(converted, "KZT", "ru");
  },
  formatTourPrice: (tour, fallbackText) => {
    return formatTourPriceUtil(tour, "KZT", "ru", DEFAULT_EXCHANGE_RATES, fallbackText);
  },
};

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  return ctx || DEFAULT_CURRENCY_CONTEXT_VALUE;
}

