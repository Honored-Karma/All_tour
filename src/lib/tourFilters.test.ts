import test from "node:test";
import assert from "node:assert/strict";
import { tours } from "../data/tours";
import { matchesTourDuration } from "./tourFilters";
import { defaultTourPlan, readTourPlan, writeTourPlan, matchesTourPlan, formatPlanDates, isDateKey } from "./tourPlanner";

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

test("planner links round-trip the trip while preserving language and favorites", () => {
  const plan = { ...defaultTourPlan, destination: "china" as const, tour: "china-urumqi", from: "2099-06-12", to: "2099-06-18", travelers: 7, flexible: true };
  const params = writeTourPlan(plan, new URLSearchParams("lang=kz&favorites=true"));
  assert.deepEqual(readTourPlan(params), plan);
  assert.equal(params.get("lang"), "kz");
  assert.equal(params.get("favorites"), "true");
  assert.equal(writeTourPlan(defaultTourPlan, params).toString(), "lang=kz&favorites=true");
});

test("planner rejects invalid dates, reversed ranges, unrelated tours and traveler counts", () => {
  assert.equal(isDateKey("2099-02-30"), false);
  assert.equal(isDateKey("2100-02-29"), false);
  assert.equal(isDateKey("2104-02-29"), true);
  const invalid = readTourPlan(new URLSearchParams("destination=georgia&tour=china-urumqi&from=2000-01-01&to=2099-01-01&travelers=51&type=unknown"));
  assert.equal(invalid.tour, "");
  assert.equal(invalid.from, "");
  assert.equal(invalid.to, "");
  assert.equal(invalid.travelers, 2);
  assert.equal(invalid.type, "all");
  assert.equal(readTourPlan(new URLSearchParams("from=2099-06-12&to=2099-06-01")).to, "");
});

test("departure period matches confirmed dates and retains unpublished schedules for consultation", () => {
  const plan = { ...defaultTourPlan, from: "2099-06-12", to: "2099-06-18" };
  const tour = { ...tours[0], departureDates: ["2099-06-15"] };
  assert.equal(matchesTourPlan(tour, plan), true);
  assert.equal(matchesTourPlan({ ...tour, departureDates: ["2099-06-10"] }, plan), false);
  assert.equal(matchesTourPlan({ ...tour, departureDates: ["2099-06-10"] }, { ...plan, flexible: true }), true);
  assert.equal(matchesTourPlan({ ...tour, departureDates: ["2099-06-08"] }, { ...plan, flexible: true }), false);
  assert.equal(matchesTourPlan({ ...tour, departureDates: [] }, plan), true);
  for (const locale of ["ru", "kz"] as const) assert.ok(formatPlanDates({ ...plan, flexible: true }, locale).includes("±3"));
});
