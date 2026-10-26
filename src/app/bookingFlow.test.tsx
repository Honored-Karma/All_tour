import test, { before, after, afterEach } from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import type { Root } from "react-dom/client";
import { JSDOM } from "jsdom";
import { ru } from "../i18n/ru";
import { tours } from "../data/tours";

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
});

afterEach(async () => {
  if (root) await act(async () => { root!.unmount(); });
  root = undefined;
});

after(async () => {
  const { default: gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  ScrollTrigger.killAll();
  ScrollTrigger.disable();
  gsap.ticker.sleep();
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
}

function button(text: string, scope: ParentNode = document): HTMLButtonElement {
  const found = Array.from(scope.querySelectorAll("button")).find((item) => item.textContent?.trim() === text);
  assert.ok(found, `Button must exist: ${text}`);
  return found;
}

async function click(element: HTMLElement) {
  await act(async () => { element.click(); });
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
  assert.equal(dom.window.location.pathname, "/");
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

test("home preview closes and opens the booking form with the chosen tour", async () => {
  await mount("/");
  const card = document.querySelector('[data-testid="tour-card-china-urumqi-6d"]');
  assert.ok(card);
  await click(button(ru.tours.card.detailsBtn, card));
  const dialog = document.querySelector('[role="dialog"]');
  assert.ok(dialog);
  await click(button(ru.tours.modal.fillFormCta, dialog));
  assert.equal(document.querySelector('[role="dialog"]'), null);
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

test("Smart Tour Finder renders only confirmed matching durations", async () => {
  await mount("/tours");
  await click(button("Открыть Smart Tour Finder"));
  await fill("finder-duration", "multi");
  const finder = document.getElementById("finder-duration")!.closest(".liquid-glass-panel");
  assert.ok(finder);
  assert.match(finder.textContent!, /Подходит: 1 предложений/);
  assert.equal(finder.querySelectorAll('a[href="/tours/china-urumqi"]').length, 1);
  assert.equal(finder.querySelectorAll('a[href="/tours/china-content-3d"]').length, 0);
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
