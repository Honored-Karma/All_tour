import React, { useState } from "react";
import type { DestinationId } from "../../data/destinations";
import { getTourBySlug, type Tour } from "../../data/tours";
import type { StoryScreenshotAsset } from "../../data/reviews";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { Hero } from "../sections/Hero";
import { Journey } from "../sections/Journey";
import { FeaturedTours } from "../sections/FeaturedTours";
import { WhyTravel } from "../sections/WhyTravel";
import { ReviewsShowcase } from "../sections/ReviewsShowcase";
import { HowToBook } from "../sections/HowToBook";
import { FAQ } from "../sections/FAQ";
import { FinalCTA } from "../sections/FinalCTA";
import { useNavigate, useSearchParams } from "react-router-dom";

interface HomePageProps {
  dict: Dictionary;
  locale: Locale;
  reducedMotion: boolean;
  activeDestinationId: DestinationId;
  onActiveDestinationChange: (id: DestinationId) => void;
  onBookTour: (tour: Tour) => void;
  onOpenTourDetails: (tour: Tour) => void;
  onOpenStory: (story: StoryScreenshotAsset) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  comparedTours: string[];
  onToggleCompare: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  dict,
  locale,
  reducedMotion,
  activeDestinationId,
  onActiveDestinationChange,
  onBookTour,
  onOpenTourDetails,
  onOpenStory,
  favorites,
  onToggleFavorite,
  comparedTours,
  onToggleCompare,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingTourSlug = searchParams.get("tour");
  const bookingTour = bookingTourSlug ? getTourBySlug(bookingTourSlug) : undefined;
  const [selectedFilter, setSelectedFilter] = useState<"all" | DestinationId>("all");
  const [cursorVisible, setCursorVisible] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  const handleExploreCountryTours = (destId: DestinationId) => {
    navigate(`/destinations/${destId}`);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Hero
        dict={dict}
        locale={locale}
        reducedMotion={reducedMotion}
        onExploreClick={() => scrollToSection("journey")}
      />

      <Journey
        dict={dict}
        locale={locale}
        reducedMotion={reducedMotion}
        activeDestinationId={activeDestinationId}
        onActiveDestinationChange={onActiveDestinationChange}
        onExploreCountryTours={handleExploreCountryTours}
      />

      <FeaturedTours
        dict={dict}
        locale={locale}
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
        onOpenTourDetails={onOpenTourDetails}
        onBookTour={onBookTour}
        onCursorEnter={() => setCursorVisible(true)}
        onCursorLeave={() => setCursorVisible(false)}
      />

      <WhyTravel dict={dict} />

      <ReviewsShowcase
        dict={dict}
        locale={locale}
        onOpenReviewsPage={() => navigate("/reviews")}
        onOpenStory={onOpenStory}
      />

      <HowToBook
        dict={dict}
        locale={locale}
        preselectedDestinationId={activeDestinationId}
        preselectedTour={bookingTour}
      />

      <FAQ dict={dict} />

      <FinalCTA dict={dict} locale={locale} reducedMotion={reducedMotion} />
    </>
  );
};
