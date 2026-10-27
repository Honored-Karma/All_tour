import test, { before, after, afterEach } from "node:test";
import assert from "node:assert/strict";
import React, { Suspense, act } from "react";
import type { Root } from "react-dom/client";
import { JSDOM } from "jsdom";
import { MemoryRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { RouteErrorBoundary } from "../components/common/RouteErrorBoundary";
import { MediaGallery } from "../components/gallery/MediaGallery";
import { ReviewCard } from "../components/reviews/ReviewCard";
import { realReviews } from "../data/reviews";
import { ru } from "../i18n/ru";
import { kz } from "../i18n/kz";
import { STATIC_ROUTE_SEO } from "../config/seo";

let dom: JSDOM;
let root: Root | undefined;
let createRoot: typeof import("react-dom/client").createRoot;
let App: typeof import("../app/App").App;

before(async () => {
  dom = new JSDOM('<!doctype html><html><head><title>Initial</title></head><body><div id="root"></div></body></html>', {
    url: "http://localhost/",
    pretendToBeVisual: true,
  });

  for (const key of [
    "window",
    "document",
    "navigator",
    "HTMLElement",
    "Element",
    "SVGElement",
    "MutationObserver",
    "localStorage",
    "getComputedStyle",
  ]) {
    Object.defineProperty(globalThis, key, {
      configurable: true,
      writable: true,
      value: (dom.window as any)[key],
    });
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
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return true;
    },
  })) as typeof window.matchMedia;

  dom.window.scrollTo = () => {};

  ({ createRoot } = await import("react-dom/client"));
  ({ App } = await import("../app/App"));
});

afterEach(async () => {
  if (root) {
    await act(async () => {
      root!.unmount();
    });
    root = undefined;
  }
});

after(async () => {
  try {
    const { default: gsap } = await import("gsap");
    const { ScrollTrigger } = await import("gsap/ScrollTrigger");
    ScrollTrigger.killAll();
    gsap.ticker.sleep();
  } catch {}
  dom.window.close();
});

async function mountApp(initialPath: string) {
  dom.window.history.replaceState(null, "", initialPath);
  dom.window.localStorage.clear();
  document.body.innerHTML = '<div id="root"></div>';
  root = createRoot(document.getElementById("root")!);
  await act(async () => {
    root!.render(<App />);
  });
}

/* -------------------------------------------------------------------------- */
/* 1. RouteErrorBoundary with Real React.lazy & Suspense                     */
/* -------------------------------------------------------------------------- */

test("Failure Handling: Rejected React.lazy loader renders localized fallback UI in Russian", async () => {
  const FailingLazy = React.lazy(() =>
    Promise.reject(new Error("Failed to fetch dynamically imported module: chunk-123.js"))
  );

  document.body.innerHTML = '<div id="test-root"></div>';
  const testRoot = createRoot(document.getElementById("test-root")!);

  const origError = console.error;
  console.error = () => {};

  try {
    await act(async () => {
      testRoot.render(
        <MemoryRouter>
          <RouteErrorBoundary dict={ru} locale="ru">
            <Suspense fallback={<div>Loading...</div>}>
              <FailingLazy />
            </Suspense>
          </RouteErrorBoundary>
        </MemoryRouter>
      );
    });

    const alertSection = document.querySelector('section[role="alert"]');
    assert.ok(alertSection, "Error boundary must render an accessible alert section");

    // Localized Russian heading and explicit reload action
    assert.ok(
      document.body.textContent?.includes(ru.errorBoundary.title),
      "Must display localized Russian error title"
    );
    assert.ok(
      document.body.textContent?.includes(ru.errorBoundary.reloadBtn),
      "Must display localized Russian reload button"
    );

    // Must NOT expose internal chunk filenames or raw stack trace
    assert.ok(
      !document.body.textContent?.includes("chunk-123.js"),
      "Must not expose internal chunk filename in user-facing UI"
    );
  } finally {
    console.error = origError;
    await act(async () => {
      testRoot.unmount();
    });
  }
});

test("Failure Handling: Rejected React.lazy loader renders localized fallback UI in Kazakh", async () => {
  const FailingLazy = React.lazy(() =>
    Promise.reject(new Error("Failed to fetch dynamically imported module: kz-chunk-456.js"))
  );

  document.body.innerHTML = '<div id="test-root"></div>';
  const testRoot = createRoot(document.getElementById("test-root")!);

  const origError = console.error;
  console.error = () => {};

  try {
    await act(async () => {
      testRoot.render(
        <MemoryRouter>
          <RouteErrorBoundary dict={kz} locale="kz">
            <Suspense fallback={<div>Loading...</div>}>
              <FailingLazy />
            </Suspense>
          </RouteErrorBoundary>
        </MemoryRouter>
      );
    });

    assert.ok(
      document.body.textContent?.includes(kz.errorBoundary.title),
      "Must display localized Kazakh error title"
    );
    assert.ok(
      document.body.textContent?.includes(kz.errorBoundary.reloadBtn),
      "Must display localized Kazakh reload button"
    );
  } finally {
    console.error = origError;
    await act(async () => {
      testRoot.unmount();
    });
  }
});

test("Failure Handling: The chosen recovery action (Reload) performs documented behavior", async () => {
  const FailingLazy = React.lazy(() =>
    Promise.reject(new Error("Network connection dropped"))
  );

  document.body.innerHTML = '<div id="test-root"></div>';
  const testRoot = createRoot(document.getElementById("test-root")!);

  let reloadInvoked = false;
  const onReload = () => {
    reloadInvoked = true;
  };

  const origError = console.error;
  console.error = () => {};

  try {
    await act(async () => {
      testRoot.render(
        <MemoryRouter>
          <RouteErrorBoundary dict={ru} locale="ru" onReload={onReload}>
            <Suspense fallback={<div>Loading...</div>}>
              <FailingLazy />
            </Suspense>
          </RouteErrorBoundary>
        </MemoryRouter>
      );
    });

    const buttons = Array.from(document.querySelectorAll("button"));
    const reloadBtn = buttons.find((b) => b.textContent?.includes(ru.errorBoundary.reloadBtn));
    assert.ok(reloadBtn, "Reload page button must be rendered");

    await act(async () => {
      reloadBtn.click();
    });

    assert.equal(
      reloadInvoked,
      true,
      "Clicking the reload recovery button must invoke the documented reload handler"
    );
  } finally {
    console.error = origError;
    await act(async () => {
      testRoot.unmount();
    });
  }
});

test("Failure Handling: Navigating to a healthy route clears the error and renders that route", async () => {
  const FailingLazy = React.lazy(() =>
    Promise.reject(new Error("Chunk load failure on route A"))
  );
  const HealthyRoute = () => (
    <div data-testid="healthy-route-content">Catalog Page Content</div>
  );

  const Harness = () => {
    const location = useLocation();
    return (
      <div>
        <nav>
          <Link to="/healthy" id="nav-to-healthy">
            Go to Healthy
          </Link>
        </nav>
        <RouteErrorBoundary dict={ru} locale="ru" resetKey={location.pathname}>
          <Routes>
            <Route
              path="/failing"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <FailingLazy />
                </Suspense>
              }
            />
            <Route path="/healthy" element={<HealthyRoute />} />
          </Routes>
        </RouteErrorBoundary>
      </div>
    );
  };

  document.body.innerHTML = '<div id="test-root"></div>';
  const testRoot = createRoot(document.getElementById("test-root")!);

  const origError = console.error;
  console.error = () => {};

  try {
    await act(async () => {
      testRoot.render(
        <MemoryRouter initialEntries={["/failing"]}>
          <Harness />
        </MemoryRouter>
      );
    });

    // Confirms initial error boundary alert is rendered
    assert.ok(
      document.querySelector('section[role="alert"]'),
      "Initial state must display error boundary fallback"
    );
    assert.equal(document.querySelector('[data-testid="healthy-route-content"]'), null);

    // Navigate to healthy route
    const link = document.getElementById("nav-to-healthy");
    await act(async () => {
      link?.click();
    });

    // Error boundary should be cleared and healthy route content displayed
    assert.equal(
      document.querySelector('section[role="alert"]'),
      null,
      "Error boundary alert section must be unmounted on route change"
    );
    const healthyContent = document.querySelector('[data-testid="healthy-route-content"]');
    assert.ok(
      healthyContent,
      "Healthy route content must be rendered after navigating away from failed route"
    );
  } finally {
    console.error = origError;
    await act(async () => {
      testRoot.unmount();
    });
  }
});

/* -------------------------------------------------------------------------- */
/* 2. Unknown Route (404) & Nonexistent Destination Handling                 */
/* -------------------------------------------------------------------------- */

test("Failure Handling: Unknown route renders dedicated NotFoundPage and updates metadata", async () => {
  await mountApp("/completely-invalid-nonexistent-path-12345");

  const notFoundPage = document.querySelector('[data-testid="not-found-page"]');
  assert.ok(notFoundPage, "Must render dedicated NotFoundPage for unknown routes");

  // Verify visible title
  assert.ok(document.body.textContent?.includes(ru.notFound.title));
  assert.ok(document.body.textContent?.includes(ru.notFound.description));

  // Verify document title and meta description
  assert.equal(document.title, STATIC_ROUTE_SEO.notFound.ru.title);
  const metaDesc = document.head.querySelector('meta[name="description"]')?.getAttribute("content");
  assert.equal(metaDesc, STATIC_ROUTE_SEO.notFound.ru.description);

  // Verify recovery link to catalog exists and functions
  const catalogLink = notFoundPage.querySelector('a[href="/tours"]') as HTMLAnchorElement;
  assert.ok(catalogLink, "NotFoundPage must offer recovery link to catalog");
});

test("Failure Handling: Unknown route in Kazakh mode renders authentic Kazakh 404", async () => {
  await mountApp("/completely-invalid-path?lang=kz");

  const notFoundPage = document.querySelector('[data-testid="not-found-page"]');
  assert.ok(notFoundPage, "Must render dedicated NotFoundPage");

  assert.ok(document.body.textContent?.includes(kz.notFound.title));
  assert.equal(document.documentElement.lang, "kk");
  assert.equal(document.title, STATIC_ROUTE_SEO.notFound.kz.title);
});

test("Failure Handling: Nonexistent destination renders destination-not-found state rather than fallback country", async () => {
  await mountApp("/destinations/invalid-nonexistent-destination");

  const destNotFound = document.querySelector('[data-testid="destination-not-found"]');
  assert.ok(destNotFound, "Must render destination-not-found view instead of silently showing another country");

  assert.ok(document.body.textContent?.includes(ru.destinationNotFound.title));
  assert.ok(document.body.textContent?.includes(ru.destinationNotFound.description));

  // Must have recovery action to catalog
  const catalogLink = destNotFound.querySelector('a[href="/tours"]');
  assert.ok(catalogLink, "Must offer link to return to tours catalog");
});

test("Failure Handling: Nonexistent destination in Kazakh mode renders localized message", async () => {
  await mountApp("/destinations/unknown-destination?lang=kz");

  const destNotFound = document.querySelector('[data-testid="destination-not-found"]');
  assert.ok(destNotFound, "Must render destination-not-found view in KZ");
  assert.ok(document.body.textContent?.includes(kz.destinationNotFound.title));
});

/* -------------------------------------------------------------------------- */
/* 3. Production Broken Image Resilience                                      */
/* -------------------------------------------------------------------------- */

test("Failure Handling: Production MediaGallery handles image failure with accessible fallback and without recursive fetches", async () => {
  const item = {
    type: "photo" as const,
    src: "/media/photo_broken.jpg",
    alt: { ru: "Красивый вид гор", kz: "Көркем тау көрінісі" },
  };

  document.body.innerHTML = '<div id="test-root"></div>';
  const testRoot = createRoot(document.getElementById("test-root")!);

  try {
    await act(async () => {
      testRoot.render(<MediaGallery items={[item]} locale="ru" dict={ru} />);
    });

    const img = document.querySelector('img[src="/media/photo_broken.jpg"]') as HTMLImageElement;
    assert.ok(img, "MediaGallery must initially render the image");

    // Dispatch error on the actual production image element
    await act(async () => {
      img.dispatchEvent(new dom.window.Event("error"));
    });

    // After error, image should be replaced by fallback placeholder
    const imgAfter = document.querySelector('img[src="/media/photo_broken.jpg"]');
    assert.equal(imgAfter, null, "Broken image must be removed from DOM");

    const fallbackText = document.body.textContent;
    assert.ok(
      fallbackText?.includes("Красивый вид гор"),
      "Must render accessible fallback container displaying the image description"
    );
  } finally {
    await act(async () => {
      testRoot.unmount();
    });
  }
});

test("Failure Handling: Production ReviewCard hides broken screenshot gracefully on error", async () => {
  const sampleReview = realReviews[0];

  document.body.innerHTML = '<div id="test-root"></div>';
  const testRoot = createRoot(document.getElementById("test-root")!);

  try {
    await act(async () => {
      testRoot.render(
        <ReviewCard review={sampleReview} locale="ru" dict={ru} onOpenStory={() => {}} />
      );
    });

    const img = document.querySelector(`img[src="${sampleReview.storyScreenshot}"]`) as HTMLImageElement;
    assert.ok(img, "ReviewCard must render story screenshot thumbnail");
    assert.notEqual(img.style.display, "none", "Initially visible");

    await act(async () => {
      img.dispatchEvent(new dom.window.Event("error"));
    });

    assert.equal(
      img.style.display,
      "none",
      "Broken screenshot thumbnail must be hidden without altering card layout"
    );
    assert.equal(
      img.src,
      `http://localhost${sampleReview.storyScreenshot}`,
      "Must not reassign src recursively"
    );
  } finally {
    await act(async () => {
      testRoot.unmount();
    });
  }
});
