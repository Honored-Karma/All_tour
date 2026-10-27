import React, { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import type { DestinationId } from "../data/destinations";
import type { Tour } from "../data/tours";
import type { StoryScreenshotAsset } from "../data/reviews";
import { getDictionary } from "../i18n";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useSyncSceneTheme } from "../hooks/useActiveDestination";
import { useFavorites } from "../hooks/useFavorites";
import { useTourComparison } from "../hooks/useTourComparison";
import type { Locale } from "../lib/whatsapp";

// Layout components
import { Header } from "../components/layout/Header";
import { MobileNavigation } from "../components/layout/MobileNavigation";
import { Footer } from "../components/layout/Footer";
import { ScrollToTop } from "../components/common/ScrollToTop";
import { ScrollProgressIndicator } from "../components/common/ScrollProgressIndicator";
import { BackToTop } from "../components/common/BackToTop";
import { PageFallback } from "../components/common/PageFallback";
import { useSEO } from "../hooks/useSEO";

// Modals
import { TourDetails } from "../components/tours/TourDetails";
import { StoryLightboxModal } from "../components/reviews/StoryLightboxModal";

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

  const [activeDestinationId, setActiveDestinationId] =
    useState<DestinationId>("kyrgyzstan");
  const [activeTourDetails, setActiveTourDetails] = useState<Tour | null>(null);
  const [activeStoryModal, setActiveStoryModal] =
    useState<StoryScreenshotAsset | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const reducedMotion = useReducedMotion();
  const dict = getDictionary(locale);

  const { favorites, toggleFavorite, favoritesCount } = useFavorites();
  const { comparedTours, toggleCompare } = useTourComparison(3);

  useSyncSceneTheme(activeDestinationId);

  useSEO({
    pathname: location.pathname,
    search: location.search,
    locale,
  });

  const handleBookTour = useCallback(
    (tour: Tour) => {
      setActiveTourDetails(null);
      const search = new URLSearchParams();
      search.set("lang", locale);
      search.set("tour", tour.slug);
      navigate({ pathname: "/", search: `?${search.toString()}`, hash: "#booking" });
    },
    [navigate, locale]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0a1013] text-[#EDE6DA] relative selection:bg-red-500/30 selection:text-white">
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
      <main className="flex-1">
        <Suspense fallback={<PageFallback locale={locale} />}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  dict={dict}
                  locale={locale}
                  reducedMotion={reducedMotion}
                  activeDestinationId={activeDestinationId}
                  onActiveDestinationChange={setActiveDestinationId}
                  onBookTour={handleBookTour}
                  onOpenTourDetails={(tour) => setActiveTourDetails(tour)}
                  onOpenStory={(story) => setActiveStoryModal(story)}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  comparedTours={comparedTours}
                  onToggleCompare={toggleCompare}
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
                  onToggleCompare={toggleCompare}
                  onBookTour={handleBookTour}
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
                  onToggleCompare={toggleCompare}
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
                  onToggleCompare={toggleCompare}
                  onBookTour={handleBookTour}
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

            {/* Fallback to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
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

      {/* Floating Back to Top Button */}
      <BackToTop />
    </div>
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
