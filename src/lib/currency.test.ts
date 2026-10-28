import test from "node:test";
import assert from "node:assert/strict";
import {
  type CurrencyCode,
  SUPPORTED_CURRENCIES,
  CURRENCY_MAP,
  DEFAULT_EXCHANGE_RATES,
  validateRatesSource,
  convertCurrency,
  formatCurrencyPrice,
  formatAmountNumber,
  formatTourPrice,
  fetchLiveExchangeRates,
  fetchExchangeRateSnapshot,
  ALLTOUR_CURRENCY_STORAGE_KEY,
} from "./currency";

test("supported currencies: exactly 6 options with KZT default and accurate metadata", () => {
  const codes = SUPPORTED_CURRENCIES.map((c) => c.code);
  assert.equal(codes.length, 6);
  assert.deepEqual(codes, ["KZT", "USD", "EUR", "GEL", "CNY", "KGS"]);

  // Verify KZT is first (default)
  assert.equal(SUPPORTED_CURRENCIES[0].code, "KZT");
  assert.equal(SUPPORTED_CURRENCIES[0].symbol, "₸");

  // Verify all 6 currencies have symbol, localized names (ru, kz)
  const required: CurrencyCode[] = ["KZT", "USD", "EUR", "GEL", "CNY", "KGS"];
  for (const code of required) {
    const meta = CURRENCY_MAP[code];
    assert.ok(meta, `Currency ${code} must exist in CURRENCY_MAP`);
    assert.equal(meta.code, code);
    assert.ok(meta.symbol.length > 0, `${code} must have a symbol`);
    assert.ok(meta.name.ru.length > 0, `${code} must have ru name`);
    assert.ok(meta.name.kz.length > 0, `${code} must have kz name`);
  }

  // Check specific metadata
  assert.equal(CURRENCY_MAP.USD.symbol, "$");
  assert.equal(CURRENCY_MAP.EUR.symbol, "€");
  assert.equal(CURRENCY_MAP.GEL.symbol, "₾");
  assert.equal(CURRENCY_MAP.CNY.symbol, "¥");
  assert.equal(CURRENCY_MAP.KGS.symbol, "сом");
});

test("rates source validator checks all 6 currencies are present and positive", () => {
  // Valid rates with all 6 currencies
  assert.ok(validateRatesSource(DEFAULT_EXCHANGE_RATES));

  // Incomplete rates (missing GEL, CNY, or KGS)
  assert.equal(
    validateRatesSource({
      KZT: 1,
      USD: 0.0022,
      EUR: 0.0019,
    }),
    false
  );

  // Missing KGS
  assert.equal(
    validateRatesSource({
      KZT: 1,
      USD: 0.0022,
      EUR: 0.0019,
      GEL: 0.0057,
      CNY: 0.0147,
    }),
    false
  );

  // Negative or invalid rates
  assert.equal(
    validateRatesSource({
      KZT: 1,
      USD: -0.0022,
      EUR: 0.0019,
      GEL: 0.0057,
      CNY: 0.0147,
      KGS: 0.19,
    }),
    false
  );

  assert.equal(validateRatesSource(null), false);
  assert.equal(validateRatesSource(undefined), false);
  assert.equal(validateRatesSource("string"), false);
});

test("live rates source supports all 6 currencies and resolves successfully", async () => {
  const rates = await fetchLiveExchangeRates();
  assert.ok(validateRatesSource(rates));
  assert.equal(rates.KZT, 1);
  assert.ok(rates.USD > 0);
  assert.ok(rates.EUR > 0);
  assert.ok(rates.GEL > 0);
  assert.ok(rates.CNY > 0);
  assert.ok(rates.KGS > 0);
});

test("convertCurrency calculates from original amount and source currency without intermediate rounding", () => {
  const customRates: Record<CurrencyCode, number> = {
    KZT: 1,
    USD: 0.002,
    EUR: 0.0018,
    GEL: 0.0055,
    CNY: 0.014,
    KGS: 0.19,
  };

  const amountKzt = 145000;

  // Direct conversion from KZT
  const usd = convertCurrency(amountKzt, "KZT", "USD", customRates);
  assert.equal(usd, 290); // 145000 * 0.002

  const eur = convertCurrency(amountKzt, "KZT", "EUR", customRates);
  assert.equal(eur, 261); // 145000 * 0.0018

  const gel = convertCurrency(amountKzt, "KZT", "GEL", customRates);
  assert.equal(gel, 797.5); // 145000 * 0.0055

  const cny = convertCurrency(amountKzt, "KZT", "CNY", customRates);
  assert.equal(cny, 2030); // 145000 * 0.014

  const kgs = convertCurrency(amountKzt, "KZT", "KGS", customRates);
  assert.equal(kgs, 27550); // 145000 * 0.19

  // Return to KZT without rounding loss
  const backToKzt = convertCurrency(usd, "USD", "KZT", customRates);
  assert.equal(backToKzt, amountKzt);

  // Conversion between arbitrary non-KZT currencies (e.g. USD -> GEL)
  // (100 / 0.002) * 0.0055 = 275
  const usdToGel = convertCurrency(100, "USD", "GEL", customRates);
  assert.equal(usdToGel, 275);

  // Same currency identity
  assert.equal(convertCurrency(500, "CNY", "CNY", customRates), 500);
});

test("Intl.NumberFormat formatting: neat integer rounding to nearest whole unit for all currencies without fraction digits", () => {
  // Test prompt examples verbatim:
  // 55,38 $ -> 55 $
  const usd55 = formatCurrencyPrice(55.38, "USD", "ru");
  assert.equal(usd55, "55\u00A0$");

  // 321,18 $ -> 321 $
  const usd321 = formatCurrencyPrice(321.18, "USD", "ru");
  assert.equal(usd321, "321\u00A0$");

  // 188,28 $ -> 188 $
  const usd188 = formatCurrencyPrice(188.28, "USD", "ru");
  assert.equal(usd188, "188\u00A0$");

  // 12 450,67 KGS -> 12 451 со значком сома
  const kgs12451 = formatCurrencyPrice(12450.67, "KGS", "ru");
  assert.ok(
    kgs12451.includes("12") && kgs12451.includes("451") && kgs12451.includes("сом"),
    `KGS must format as '12 451 сом': ${kgs12451}`
  );

  // Thousands separators: 12 450, 150 000
  const kzt150k = formatCurrencyPrice(150000, "KZT", "ru");
  assert.ok(
    kzt150k.includes("150") && kzt150k.includes("000") && kzt150k.includes("₸"),
    `KZT 150 000 must have thousands separator: ${kzt150k}`
  );
  assert.ok(!kzt150k.includes(",00") && !kzt150k.includes(".00"));

  // Check all 6 currencies have zero fraction digits and include non-breaking space
  const allCurrencies: CurrencyCode[] = ["KZT", "USD", "EUR", "GEL", "CNY", "KGS"];
  for (const c of allCurrencies) {
    const formatted = formatCurrencyPrice(12450.67, c, "ru");
    assert.ok(
      !formatted.includes(",") && !formatted.includes(".67") && !formatted.includes(".00"),
      `${c} must NOT contain fraction digits: ${formatted}`
    );
    assert.ok(
      formatted.includes("\u00A0"),
      `${c} must keep amount and symbol together with non-breaking space: ${formatted}`
    );
  }
});

test("formatTourPrice converts prices of tours with approximate prefix for converted currencies and separate note", () => {
  const tourWithPrice = { priceKzt: 145000 };
  const tourWithPosterPrice = { posterReferencePriceKzt: 85000 };
  const tourOnRequest = {};

  const rates: Record<CurrencyCode, number> = {
    KZT: 1,
    USD: 0.002,
    EUR: 0.0018,
    GEL: 0.0055,
    CNY: 0.014,
    KGS: 0.19,
  };

  // 1. Direct price tour in KZT (native): no approx prefix
  const pKzt = formatTourPrice(tourWithPrice, "KZT", "ru", rates);
  assert.equal(pKzt.rawConverted, 145000);
  assert.equal(pKzt.isPosterReference, false);
  assert.equal(pKzt.isConverted, false);
  assert.equal(pKzt.prefix, "");
  assert.equal(pKzt.note, null);
  assert.ok(!pKzt.formatted.includes("≈"));
  assert.ok(pKzt.formatted.includes("145"));

  // 2. Direct price tour converted to USD: has approx prefix "≈ "
  const pUsd = formatTourPrice(tourWithPrice, "USD", "ru", rates);
  assert.equal(pUsd.rawConverted, 290);
  assert.equal(pUsd.isConverted, true);
  assert.ok(pUsd.prefix.includes("≈"));
  assert.ok(pUsd.formatted.includes("≈"));
  assert.ok(pUsd.amountText.includes("290"));
  assert.equal(pUsd.note, null);

  // 3. Poster reference price tour in KZT: has note "по афише", no approx prefix
  const posterKzt = formatTourPrice(tourWithPosterPrice, "KZT", "ru", rates);
  assert.equal(posterKzt.isPosterReference, true);
  assert.equal(posterKzt.isConverted, false);
  assert.equal(posterKzt.prefix, "");
  assert.equal(posterKzt.note, "по афише");
  assert.ok(!posterKzt.formatted.includes("≈"));
  assert.ok(posterKzt.formatted.includes("85"));

  // 4. Poster reference price tour converted to KGS: has approx prefix AND note
  const posterKgs = formatTourPrice(tourWithPosterPrice, "KGS", "ru", rates);
  assert.equal(posterKgs.isPosterReference, true);
  assert.equal(posterKgs.isConverted, true);
  assert.equal(posterKgs.rawConverted, 16150); // 85000 * 0.19
  assert.ok(posterKgs.prefix.includes("≈"));
  assert.ok(posterKgs.formatted.includes("≈"));
  assert.equal(posterKgs.currencyCode, "KGS");
  assert.equal(posterKgs.symbol, "сом");
  assert.ok(posterKgs.amountOnly.includes("16") && posterKgs.amountOnly.includes("150"));
  // amountOnly must NOT contain currency name or symbol, so it can be combined with <SomIcon /> in JSX
  assert.ok(!posterKgs.amountOnly.includes("сом"));
  assert.ok(!posterKgs.amountOnly.includes("KGS"));
  assert.equal(posterKgs.note, "по афише");
  assert.ok(posterKgs.fullFormatted.includes("по афише"));

  // Check formatAmountNumber isolated helper
  const numStr = formatAmountNumber(12450.67, "ru");
  assert.ok(numStr.includes("12") && numStr.includes("451"));
  assert.ok(!numStr.includes("сом") && !numStr.includes("KGS"));

  // In Kazakh locale
  const posterKz = formatTourPrice(tourWithPosterPrice, "KGS", "kz", rates);
  assert.equal(posterKz.note, "афиша бойынша");
  assert.ok(posterKz.fullFormatted.includes("афиша бойынша"));

  // 5. On-request tour
  const req = formatTourPrice(tourOnRequest, "KZT", "ru", rates, "Уточнить стоимость");
  assert.equal(req.formatted, "Уточнить стоимость");
  assert.equal(req.rawConverted, null);
  assert.equal(req.note, null);
});

test("complete switching sequence across all 6 currencies and return to KZT", () => {
  const testTour = { posterReferencePriceKzt: 25000 };
  const sequence: CurrencyCode[] = ["KZT", "USD", "EUR", "GEL", "CNY", "KGS", "KZT"];

  const results = sequence.map((code) => {
    return {
      code,
      result: formatTourPrice(testTour, code, "ru", DEFAULT_EXCHANGE_RATES),
    };
  });

  // Check each currency in sequence
  for (const { code, result } of results) {
    assert.ok(result.rawConverted !== null);
    // Zero fraction digits for ALL currencies
    assert.ok(
      !result.amountText.includes(",") && !result.amountText.includes("."),
      `${code} must have zero fraction digits: ${result.amountText}`
    );

    if (code === "KZT") {
      assert.equal(result.isConverted, false);
      assert.equal(result.prefix, "");
      assert.ok(!result.formatted.includes("≈"));
      assert.ok(result.amountText.includes("₸"));
    } else {
      assert.equal(result.isConverted, true);
      assert.ok(result.prefix.includes("≈"), `${code} must have approx prefix: ${result.prefix}`);
      assert.ok(result.formatted.includes("≈"), `${code} formatted must start with ≈`);
    }
  }

  // Final step in sequence is return to KZT
  const lastStep = results[results.length - 1];
  assert.equal(lastStep.code, "KZT");
  assert.equal(lastStep.result.rawConverted, 25000);
  assert.equal(lastStep.result.isConverted, false);
  assert.equal(lastStep.result.prefix, "");
  assert.ok(lastStep.result.formatted.includes("25"));
  assert.ok(lastStep.result.formatted.includes("₸"));
});

test("large amounts format with thousands separators across all 6 currencies without breaking", () => {
  const largeKztTour = { priceKzt: 1500000 }; // 1.5 million KZT
  const currencies: CurrencyCode[] = ["KZT", "USD", "EUR", "GEL", "CNY", "KGS"];

  for (const curr of currencies) {
    const res = formatTourPrice(largeKztTour, curr, "ru", DEFAULT_EXCHANGE_RATES);
    assert.ok(res.rawConverted !== null && res.rawConverted > 0);
    // Must NOT wrap amount and symbol (has non-breaking space)
    assert.ok(res.amountText.includes("\u00A0"));
    // Must NOT have decimals
    assert.ok(!res.amountText.includes(",") && !res.amountText.includes("."));
  }
});

test("storage key constant is defined", () => {
  assert.equal(ALLTOUR_CURRENCY_STORAGE_KEY, "alltour_selected_currency");
});



test("failed exchange-rate requests remain explicitly marked as fallback", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = (async () => { throw new Error("Offline"); }) as typeof fetch;
  try {
    const snapshot = await fetchExchangeRateSnapshot();
    assert.equal(snapshot.source, "fallback");
    assert.equal(snapshot.updatedAt, null);
    assert.deepEqual(snapshot.rates, DEFAULT_EXCHANGE_RATES);
  } finally { globalThis.fetch = original; }
});

test("an unpriced announced departure cannot inherit the previous campaign price", () => {
  const price = formatTourPrice({ id: "china-content-3d", posterReferencePriceKzt: 85000 }, "KZT", "ru", DEFAULT_EXCHANGE_RATES, "Стоимость по запросу", "2026-10-28");
  assert.equal(price.rawConverted, null);
  assert.equal(price.formatted, "Стоимость по запросу");
  assert.equal(price.isPosterReference, false);
});
