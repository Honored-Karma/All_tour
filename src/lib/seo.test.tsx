import test, { before, after, afterEach } from "node:test";
import assert from "node:assert/strict";
import React, { act } from "react";
import type { Root } from "react-dom/client";
import { JSDOM } from "jsdom";
import {
  resolveRouteSEO,
  resolveTourSEO,
  resolveDestinationSEO,
  getCanonicalUrl,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
  STATIC_ROUTE_SEO,
  TOUR_SEO_REGISTRY,
  DESTINATION_SEO_REGISTRY,
} from "../config/seo";
import { setMetaTag, setLinkTag } from "../hooks/useSEO";

/* -------------------------------------------------------------------------- */
/* PART 1: Unit & Registry Parity Tests                                       */
/* -------------------------------------------------------------------------- */

test("SEO: Static routes resolve correct bilingual titles and neutral descriptions", () => {
  const routes = ["/", "/tours", "/about", "/reviews", "/faq", "/contacts"];

  for (const route of routes) {
    const ruMeta = resolveRouteSEO(route, "", "ru");
    assert.ok(ruMeta.title.includes(SITE_NAME), `RU title for ${route} must contain brand name`);
    assert.ok(ruMeta.description.length > 25, `RU description for ${route} must be substantial`);
    assert.ok(ruMeta.ogImage, `RU ogImage for ${route} must be defined`);

    // Verify neutral claims: no unsupported office address, opening hours, or guarantees
    assert.ok(!ruMeta.description.includes("адрес офиса"), `RU description for ${route} must not claim unconfirmed office address`);
    assert.ok(!ruMeta.description.includes("09:00"), `RU description for ${route} must not claim unconfirmed opening hours`);
    assert.ok(!ruMeta.description.includes("без скрытых доплат"), `RU description for ${route} must not make fee guarantees`);
    assert.ok(!ruMeta.description.includes("проверенные локальные гиды"), `RU description for ${route} must not make vetting claims`);

    const kzMeta = resolveRouteSEO(route, "", "kz");
    assert.ok(kzMeta.title.includes(SITE_NAME), `KZ title for ${route} must contain brand name`);
    assert.ok(kzMeta.description.length > 25, `KZ description for ${route} must be substantial`);
    assert.ok(kzMeta.ogImage, `KZ ogImage for ${route} must be defined`);

    assert.ok(!kzMeta.description.includes("кеңсе мекенжайы"), `KZ description for ${route} must not claim unconfirmed office address`);
    assert.ok(!kzMeta.description.includes("жасырын төлемсіз"), `KZ description for ${route} must not make fee guarantees`);
    assert.ok(!kzMeta.description.includes("сенімді гидтер"), `KZ description for ${route} must not make vetting claims`);

    // Ensure distinct translations
    assert.notEqual(ruMeta.title, kzMeta.title, `Title for ${route} should differ between RU and KZ`);
    assert.notEqual(ruMeta.description, kzMeta.description, `Description for ${route} should differ between RU and KZ`);
  }
});

test("SEO: Catalog favorites query (/tours?favorites=true) has customized title", () => {
  const ruFav = resolveRouteSEO("/tours", "?favorites=true", "ru");
  assert.equal(ruFav.title, "Избранные туры | ALL TOUR");
  assert.ok(ruFav.description.includes("сохранённых туров"));

  const kzFav = resolveRouteSEO("/tours", "?favorites=true", "kz");
  assert.equal(kzFav.title, "Таңдаулы турлар | ALL TOUR");
  assert.ok(kzFav.description.includes("сақталған турлар"));
});

test("SEO: Tour detail route uses actual tour data for titles, descriptions, and media", () => {
  const ruTour = resolveRouteSEO("/tours/kyrgyzstan-content-tour", "", "ru");
  assert.ok(ruTour.title.includes("Кыргызстан"));
  assert.ok(ruTour.title.includes(SITE_NAME));
  assert.ok(ruTour.description.includes("Алматы"));
  assert.equal(ruTour.ogType, "article");
  assert.ok(ruTour.ogImage, "Tour must have an Open Graph image");

  const kzTour = resolveRouteSEO("/tours/kyrgyzstan-content-tour", "", "kz");
  assert.ok(kzTour.title.includes("Қырғызстан") || kzTour.title.includes("контент-тур"));
  assert.ok(kzTour.title.includes(SITE_NAME));
  assert.equal(kzTour.ogType, "article");
});

test("SEO: Tour detail gracefully handles invalid or unknown tour slug", () => {
  const ruMissing = resolveTourSEO("non-existent-tour-slug-xyz", "ru");
  assert.equal(ruMissing.title, "Тур не найден | ALL TOUR");
  assert.ok(ruMissing.description.includes("не найден"));
  assert.equal(ruMissing.ogImage, DEFAULT_OG_IMAGE);

  const kzMissing = resolveTourSEO("non-existent-tour-slug-xyz", "kz");
  assert.equal(kzMissing.title, "Тур табылмады | ALL TOUR");
  assert.ok(kzMissing.description.includes("табылмады"));
  assert.equal(kzMissing.ogImage, DEFAULT_OG_IMAGE);
});

test("SEO: Destination routes resolve localized titles and editorial summaries", () => {
  const destinations = ["kyrgyzstan", "georgia", "china"];

  for (const destId of destinations) {
    const ruDest = resolveRouteSEO(`/destinations/${destId}`, "", "ru");
    assert.ok(ruDest.title.includes(SITE_NAME));
    assert.ok(ruDest.description.length > 25);
    assert.ok(ruDest.ogImage, `Destination ${destId} must have an image`);

    const kzDest = resolveRouteSEO(`/destinations/${destId}`, "", "kz");
    assert.ok(kzDest.title.includes(SITE_NAME));
    assert.ok(kzDest.description.length > 25);
    assert.notEqual(ruDest.title, kzDest.title);
  }
});

test("SEO: Preserves Kazakh special characters in titles and descriptions", () => {
  const kzHome = resolveRouteSEO("/", "", "kz");
  assert.ok(
    /[ӘҒҚҢӨҮҰҺІәғқңөүұһі]/.test(kzHome.description),
    "Kazakh description must contain authentic Kazakh characters"
  );

  const kzCatalog = resolveRouteSEO("/tours", "", "kz");
  assert.ok(
    /[ӘҒҚҢӨҮҰҺІәғқңөүұһі]/.test(kzCatalog.description),
    "Kazakh catalog description must contain authentic Kazakh characters"
  );
});

test("SEO: Safe canonical URLs - strictly avoids invented domains when unconfigured", () => {
  const canonical = getCanonicalUrl("/tours");
  assert.equal(canonical, null, "Canonical URL must be null when no production base URL is configured");

  const homeCanonical = getCanonicalUrl("/");
  assert.ok(homeCanonical === null || !homeCanonical.includes("alltour.kz"));
});

test("SEO Registry Parity: TOUR_SEO_REGISTRY matches all tours in data/tours.ts", async () => {
  const { tours } = await import("../data/tours");

  for (const tour of tours) {
    const seoEntry = TOUR_SEO_REGISTRY[tour.slug];
    assert.ok(seoEntry, `Tour ${tour.slug} must exist in TOUR_SEO_REGISTRY`);
    assert.equal(seoEntry.title.ru, tour.title.ru, `RU title mismatch for tour ${tour.slug}`);
    assert.equal(seoEntry.title.kz, tour.title.kz, `KZ title mismatch for tour ${tour.slug}`);
    assert.equal(seoEntry.summary.ru, tour.summary.ru, `RU summary mismatch for tour ${tour.slug}`);
    assert.equal(seoEntry.summary.kz, tour.summary.kz, `KZ summary mismatch for tour ${tour.slug}`);
  }
});

test("SEO Registry Parity: DESTINATION_SEO_REGISTRY matches all destinations in data/destinations.ts", async () => {
  const { destinations } = await import("../data/destinations");

  for (const dest of destinations) {
    const seoEntry = DESTINATION_SEO_REGISTRY[dest.id];
    assert.ok(seoEntry, `Destination ${dest.id} must exist in DESTINATION_SEO_REGISTRY`);
    assert.equal(seoEntry.name.ru, dest.name.ru, `RU name mismatch for destination ${dest.id}`);
    assert.equal(seoEntry.name.kz, dest.name.kz, `KZ name mismatch for destination ${dest.id}`);
    assert.equal(seoEntry.editorialDescription.ru, dest.editorialDescription.ru, `RU description mismatch for destination ${dest.id}`);
    assert.equal(seoEntry.editorialDescription.kz, dest.editorialDescription.kz, `KZ description mismatch for destination ${dest.id}`);
  }
});

test("SEO DOM helpers: setMetaTag and setLinkTag handle creation, updates, and clean removal", () => {
  // Test directly against the test DOM document
  setMetaTag("name", "custom-desc", "First description");
  let descTags = document.head.querySelectorAll('meta[name="custom-desc"]');
  assert.equal(descTags.length, 1);
  assert.equal(descTags[0].getAttribute("content"), "First description");

  setMetaTag("name", "custom-desc", "Second updated description");
  descTags = document.head.querySelectorAll('meta[name="custom-desc"]');
  assert.equal(descTags.length, 1, "Must update existing tag instead of creating duplicate");
  assert.equal(descTags[0].getAttribute("content"), "Second updated description");

  setMetaTag("name", "custom-desc", null);
  descTags = document.head.querySelectorAll('meta[name="custom-desc"]');
  assert.equal(descTags.length, 0, "Meta tag must be removed when content is null");

  // Canonical link test
  setLinkTag("canonical", "https://example.com/test");
  let canLinks = document.head.querySelectorAll('link[rel="canonical"]');
  assert.equal(canLinks.length, 1);
  assert.equal(canLinks[0].getAttribute("href"), "https://example.com/test");

  setLinkTag("canonical", null);
  canLinks = document.head.querySelectorAll('link[rel="canonical"]');
  assert.equal(canLinks.length, 0);
});

/* -------------------------------------------------------------------------- */
/* PART 2: Full Application Integration Tests                                 */
/* -------------------------------------------------------------------------- */

let appDom: JSDOM;
let appRoot: Root | undefined;
let createRootFn: typeof import("react-dom/client").createRoot;
let AppComp: typeof import("../app/App").App;

before(async () => {
  appDom = new JSDOM("<!doctype html><html><head><title>Initial Title</title></head><body><div id=\"root\"></div></body></html>", {
    url: "http://localhost/",
    pretendToBeVisual: true,
  });

  for (const key of ["window", "document", "navigator", "HTMLElement", "Element", "SVGElement", "MutationObserver", "localStorage", "getComputedStyle"]) {
    Object.defineProperty(globalThis, key, { configurable: true, value: (appDom.window as any)[key] });
  }

  Object.assign(globalThis, {
    IS_REACT_ACT_ENVIRONMENT: true,
    requestAnimationFrame: appDom.window.requestAnimationFrame.bind(appDom.window),
    cancelAnimationFrame: appDom.window.cancelAnimationFrame.bind(appDom.window),
  });

  appDom.window.matchMedia = ((query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() { return true; },
  })) as typeof window.matchMedia;

  appDom.window.scrollTo = () => {};

  ({ createRoot: createRootFn } = await import("react-dom/client"));
  ({ App: AppComp } = await import("../app/App"));
});

afterEach(async () => {
  if (appRoot) {
    await act(async () => {
      appRoot!.unmount();
    });
    appRoot = undefined;
  }
});

after(async () => {
  const { default: gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  ScrollTrigger.killAll();
  ScrollTrigger.disable();
  gsap.ticker.sleep();
  appDom.window.close();
});

async function mountApp(initialPath: string) {
  appDom.window.history.replaceState(null, "", initialPath);
  appDom.window.localStorage.clear();
  document.body.innerHTML = '<div id="root"></div>';
  appRoot = createRootFn(document.getElementById("root")!);
  await act(async () => {
    appRoot!.render(<AppComp />);
  });
}

test("App Integration: Navigating between routes updates title and description", async () => {
  await mountApp("/");

  // 1. Initial homepage title and description
  assert.equal(document.title, STATIC_ROUTE_SEO["/"]["ru"].title);
  const homeDesc = document.head.querySelector('meta[name="description"]')?.getAttribute("content");
  assert.equal(homeDesc, STATIC_ROUTE_SEO["/"]["ru"].description);

  // 2. Client navigation to /tours via link click
  const catalogLink = Array.from(document.querySelectorAll("a")).find(
    (a) => a.getAttribute("href") === "/tours"
  );
  assert.ok(catalogLink, "Catalog link must exist in navigation");

  await act(async () => {
    catalogLink!.click();
  });

  // Verify updated title and description
  assert.equal(document.title, STATIC_ROUTE_SEO["/tours"]["ru"].title);
  const catDesc = document.head.querySelector('meta[name="description"]')?.getAttribute("content");
  assert.equal(catDesc, STATIC_ROUTE_SEO["/tours"]["ru"].description);
});

test("App Integration: Switching KZ/RU updates metadata language and og:locale", async () => {
  await mountApp("/?lang=ru");

  assert.equal(document.documentElement.lang, "ru");
  assert.equal(document.title, STATIC_ROUTE_SEO["/"]["ru"].title);
  let ogLocale = document.head.querySelector('meta[property="og:locale"]')?.getAttribute("content");
  assert.equal(ogLocale, "ru_KZ");

  // Click language switcher button
  const langBtn = Array.from(document.querySelectorAll("button")).find(
    (b) => b.getAttribute("aria-label")?.includes("Тіл") || b.textContent?.includes("RU")
  );
  assert.ok(langBtn, "Language toggle button must exist");

  await act(async () => {
    langBtn!.click();
  });

  // Verify switch to Kazakh
  assert.equal(document.documentElement.lang, "kk");
  assert.equal(document.title, STATIC_ROUTE_SEO["/"]["kz"].title);
  ogLocale = document.head.querySelector('meta[property="og:locale"]')?.getAttribute("content");
  assert.equal(ogLocale, "kk_KZ");
  const kzDesc = document.head.querySelector('meta[name="description"]')?.getAttribute("content");
  assert.equal(kzDesc, STATIC_ROUTE_SEO["/"]["kz"].description);
});

test("App Integration: Back/Forward navigation restores matching metadata without remaining stale", async () => {
  await mountApp("/");

  assert.equal(document.title, STATIC_ROUTE_SEO["/"]["ru"].title);

  // Navigate to About
  const aboutLink = Array.from(document.querySelectorAll("a")).find(
    (a) => a.getAttribute("href") === "/about"
  );
  assert.ok(aboutLink, "About link must exist");

  await act(async () => {
    aboutLink!.click();
  });

  assert.equal(document.title, STATIC_ROUTE_SEO["/about"]["ru"].title);
  const aboutDesc = document.head.querySelector('meta[name="description"]')?.getAttribute("content");
  assert.equal(aboutDesc, STATIC_ROUTE_SEO["/about"]["ru"].description);

  // Simulate browser Back button to return to Home
  appDom.window.history.pushState(null, "", "/");
  await act(async () => {
    appDom.window.dispatchEvent(new appDom.window.PopStateEvent("popstate"));
  });

  // Verify metadata restored to Home and is not stale
  assert.equal(document.title, STATIC_ROUTE_SEO["/"]["ru"].title);
  const backDesc = document.head.querySelector('meta[name="description"]')?.getAttribute("content");
  assert.equal(backDesc, STATIC_ROUTE_SEO["/"]["ru"].description);
});

test("App Integration: Repeated updates and navigations do not create duplicate tags", async () => {
  await mountApp("/");

  // Navigate across multiple routes
  for (const targetPath of ["/tours", "/about", "/faq", "/contacts", "/"]) {
    const link = Array.from(document.querySelectorAll("a")).find(
      (a) => a.getAttribute("href") === targetPath
    );
    if (link) {
      await act(async () => {
        link.click();
      });
    }

    // Toggle language back and forth
    const langBtn = Array.from(document.querySelectorAll("button")).find(
      (b) => b.getAttribute("aria-label")?.includes("Тіл") || b.textContent?.includes("RU")
    );
    if (langBtn) {
      await act(async () => {
        langBtn.click();
      });
    }
  }

  // Assert exactly 1 of each critical tag exists in head
  const descCount = document.head.querySelectorAll('meta[name="description"]').length;
  assert.equal(descCount, 1, "There must be exactly one meta description tag");

  const ogTitleCount = document.head.querySelectorAll('meta[property="og:title"]').length;
  assert.equal(ogTitleCount, 1, "There must be exactly one og:title tag");

  const ogLocaleCount = document.head.querySelectorAll('meta[property="og:locale"]').length;
  assert.equal(ogLocaleCount, 1, "There must be exactly one og:locale tag");

  const ogImageCount = document.head.querySelectorAll('meta[property="og:image"]').length;
  assert.equal(ogImageCount, 1, "There must be exactly one og:image tag");

  const twitterCardCount = document.head.querySelectorAll('meta[name="twitter:card"]').length;
  assert.equal(twitterCardCount, 1, "There must be exactly one twitter:card tag");
});
