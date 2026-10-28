import test from "node:test";
import assert from "node:assert/strict";
import { getUpcomingDepartures, getPublishedDeparturePrice, departures, localToday, formatDepartureDates } from "./departures";
import { compareTourPrices } from "./tourFilters";
import { tours } from "../data/tours";

test("announcements exclude departed trips and automatically expire", () => {
  assert.deepEqual(getUpcomingDepartures("2026-10-28").map((item) => item.id), ["kg-2026-10-31", "yining-2026-11-06"]);
  assert.equal(getUpcomingDepartures("2026-11-07").length, 0);
  assert.equal(localToday(new Date("2026-10-27T19:30:00Z")), "2026-10-28");
  assert.equal(formatDepartureDates({ startDate: "2026-11-06", endDate: "2026-11-08" }, "kz"), "6 қараша 2026 ж. — 8 қараша 2026 ж.");
});

test("prices belong to departures and are never inherited from expired promotions", () => {
  assert.equal(getPublishedDeparturePrice("kyrgyzstan-content-tour", "2026-10-28"), 25000);
  assert.equal(getPublishedDeparturePrice("kyrgyzstan-content-tour", "2026-11-01"), null);
  assert.equal(getPublishedDeparturePrice("china-content-3d", "2026-10-28"), null);
  assert.equal(getPublishedDeparturePrice("china-urumqi-6d", "2026-10-28"), null);
});

test("every published departure has a known tour, valid range and evidence", () => {
  for (const item of departures) {
    assert.ok(tours.some((tour) => tour.id === item.tourId));
    assert.ok(item.endDate >= item.startDate);
    assert.match(item.sourceUrl, /^https:\/\/www\.instagram\.com\//);
    assert.ok(item.checkedAt);
    assert.ok(item.publishedPriceKzt === null || item.publishedPriceKzt > 0);
  }
});

test("sorting uses current prices first and keeps missing prices last in either direction", () => {
  const current = { priceKzt: 100, posterReferencePriceKzt: 1000 };
  const reference = { posterReferencePriceKzt: 200 };
  assert.ok(compareTourPrices(current, reference, "asc") < 0);
  assert.ok(compareTourPrices(current, reference, "desc") > 0);
  assert.ok(compareTourPrices({}, current, "asc") > 0);
  assert.ok(compareTourPrices({}, current, "desc") > 0);
});
