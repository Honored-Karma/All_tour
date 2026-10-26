import test from "node:test";
import assert from "node:assert/strict";
import { tours } from "../data/tours";
import { matchesTourDuration } from "./tourFilters";

test("short trips include the 1-day and 3-day programs, excluding unknown durations", () => {
  assert.deepEqual(
    tours.filter((tour) => matchesTourDuration(tour, "short")).map((tour) => tour.slug),
    ["kyrgyzstan-content-tour", "china-content-3d"],
  );
});

test("5–6 day filter excludes the 3-day China program", () => {
  assert.deepEqual(
    tours.filter((tour) => matchesTourDuration(tour, "multi")).map((tour) => tour.slug),
    ["china-urumqi"],
  );
  for (const days of [5, 6]) assert.equal(matchesTourDuration({ durationDays: days }, "multi"), true);
  for (const days of [1, 3, 4, 7]) assert.equal(matchesTourDuration({ durationDays: days }, "multi"), false);
});

test("unknown and invalid durations remain in all tours but never get guessed", () => {
  for (const days of [undefined, 0, -1, 2.5, NaN, Infinity]) {
    const tour = { durationDays: days };
    assert.equal(matchesTourDuration(tour, "all"), true);
    assert.equal(matchesTourDuration(tour, "short"), false);
    assert.equal(matchesTourDuration(tour, "multi"), false);
  }
  assert.equal(tours.filter((tour) => matchesTourDuration(tour, "all")).length, tours.length);
});
