import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import type { Tour } from "../data/tours";
import type { StoryScreenshotAsset } from "../data/reviews";
import { getDictionary } from "../i18n";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useSyncSceneTheme } from "../hooks/useActiveDestination";
import { useFavorites } from "../hooks/useFavorites";
import { useTourComparison } from "../hooks/useTourComparison";
import type { Locale } from "../lib/whatsapp";

import { CurrencyProvider } from "../context/CurrencyContext";

// Layout components
import { Header } from "../components/layout/Header";
import { MobileNavigation } from "../components/layout/MobileNavigation";
import { Footer } from "../components/layout/Footer";
import { ScrollToTop } from "../components/common/ScrollToTop";
import { ScrollProgressIndicator } from "../components/common/ScrollProgressIndicator";
import { BackToTop } from "../components/common/BackToTop";
import { PageFallback } from "../components/common/PageFallback";
import { RouteErrorBoundary } from "../components/common/RouteErrorBoundary";
import { useSEO } from "../hooks/useSEO";
import { rememberCampaign, trackEvent } from "../lib/analytics";
import { getTourBySlug } from "../data/tours";

// Modals
import { TourDetails } from "../components/tours/TourDetails";
import { StoryLightboxModal } from "../components/reviews/StoryLightboxModal";
import { TourCompareModal } from "../components/tours/TourCompareModal";

// Route views - code split at route boundaries
const HomePage = lazy(() =>
  import("../components/pages/HomePage").then((m) => ({ default: m.HomePage }))
);
const ToursCatalogPage = lazy(() =>
  import("../components/pages/ToursCatalogPage").then((m) => ({ default: m.ToursCatalogPage }))
);
const TourDetailPage = lazy(() =>
  import("../components/pages/TourDetailPage").then((m) => ({ default: m.TourDetailPage }))
);
const DestinationPage = lazy(() =>
  import("../components/pages/DestinationPage").then((m) => ({ default: m.DestinationPage }))
);
const AboutPage = lazy(() =>
  import("../components/pages/AboutPage").then((m) => ({ default: m.AboutPage }))
);
const ReviewsPage = lazy(() =>
  import("../components/pages/ReviewsPage").then((m) => ({ default: m.ReviewsPage }))
);
const FAQPage = lazy(() =>
  import("../components/pages/FAQPage").then((m) => ({ default: m.FAQPage }))
);
const ContactsPage = lazy(() =>
  import("../components/pages/ContactsPage").then((m) => ({ default: m.ContactsPage }))
);
const NotFoundPage = lazy(() =>
  import("../components/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage }))
);

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();

  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const langParam = urlParams.get("lang");
        if (langParam === "kz" || langParam === "ru") {
          try {
            localStorage.setItem("alltour_locale", langParam);
          } catch {}
          return langParam;
        }
        const saved = localStorage.getItem("alltour_locale");
        if (saved === "kz" || saved === "ru") return saved;
      } catch {}
    }
    return "ru";
  });

  // Keep locale state in sync whenever Router location changes (e.g. Back/Forward, deep linking)
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const langParam = urlParams.get("lang");
    if ((langParam === "kz" || langParam === "ru") && langParam !== locale) {
      setLocaleState(langParam);
      try {
        localStorage.setItem("alltour_locale", langParam);
      } catch {}
    }
  }, [location.search, locale]);

  const setLocale = useCallback(
    (newLocale: Locale) => {
      setLocaleState(newLocale);
      try {
        localStorage.setItem("alltour_locale", newLocale);
      } catch {}

      const params = new URLSearchParams(location.search);
      params.set("lang", newLocale);
      navigate(
        {
          pathname: location.pathname,
          search: `?${params.toString()}`,
          hash: location.hash,
        },
        { replace: true }
      );
    },
    [location.pathname, location.search, location.hash, navigate]
  );

  const [activeTourDetails, setActiveTourDetails] = useState<Tour | null>(null);
  const [activeStoryModal, setActiveStoryModal] =
    useState<StoryScreenshotAsset | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareLimitReached, setCompareLimitReached] = useState(false);

  const reducedMotion = useReducedMotion();
  const mainRef = useRef<HTMLElement>(null);
  useScrollReveal(mainRef, reducedMotion);
  const dict = getDictionary(locale);

  const { favorites, toggleFavorite, favoritesCount } = useFavorites();
  const { comparedTours, toggleCompare, clearCompare } = useTourComparison(3);
  const handleToggleCompare = (tourId: string) => {
    if (!comparedTours.includes(tourId) && comparedTours.length >= 3) {
      setCompareLimitReached(true);
      setCompareModalOpen(true);
      return;
    }
    setCompareLimitReached(false);
    toggleCompare(tourId);
  };

  useSyncSceneTheme("kyrgyzstan");

  useSEO({
    pathname: location.pathname,
    search: location.search,
    locale,
  });

  useEffect(() => {
    rememberCampaign(location.search);
    trackEvent("page_view", { route: location.pathname, locale });
    const slug = location.pathname.match(/^\/tours\/([^/]+)$/)?.[1];
    const tour = slug ? getTourBySlug(slug) : undefined;
    if (tour) trackEvent("tour_view", { tourId: tour.id, locale });
  }, [location.pathname, locale]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a[href]") as HTMLAnchorElement | null : null;
      if (target && new URL(target.href, window.location.href).hostname === "wa.me") trackEvent("whatsapp_open", { source: "link", locale });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [locale]);

  const handleBookTour = useCallback(
    (tour: Tour) => {
      setActiveTourDetails(null);
      const search = new URLSearchParams();
      search.set("lang", locale);
      search.set("tour", tour.slug);
      const current = new URLSearchParams(location.search);
      for (const key of ["from", "to", "travelers", "flexible"]) {
        const value = current.get(key);
        if (value) search.set(key, value);
      }
      navigate({ pathname: "/contacts", search: `?${search.toString()}`, hash: "#booking" });
    },
    [navigate, locale, location.search]
  );

  return (
    <CurrencyProvider locale={locale}>
      <div className="min-h-screen flex flex-col bg-canvas text-ink relative selection:bg-accent/30 selection:text-ink">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-xl focus:bg-surface focus:p-4">
          {locale === "kz" ? "Негізгі мазмұнға өту" : "Перейти к содержимому"}
        </a>
        {/* Scroll Progress Bar at the very top */}
        <ScrollProgressIndicator />

        {/* Primary Global Navigation Header */}
        <Header
          dict={dict}
          locale={locale}
          onToggleLocale={setLocale}
          favoritesCount={favoritesCount}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Mobile Drawer Menu */}
        <MobileNavigation
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          dict={dict}
          locale={locale}
          onToggleLocale={setLocale}
          favoritesCount={favoritesCount}
        />

        {/* Route Views */}
        <main id="main-content" tabIndex={-1} ref={mainRef} className="flex-1">
          <RouteErrorBoundary
            dict={dict}
            locale={locale}
            resetKey={location.pathname}
          >
            <Suspense fallback={<PageFallback locale={locale} />}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <HomePage
                      dict={dict}
                      locale={locale}
                      reducedMotion={reducedMotion}
                    />
                  }
                />

                <Route
                  path="/tours"
                  element={
                    <ToursCatalogPage
                      dict={dict}
                      locale={locale}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                      comparedTours={comparedTours}
                      onToggleCompare={handleToggleCompare}
                      onBookTour={handleBookTour}
                      onOpenCompareModal={() => setCompareModalOpen(true)}
                    />
                  }
                />

                <Route
                  path="/tours/:slug"
                  element={
                    <TourDetailPage
                      dict={dict}
                      locale={locale}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                      comparedTours={comparedTours}
                      onToggleCompare={handleToggleCompare}
                      onBookTour={handleBookTour}
                      onOpenStory={(story: StoryScreenshotAsset) => setActiveStoryModal(story)}
                    />
                  }
                />

                <Route
                  path="/destinations/:destinationId"
                  element={
                    <DestinationPage
                      dict={dict}
                      locale={locale}
                      favorites={favorites}
                      onToggleFavorite={toggleFavorite}
                      comparedTours={comparedTours}
                      onToggleCompare={handleToggleCompare}
                      onBookTour={handleBookTour}
                      onOpenTourDetails={(tour: Tour) => setActiveTourDetails(tour)}
                    />
                  }
                />

                <Route
                  path="/destinations"
                  element={<Navigate to="/tours" replace />}
                />

                <Route
                  path="/about"
                  element={<AboutPage dict={dict} locale={locale} />}
                />

                <Route
                  path="/reviews"
                  element={
                    <ReviewsPage
                      dict={dict}
                      locale={locale}
                      onOpenStory={(story) => setActiveStoryModal(story)}
                    />
                  }
                />

                <Route
                  path="/faq"
                  element={<FAQPage dict={dict} locale={locale} />}
                />

                <Route
                  path="/contacts"
                  element={<ContactsPage dict={dict} locale={locale} />}
                />

                {/* Dedicated 404 Not Found Page */}
                <Route
                  path="*"
                  element={<NotFoundPage dict={dict} locale={locale} />}
                />
              </Routes>
            </Suspense>
          </RouteErrorBoundary>
        </main>

        {/* Global Footer */}
        <Footer dict={dict} locale={locale} />

        {/* Modals & Overlays */}
        <TourDetails
          tour={activeTourDetails}
          onClose={() => setActiveTourDetails(null)}
          onSelectForBookingForm={handleBookTour}
          dict={dict}
          locale={locale}
        />

        <StoryLightboxModal
          activeStory={activeStoryModal}
          onClose={() => setActiveStoryModal(null)}
          onSelectStory={(story) => setActiveStoryModal(story)}
          dict={dict}
          locale={locale}
        />

        <TourCompareModal
          open={compareModalOpen}
          onClose={() => setCompareModalOpen(false)}
          selectedTourIds={comparedTours}
          onRemoveTour={handleToggleCompare}
          locale={locale}
          dict={dict}
          limitReached={compareLimitReached}
          search={location.search.slice(1)}
        />

        {comparedTours.length > 0 && !compareModalOpen && (
          <div className="fixed bottom-24 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-4 max-w-[calc(100vw-1.5rem)] z-40 flex items-center gap-2 rounded-2xl bg-surface border border-line p-2 shadow-lg">
            <button type="button" onClick={() => { setCompareLimitReached(false); setCompareModalOpen(true); }} className="min-h-11 min-w-0 flex-1 px-3 rounded-xl bg-sage text-on-accent text-sm font-semibold">
              {dict.compare.open.replace("{count}", String(comparedTours.length))}
            </button>
            <button type="button" onClick={clearCompare} className="min-h-11 min-w-0 flex-1 px-3 text-sm text-muted">{dict.compare.clear}</button>
          </div>
        )}

        {/* Floating Back to Top Button */}
        <BackToTop />
      </div>
    </CurrencyProvider>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
