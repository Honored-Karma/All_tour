import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { getDictionary } from "../i18n";
import { CurrencyProvider } from "../context/CurrencyContext";
import { Header } from "../components/layout/Header";
import { Footer } from "../components/layout/Footer";
import { HomePage } from "../components/pages/HomePage";
import { ToursCatalogPage } from "../components/pages/ToursCatalogPage";
import { TourDetailPage } from "../components/pages/TourDetailPage";
import { DestinationPage } from "../components/pages/DestinationPage";
import { AboutPage } from "../components/pages/AboutPage";
import { ReviewsPage } from "../components/pages/ReviewsPage";
import { FAQPage } from "../components/pages/FAQPage";
import { ContactsPage } from "../components/pages/ContactsPage";
import { NotFoundPage } from "../components/pages/NotFoundPage";
import type { Locale } from "../lib/whatsapp";

const noop = () => {};

/** Build-time public HTML; the client app supplies interaction after loading. */
export function StaticPage({ path, locale }: { path: string; locale: Locale }) {
  const dict = getDictionary(locale);
  const props = { dict, locale };
  const tourProps = { ...props, favorites: [], comparedTours: [], onToggleFavorite: noop, onToggleCompare: noop, onBookTour: noop };
  return <MemoryRouter initialEntries={[`${path}${locale === "kz" ? "?lang=kz" : ""}`]}>
    <CurrencyProvider locale={locale}>
      <Header {...props} onToggleLocale={noop} onOpenMobileMenu={noop} />
      <main id="main-content"><Routes>
        <Route path="/" element={<HomePage {...props} reducedMotion />} />
        <Route path="/tours" element={<ToursCatalogPage {...tourProps} />} />
        <Route path="/tours/:slug" element={<TourDetailPage {...tourProps} onOpenStory={noop} />} />
        <Route path="/destinations/:destinationId" element={<DestinationPage {...tourProps} />} />
        <Route path="/about" element={<AboutPage {...props} />} />
        <Route path="/reviews" element={<ReviewsPage {...props} onOpenStory={noop} />} />
        <Route path="/faq" element={<FAQPage {...props} />} />
        <Route path="/contacts" element={<ContactsPage {...props} />} />
        <Route path="*" element={<NotFoundPage {...props} />} />
      </Routes></main>
      <Footer {...props} />
    </CurrencyProvider>
  </MemoryRouter>;
}
