import test from "node:test";
import assert from "node:assert/strict";
import { validateDepartureRecords } from "./departureValidation";
import { departures } from "./departures";
import { tours } from "../data/tours";

const known = new Set(tours.map((tour) => tour.id));
test("editor accepts source-backed content and rejects impossible dates and unsafe sources", () => {
  assert.deepEqual(validateDepartureRecords(departures, known, "2026-10-28").errors, []);
  for (const override of [{ startDate: "2026-99-99" }, { endDate: "2026-01-01" }, { checkedAt: "2099-01-01" }, { sourceUrl: "javascript:alert(1)" }, { publishedPriceKzt: -1 }, { tourId: "invented" }]) {
    assert.ok(validateDepartureRecords([{ ...departures[0], ...override }], known, "2026-10-28").errors.length);
  }
  assert.ok(validateDepartureRecords([departures[0], departures[0]], known, "2026-10-28").errors.length);
  assert.ok(validateDepartureRecords(null, known, "2026-10-28").errors.length);
});
