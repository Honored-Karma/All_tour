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

