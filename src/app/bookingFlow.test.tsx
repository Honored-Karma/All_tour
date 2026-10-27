import test, { before, after, afterEach } from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import type { Root } from "react-dom/client";
import { JSDOM } from "jsdom";
import { ru } from "../i18n/ru";
import { tours } from "../data/tours";
import { formatPlanDates } from "../lib/tourPlanner";

let dom: JSDOM;
let root: Root | undefined;
let createRoot: typeof import("react-dom/client").createRoot;
let App: typeof import("./App").App;
const openedWhatsAppUrls: string[] = [];
const scrolledIds: string[] = [];

before(async () => {
  dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
    pretendToBeVisual: true,
  });
  for (const key of ["window", "document", "navigator", "HTMLElement", "Element", "SVGElement", "MutationObserver", "localStorage", "getComputedStyle"]) {
    Object.defineProperty(globalThis, key, { configurable: true, value: (dom.window as any)[key] });
  }
  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    requestAnimationFrame: dom.window.requestAnimationFrame.bind(dom.window),
    cancelAnimationFrame: dom.window.cancelAnimationFrame.bind(dom.window),
  });
  dom.window.matchMedia = ((query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
    dispatchEvent() { return true; },
  })) as typeof window.matchMedia;
  dom.window.scrollTo = () => {};
  dom.window.HTMLElement.prototype.scrollIntoView = function () { scrolledIds.push(this.id); };
  const clickAnchor = dom.window.HTMLAnchorElement.prototype.click;
  dom.window.HTMLAnchorElement.prototype.click = function () {
    if (this.href.startsWith("https://wa.me/")) openedWhatsAppUrls.push(this.href);
    else clickAnchor.call(this);
  };
  ({ createRoot } = await import("react-dom/client"));
  ({ App } = await import("./App"));
  await Promise.all([
    import("../components/pages/HomePage"),
    import("../components/pages/ToursCatalogPage"),
    import("../components/pages/DestinationPage"),
    import("../components/pages/TourDetailPage"),
    import("../components/pages/ContactsPage"),
    import("../components/pages/AboutPage"),
    import("../components/pages/FAQPage"),
  ]);
});

afterEach(async () => {
  if (root) await act(async () => { root!.unmount(); });
  root = undefined;
});

after(async () => {
  dom.window.close();
});

async function mount(path: string, favorites: string[] = []) {
  dom.window.history.replaceState(null, "", path);
  dom.window.localStorage.clear();
  dom.window.localStorage.setItem("all_tour_favorites_v1", JSON.stringify(favorites));
  document.body.innerHTML = '<div id="root"></div>';
  openedWhatsAppUrls.length = 0;
  scrolledIds.length = 0;
  root = createRoot(document.getElementById("root")!);
  await act(async () => { root!.render(<App />); });
  await settleRoute();
}

async function settleRoute() {
  for (let attempt = 0; document.querySelector('main [role="status"]') && attempt < 100; attempt++) {
    await act(async () => { await new Promise((resolve) => setTimeout(resolve, 10)); });
  }
  assert.equal(document.querySelector('main [role="status"]'), null, "Route should finish loading");
}

function button(text: string, scope: ParentNode = document): HTMLButtonElement {
  const found = Array.from(scope.querySelectorAll("button")).find((item) => item.textContent?.trim() === text);
  assert.ok(found, `Button must exist: ${text}`);
  return found;
}

async function click(element: HTMLElement) {
  await act(async () => { element.click(); });
  await settleRoute();
}

function field(id: string): HTMLInputElement | HTMLSelectElement {
  const element = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null;
  assert.ok(element, `Field must exist: ${id}`);
  return element;
}

async function fill(id: string, value: string) {
  const element = field(id);
  const isSelect = element.tagName === "SELECT";
  const prototype = isSelect ? dom.window.HTMLSelectElement.prototype : dom.window.HTMLInputElement.prototype;
  await act(async () => {
    Object.getOwnPropertyDescriptor(prototype, "value")!.set!.call(element, value);
    element.dispatchEvent(new dom.window.Event(isSelect ? "change" : "input", { bubbles: true }));
  });
}

async function submitBooking() {
  const form = document.querySelector("#booking form");
  assert.ok(form);
  await act(async () => { form.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true })); });
}

test("catalog booking selects the correct country and tour, surviving a reload", async () => {
  await mount("/tours");
  const card = document.querySelector('[data-testid="tour-card-china-content-3d"]');
  assert.ok(card);
  await click(button(ru.tours.card.bookBtn, card));
  assert.equal(dom.window.location.pathname, "/contacts");
  assert.equal(dom.window.location.hash, "#booking");
  assert.equal(field("booking-country").value, "china");
  assert.equal(field("booking-tour").value, "china-content-3d");
  await act(async () => { await new Promise<void>((resolve) => dom.window.requestAnimationFrame(() => resolve())); });
  assert.ok(scrolledIds.includes("booking"));
  const savedPath = dom.window.location.pathname + dom.window.location.search + dom.window.location.hash;
  await act(async () => { root!.unmount(); });
  root = undefined;
  await mount(savedPath);
  assert.equal(field("booking-tour").value, "china-content-3d");
});

test("home introduces the service without duplicating dedicated pages", async () => {
  await mount("/");
  assert.ok(document.getElementById("service"));
  assert.ok(document.querySelector('main a[href="/tours"]'));
  assert.ok(document.querySelector('main a[href="/about"]'));
  assert.equal(document.querySelector('[data-testid^="tour-card-"]'), null);
  assert.equal(document.querySelector("main form"), null);
  assert.equal(document.getElementById("journey"), null);
  assert.equal(document.getElementById("faq"), null);
  assert.equal(document.querySelector("main blockquote"), null);
  await click(button(ru.hero.exploreCta));
  assert.ok(scrolledIds.includes("tour-planner"));
});

test("legacy home booking links redirect to contacts with the chosen tour", async () => {
  await mount("/?lang=ru&tour=china-urumqi#booking");
  assert.equal(dom.window.location.pathname, "/contacts");
  assert.equal(dom.window.location.hash, "#booking");
  assert.equal(new URLSearchParams(dom.window.location.search).get("tour"), "china-urumqi");
  assert.equal(field("booking-tour").value, "china-urumqi-6d");
  assert.equal(field("booking-country").value, "china");
});

test("country page booking carries the selected tour to the shared form", async () => {
  await mount("/destinations/georgia");
  const georgiaTour = tours.find((tour) => tour.destinationId === "georgia")!;
  const georgiaCard = document.querySelector(`[data-testid="tour-card-${georgiaTour.id}"]`);
  assert.ok(georgiaCard);
  await click(button(ru.tours.card.bookBtn, georgiaCard));
  assert.equal(field("booking-country").value, "georgia");
  assert.equal(field("booking-tour").value, georgiaTour.id);
});

test("favorites link filters the catalog and toggling updates the URL", async () => {
  await mount("/tours", ["china-content-3d"]);
  const link = document.querySelector('header a[href="/tours?favorites=true"]');
  assert.ok(link);
  await click(link as HTMLElement);
  assert.equal(document.querySelectorAll('[data-testid^="tour-card-"]').length, 1);
  assert.ok(document.querySelector('[data-testid="tour-card-china-content-3d"]'));
  const favoritesButton = document.querySelector('button[aria-pressed="true"]');
  assert.ok(favoritesButton);
  await click(favoritesButton as HTMLElement);
  assert.equal(dom.window.location.search, "");
  assert.equal(document.querySelectorAll('[data-testid^="tour-card-"]').length, tours.length);
});

test("visible trip planner filters the same catalog by confirmed durations", async () => {
  await mount("/tours");
  assert.ok(document.getElementById("tour-planner"));
  await click(button(ru.planner.settings));
  await fill("finder-duration", "multi");
  assert.equal(document.querySelectorAll('[data-testid^="tour-card-"]').length, 1);
  assert.ok(document.querySelector('[data-testid="tour-card-china-urumqi-6d"]'));
  assert.equal(new URLSearchParams(dom.window.location.search).get("duration"), "multi");
});

test("home planner transfers selection into the catalog, details and booking message", async () => {
  await mount("/");
  await fill("finder-destination", "china");
  await fill("finder-tour", "china-content-3d");
  await fill("finder-travelers", "7");
  await click(button(ru.planner.showTours));
  assert.equal(dom.window.location.pathname, "/tours");
  assert.equal(dom.window.location.hash, "#tour-results");
  assert.equal(document.querySelectorAll('[data-testid^="tour-card-"]').length, 1);
  assert.equal(field("finder-tour").value, "china-content-3d");
  const details = document.querySelector('[data-testid="tour-card-china-content-3d"] a') as HTMLAnchorElement;
  assert.ok(details);
  await click(details);
  assert.equal(field("booking-travelers").value, "7");
  await fill("booking-name", "Алия");
  await fill("booking-date", "Июнь 2099");
  await submitBooking();
  assert.match(new URL(openedWhatsAppUrls[0]).searchParams.get("text")!, /Количество человек: 7/);
});

test("calendar selects a departure period, preserves focus and transfers dates to booking", async () => {
  await mount("/tours?destination=china&from=2099-06-12&travelers=4");
  await click(document.querySelector('.planner-date-trigger') as HTMLElement);
  const endDay = document.querySelector('[data-day="2099-06-18"]') as HTMLElement;
  assert.ok(endDay);
  await click(endDay);
  assert.equal(new URLSearchParams(dom.window.location.search).get("to"), "2099-06-18");
  const flexible = document.querySelector('#travel-calendar input[type="checkbox"]') as HTMLElement;
  await click(flexible);
  const inquiry = document.querySelector('.planner-consultation') as HTMLAnchorElement;
  const text = new URL(inquiry.href).searchParams.get("text")!;
  const desiredDate = formatPlanDates({ from: "2099-06-12", to: "2099-06-18", flexible: true }, "ru");
  assert.ok(text.includes(desiredDate));
  assert.match(text, /Количество человек: 4/);
  await act(async () => { endDay.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
  assert.equal(document.getElementById("travel-calendar"), null);
  assert.equal(document.activeElement, document.querySelector('.planner-date-trigger'));
  const card = document.querySelector('[data-testid="tour-card-china-content-3d"]')!;
  await click(button(ru.tours.card.bookBtn, card));
  assert.equal(field("booking-date").value, desiredDate);
  assert.equal(field("booking-travelers").value, "4");
  const path = dom.window.location.pathname + dom.window.location.search + dom.window.location.hash;
  await act(async () => { root!.unmount(); });
  root = undefined;
  await mount(path);
  assert.equal(field("booking-date").value, desiredDate);
  assert.equal(field("booking-travelers").value, "4");
});

test("tour detail form rejects incomplete requests and formats the chosen tour", async () => {
  await mount("/tours/china-content-3d");
  assert.equal(field("booking-tour").value, "china-content-3d");
  await submitBooking();
  assert.ok(document.querySelector('[role="alert"]'));
  assert.equal(openedWhatsAppUrls.length, 0);
  await fill("booking-name", "Алия");
  await fill("booking-date", "Қараша айы");
  await fill("booking-travelers", "3");
  await submitBooking();
  assert.equal(document.querySelector('[role="alert"]'), null);
  assert.equal(openedWhatsAppUrls.length, 1);
  const message = new URL(openedWhatsAppUrls[0]).searchParams.get("text")!;
  assert.match(message, /Имя: Алия/);
  assert.match(message, /Дата: Қараша айы/);
  assert.match(message, /Количество человек: 3/);
  const tour = tours.find((item) => item.id === "china-content-3d")!;
  assert.ok(message.includes(tour.title.ru));
});

test("language choice persists in localStorage and updates html lang attribute", async () => {
  await mount("/tours");
  assert.equal(document.documentElement.lang, "ru");

  // Header shows language button
  const langBtn = document.querySelector('header button[aria-label="Переключить язык (RU / KZ)"]') as HTMLButtonElement;
  assert.ok(langBtn, "Language button with ru aria-label must exist");

  // Click to switch to KZ
  await click(langBtn);
  assert.equal(document.documentElement.lang, "kk");
  assert.equal(dom.window.localStorage.getItem("alltour_locale"), "kz");

  // Click to switch back to RU
  await click(langBtn);
  assert.equal(document.documentElement.lang, "ru");
  assert.equal(dom.window.localStorage.getItem("alltour_locale"), "ru");
});

test("TourCard updates aria-label when toggled to favorite (accessibility parity)", async () => {
  await mount("/tours");
  const firstCard = document.querySelector('[data-testid^="tour-card-"]')!;
  assert.ok(firstCard);
  const favBtn = firstCard.querySelector('button[aria-label="Добавить в избранное"]') as HTMLButtonElement;
  assert.ok(favBtn, "Card favorite button should start with Добавить в избранное");
  await click(favBtn);
  assert.equal(favBtn.getAttribute("aria-label"), "В избранном");
});

test("FAQPage buttons include aria-expanded and aria-controls for screen readers", async () => {
  await mount("/faq");
  const faqButtons = Array.from(document.querySelectorAll('main button[aria-expanded]')) as HTMLButtonElement[];
  assert.ok(faqButtons.length > 0, "FAQPage buttons must have aria-expanded");
  assert.equal(faqButtons[0].getAttribute("aria-expanded"), "true");
  assert.ok(faqButtons[0].getAttribute("aria-controls"), "FAQ button must have aria-controls");
  await click(faqButtons[0]);
  assert.equal(faqButtons[0].getAttribute("aria-expanded"), "false");
});

test("switching to RU on /tours?lang=kz and toggling favorites retains RU on reload", async () => {
  await mount("/tours?lang=kz");
  assert.equal(document.documentElement.lang, "kk");

  // Switch to RU
  const langBtn = document.querySelector('header button[aria-label="Тілді ауыстыру (RU / KZ)"]') as HTMLButtonElement;
  assert.ok(langBtn);
  await click(langBtn);
  assert.equal(document.documentElement.lang, "ru");
  assert.match(dom.window.location.search, /lang=ru/);

  // Toggle favorites in catalog
  const favFilterBtn = Array.from(document.querySelectorAll("button")).find(
    (b) => b.textContent?.includes("Избранное")
  ) as HTMLButtonElement;
  assert.ok(favFilterBtn);
  await click(favFilterBtn);
  assert.match(dom.window.location.search, /favorites=true/);
  assert.match(dom.window.location.search, /lang=ru/);

  // Simulate reload (remount with current URL)
  await act(async () => {
    root!.unmount();
    document.body.innerHTML = '<div id="root"></div>';
    root = createRoot(document.getElementById("root")!);
    root.render(<App />);
  });

  assert.equal(document.documentElement.lang, "ru");
  assert.match(dom.window.location.search, /lang=ru/);
  assert.match(dom.window.location.search, /favorites=true/);
});

test("lang, favorites, tour and hash parameters are fully preserved when language is toggled", async () => {
  await mount("/?lang=kz&favorites=true&tour=china-urumqi#booking");
  assert.equal(document.documentElement.lang, "kk");
  assert.equal(dom.window.location.hash, "#booking");

  const langBtn = document.querySelector('header button[aria-label="Тілді ауыстыру (RU / KZ)"]') as HTMLButtonElement;
  assert.ok(langBtn);
  await click(langBtn);

  assert.equal(document.documentElement.lang, "ru");
  assert.equal(dom.window.location.pathname, "/contacts");
  assert.equal(dom.window.location.hash, "#booking");

  const params = new URLSearchParams(dom.window.location.search);
  assert.equal(params.get("lang"), "ru");
  assert.equal(params.get("favorites"), "true");
  assert.equal(params.get("tour"), "china-urumqi");
});

test("browser back and forward restore matching language without loops", async () => {
  await mount("/tours?lang=kz");
  assert.equal(document.documentElement.lang, "kk");

  const langBtn = document.querySelector('header button[aria-label="Тілді ауыстыру (RU / KZ)"]') as HTMLButtonElement;
  assert.ok(langBtn);
  await click(langBtn);
  assert.equal(document.documentElement.lang, "ru");

  // Push new location with kz
  dom.window.history.pushState(null, "", "/about?lang=kz");
  await act(async () => {
    dom.window.dispatchEvent(new dom.window.PopStateEvent("popstate"));
  });
  assert.equal(document.documentElement.lang, "kk");

  // Push another location with ru
  dom.window.history.pushState(null, "", "/about?lang=ru");
  await act(async () => {
    dom.window.dispatchEvent(new dom.window.PopStateEvent("popstate"));
  });
  assert.equal(document.documentElement.lang, "ru");
});

test("language and URL update gracefully even if localStorage throws an error", async () => {
  await mount("/tours?lang=kz");
  assert.equal(document.documentElement.lang, "kk");

  const originalSet = dom.window.localStorage.setItem;
  dom.window.localStorage.setItem = () => {
    throw new Error("SecurityError: Access to localStorage is denied");
  };

  try {
    const langBtn = document.querySelector('header button[aria-label="Тілді ауыстыру (RU / KZ)"]') as HTMLButtonElement;
    assert.ok(langBtn);
    await click(langBtn);

    assert.equal(document.documentElement.lang, "ru");
    assert.match(dom.window.location.search, /lang=ru/);
  } finally {
    dom.window.localStorage.setItem = originalSet;
  }
});

test("booking carries current language parameter to booking form in both KZ and RU modes", async () => {
  // Test KZ mode
  await mount("/tours?lang=kz");
  const cardKZ = document.querySelector('[data-testid="tour-card-china-content-3d"]')!;
  const bookBtnKZ = Array.from(cardKZ.querySelectorAll("button")).find(b => b.textContent?.includes("Брондау"))!;
  await click(bookBtnKZ);
  assert.match(dom.window.location.search, /lang=kz/);
  assert.match(dom.window.location.search, /tour=china-content-3d/);
  assert.equal(dom.window.location.hash, "#booking");

  // Test RU mode
  await mount("/tours?lang=ru");
  const cardRU = document.querySelector('[data-testid="tour-card-china-content-3d"]')!;
  const bookBtnRU = Array.from(cardRU.querySelectorAll("button")).find(b => b.textContent?.includes("Забронировать"))!;
  await click(bookBtnRU);
  assert.match(dom.window.location.search, /lang=ru/);
  assert.match(dom.window.location.search, /tour=china-content-3d/);
  assert.equal(dom.window.location.hash, "#booking");
});
