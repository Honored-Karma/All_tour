import test from "node:test";
import assert from "node:assert/strict";
import {
  buildWhatsAppBookingUrl,
  formatWhatsAppMessage,
  validateBookingPayload,
} from "./whatsapp";
import {
  computeJourneyState,
  getTargetProgressForDestination,
} from "./journeyMath";
import { tours } from "../data/tours";
import { destinations } from "../data/destinations";
import { realReviews, storyScreenshots } from "../data/reviews";

test("buildWhatsAppBookingUrl creates fallback Almaty greeting when payload is empty", () => {
  const url = buildWhatsAppBookingUrl({ locale: "ru" });
  assert.ok(url.startsWith("https://wa.me/77711434268?text="));
  const decoded = decodeURIComponent(url.split("?text=")[1]);
  assert.equal(
    decoded,
    "Здравствуйте! Хочу подобрать тур с выездом из Алматы. Подскажите актуальные направления и даты."
  );
});

test("formatWhatsAppMessage formats structured tour inquiry in Russian", () => {
  const msg = formatWhatsAppMessage({
    name: "Алия",
    destinationName: "Кыргызстан",
    tourTitle: "Иссык-Куль",
    desiredDate: "15 июля",
    travelersCount: 3,
    comment: "Нужен трансфер",
    locale: "ru",
  });
  assert.ok(msg.includes("Направление: Кыргызстан"));
  assert.ok(msg.includes("Тур: Иссык-Куль"));
  assert.ok(msg.includes("Дата: 15 июля"));
  assert.ok(msg.includes("Количество человек: 3"));
  assert.ok(msg.includes("Имя: Алия"));
  assert.ok(msg.includes("Комментарий: Нужен трансфер"));
});

test("validateBookingPayload catches missing required fields and passes valid input", () => {
  const invalid = validateBookingPayload(
    {
      name: "A",
      destinationId: "",
      desiredDate: "",
      travelersCount: 0,
    },
    "ru"
  );
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.destination);
  assert.ok(invalid.errors.desiredDate);
  assert.ok(invalid.errors.travelersCount);

  const valid = validateBookingPayload(
    {
      name: "Данияр",
      destinationId: "georgia",
      desiredDate: "Август",
      travelersCount: 2,
    },
    "ru"
  );
  assert.equal(valid.valid, true);
  assert.equal(Object.keys(valid.errors).length, 0);
});

test("computeJourneyState transitions smoothly across Kyrgyzstan, Georgia, and China", () => {
  const start = computeJourneyState(0.05);
  assert.equal(start.activeDestinationId, "kyrgyzstan");
  assert.equal(start.sceneWeights.kyrgyzstan, 1);
  assert.equal(start.sceneWeights.georgia, 0);

  const midTransition = computeJourneyState(0.32);
  assert.equal(midTransition.transitionPhase, "transitioning");
  assert.ok(midTransition.sceneWeights.kyrgyzstan > 0);
  assert.ok(midTransition.sceneWeights.georgia > 0);

  const georgia = computeJourneyState(getTargetProgressForDestination("georgia"));
  assert.equal(georgia.activeDestinationId, "georgia");
  assert.equal(georgia.sceneWeights.georgia, 1);

  const china = computeJourneyState(getTargetProgressForDestination("china"));
  assert.equal(china.activeDestinationId, "china");
  assert.equal(china.sceneWeights.china, 1);
});

test("destinations and tours data integrity: 3 countries, no fake prices or dates", () => {
  assert.equal(destinations.length, 3);
  assert.deepEqual(
    destinations.map((d) => d.id),
    ["kyrgyzstan", "georgia", "china"]
  );
  assert.ok(tours.length >= 3);
  for (const tour of tours) {
    assert.equal(tour.status, "on_request");
    assert.equal(tour.priceKzt, undefined);
    assert.equal(tour.departureDates.length, 0);
  }
});

test("realReviews and storyScreenshots contain all 5 uploaded assets and 16 authentic reviews", () => {
  assert.equal(storyScreenshots.length, 5);
  assert.equal(realReviews.length, 16);
  const featured = realReviews.filter((r) => r.featuredOnHome);
  assert.equal(featured.length, 6);
  for (const rev of realReviews) {
    assert.ok(rev.quote.length > 10);
    assert.ok(rev.storyScreenshot.startsWith("/assets/aistudio/image_"));
  }
});

test("strict separation of China programs: Urumqi 6D (145 000 ₸) and China Content 3D (85 000 ₸)", () => {
  const urumqi = tours.find((t) => t.id === "china-urumqi-6d");
  const china3d = tours.find((t) => t.id === "china-content-3d");

  assert.ok(urumqi, "Urumqi 6-day grand tour must exist");
  assert.ok(china3d, "China 3-day content-tour must exist");
  assert.notEqual(urumqi.id, china3d.id);
  assert.equal(urumqi.posterReferencePriceKzt, 145000);
  assert.equal(china3d.posterReferencePriceKzt, 85000);
  assert.ok(urumqi.duration, "Urumqi duration must be specified");
  assert.ok(china3d.duration, "China 3-day duration must be specified");
  assert.ok(urumqi.duration.ru.includes("6 дней / 5 ночей"));
  assert.equal(china3d.duration.ru, "3 дня / 2 ночи");
  assert.ok(urumqi.itinerary.length >= 4);
  assert.ok(china3d.itinerary.length >= 3);
});

test("brand assets manifest: 16 official photos, logo is photo_16", async () => {
  const { BRAND_ASSETS, BRAND_LOGO } = await import("../data/assets");
  assert.equal(BRAND_ASSETS.length, 16);
  assert.equal(BRAND_LOGO.originalJpg, "/assets/brand/photo_16.jpg");
  for (let i = 1; i <= 16; i++) {
    const asset = BRAND_ASSETS.find((a) => a.id === `photo_${i}`);
    assert.ok(asset, `Asset photo_${i} must exist in catalog`);
    assert.equal(asset.src, `/assets/brand/photo_${i}.jpg`);
  }
});

test("formatWhatsAppMessage formats structured tour inquiry in Kazakh", () => {
  const msg = formatWhatsAppMessage({
    name: "Айгерім",
    destinationName: "Қырғызстан",
    tourTitle: "Ыстықкөл",
    desiredDate: "15 шілде",
    travelersCount: 3,
    comment: "Трансфер қажет",
    locale: "kz",
  });
  assert.ok(msg.includes("Бағыт: Қырғызстан"));
  assert.ok(msg.includes("Тур: Ыстықкөл"));
  assert.ok(msg.includes("Күні: 15 шілде"));
  assert.ok(msg.includes("Адам саны: 3"));
  assert.ok(msg.includes("Есімі: Айгерім"));
  assert.ok(msg.includes("Пікір: Трансфер қажет"));
});

test("Kazakh dictionary contains natural required phrasing", async () => {
  const { kz } = await import("../i18n/kz");
  assert.equal(kz.catalog.favoritesFilter, "Таңдаулылар");
  assert.equal(kz.catalog.sort.default, "Әдепкі ретпен");
  assert.equal(kz.catalog.formats.all, "Барлық тур түрлері");
  assert.equal(kz.catalog.formats.mountain_nature, "Тау және көл турлары");
  assert.equal(kz.catalog.formats.cultural_city, "Қалалық және мәдени турлар");
  assert.equal(kz.catalog.openFinder, "Турды жылдам таңдау");
  assert.equal(kz.catalog.hideFinder, "Жылдам таңдауды жасыру");
  assert.equal(kz.catalog.compareSelected, "Таңдалғандарды салыстыру");
  assert.equal(kz.catalog.sort.priceAsc, "Алдымен қолжетімділері");
  assert.equal(kz.catalog.sort.priceDesc, "Алдымен ауқымдылары");
  assert.equal(kz.catalog.resetFilters, "Барлық сүзгілерді тазарту");
});

test("Dictionary parity: all keys in ru exist in kz and have matching non-empty structures", async () => {
  const { ru } = await import("../i18n/ru");
  const { kz } = await import("../i18n/kz");

  function assertParity(rObj: any, kObj: any, path = "") {
    assert.ok(kObj !== undefined, `Missing key in kz: ${path}`);
    if (typeof rObj === "string") {
      assert.equal(typeof kObj, "string", `Type mismatch at ${path}`);
      assert.ok(kObj.trim().length > 0, `Empty string in kz at ${path}`);
    } else if (Array.isArray(rObj)) {
      assert.ok(Array.isArray(kObj), `Array expected at ${path}`);
      assert.equal(rObj.length, kObj.length, `Array length mismatch at ${path}`);
      rObj.forEach((item, idx) => {
        assertParity(item, kObj[idx], `${path}[${idx}]`);
      });
    } else if (typeof rObj === "object" && rObj !== null) {
      assert.equal(typeof kObj, "object", `Object expected at ${path}`);
      for (const key of Object.keys(rObj)) {
        assertParity(rObj[key], kObj[key], `${path}.${key}`);
      }
    }
  }

  assertParity(ru, kz, "root");
});

test("Montserrat typography & Kazakh character glyph support in font file", async () => {
  const fs = await import("node:fs");
  const path = await import("node:path");

  const fontPath = path.resolve("public/fonts/montserrat/Montserrat-Variable.ttf");
  const licensePath = path.resolve("public/fonts/montserrat/OFL.txt");

  assert.ok(fs.existsSync(fontPath), "Montserrat-Variable.ttf must exist in public/fonts/montserrat");
  assert.ok(fs.existsSync(licensePath), "OFL.txt license must exist in public/fonts/montserrat");

  const licenseContent = fs.readFileSync(licensePath, "utf8");
  assert.ok(licenseContent.includes("SIL OPEN FONT LICENSE Version 1.1"), "License must be SIL OFL 1.1");

  // Read TTF cmap table
  const buf = fs.readFileSync(fontPath);
  const numTables = buf.readUInt16BE(4);
  let cmapOffset = 0;
  for (let i = 0; i < numTables; i++) {
    const tag = buf.toString("ascii", 12 + i * 16, 16 + i * 16);
    if (tag === "cmap") {
      cmapOffset = buf.readUInt32BE(12 + i * 16 + 8);
      break;
    }
  }
  assert.ok(cmapOffset > 0, "cmap table must exist");

  const subtableCount = buf.readUInt16BE(cmapOffset + 2);
  let chosenOffset = 0;
  for (let i = 0; i < subtableCount; i++) {
    const offset = cmapOffset + buf.readUInt32BE(cmapOffset + 4 + i * 8 + 4);
    if (buf.readUInt16BE(offset) === 4) { chosenOffset = offset; break; }
  }
  assert.ok(chosenOffset > 0, "Format 4 subtable must exist");

  const segCountX2 = buf.readUInt16BE(chosenOffset + 6);
  const segCount = segCountX2 / 2;
  const endCodeOffset = chosenOffset + 14;
  const startCodeOffset = endCodeOffset + segCountX2 + 2;
  const idDeltaOffset = startCodeOffset + segCountX2;
  const idRangeOffsetOffset = idDeltaOffset + segCountX2;

  function hasGlyph(ch: string): boolean {
    const code = ch.codePointAt(0)!;
    let found = 0;
    for (let s = 0; s < segCount; s++) {
      const start = buf.readUInt16BE(startCodeOffset + s * 2);
      const end = buf.readUInt16BE(endCodeOffset + s * 2);
      if (code >= start && code <= end) {
        const delta = buf.readInt16BE(idDeltaOffset + s * 2);
        const rangeOffset = buf.readUInt16BE(idRangeOffsetOffset + s * 2);
        if (rangeOffset === 0) {
          found = (code + delta) & 0xFFFF;
        } else {
          const glyphAddr = idRangeOffsetOffset + s * 2 + rangeOffset + (code - start) * 2;
          found = buf.readUInt16BE(glyphAddr);
          if (found !== 0) found = (found + delta) & 0xFFFF;
        }
        break;
      }
    }
    return found > 0;
  }

  // 18 Kazakh specific uppercase and lowercase characters + Tenge
  const kazakhChars = ["Ә", "ә", "Ғ", "ғ", "Қ", "қ", "Ң", "ң", "Ө", "ө", "Ү", "ү", "Ұ", "ұ", "Һ", "һ", "І", "і", "₸"];
  for (const ch of kazakhChars) {
    assert.ok(hasGlyph(ch), `Character ${ch} (U+${ch.codePointAt(0)!.toString(16).toUpperCase()}) must be present in Montserrat`);
  }

  // Full verification text from prompt
  const sentence1 = "«Әсем әлемге саяхат. Ғажайып Қытай, Қырғызстан және Грузия. Кең дүниені бірге көрейік! Үлкен әсер, ұмытылмас сапар. Һәм жаңа мүмкіндіктер. Ізгі тілектер!»";
  const sentence2 = "«ALL TOUR — 25 000 ₸ · 1–3 күн»";
  for (const ch of sentence1 + sentence2) {
    assert.ok(hasGlyph(ch), `Character '${ch}' in test sentence must be present in Montserrat`);
  }

  // Verify globals.css and index.html have 0 references to Onest or Unbounded
  const globalsCss = fs.readFileSync(path.resolve("src/styles/globals.css"), "utf8");
  const indexHtml = fs.readFileSync(path.resolve("index.html"), "utf8");
  assert.ok(!globalsCss.includes("Onest"), "globals.css must not contain Onest");
  assert.ok(!globalsCss.includes("Unbounded"), "globals.css must not contain Unbounded");
  assert.ok(!indexHtml.includes("Onest"), "index.html must not contain Onest");
  assert.ok(!indexHtml.includes("Unbounded"), "index.html must not contain Unbounded");
});

