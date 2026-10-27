import React from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { ArrowUpRight, Compass, MapPin } from "lucide-react";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { Hero } from "../sections/Hero";
import { SmartTourFinder } from "../tours/SmartTourFinder";
import { FinalCTA } from "../sections/FinalCTA";
import { destinations } from "../../data/destinations";

interface HomePageProps {
  dict: Dictionary;
  locale: Locale;
  reducedMotion: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({ dict, locale, reducedMotion }) => {
  const { search, hash } = useLocation();

  // Keep previously shared booking links working after moving the form.
  if (new URLSearchParams(search).has("tour") || hash === "#booking" || hash === "#how-to-book") {
    return <Navigate to={{ pathname: "/contacts", search, hash: "#booking" }} replace />;
  }

  return (
    <div className="home-page">
      <Hero
        dict={dict}
        locale={locale}
        reducedMotion={reducedMotion}
        onExploreClick={() => document.getElementById("tour-planner")?.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth" })}
      />

      <div className="home-planner-wrap">
        <div className="max-w-7xl mx-auto"><SmartTourFinder dict={dict} locale={locale} /></div>
      </div>

      <section id="service" aria-labelledby="service-title" className="home-editorial scroll-mt-24">
        <div className="home-editorial-grid">
          <div data-reveal className="space-y-6">
            <p className="editorial-kicker text-sage-ink">{dict.homeIntro.kicker}</p>
            <h2 id="service-title" className="headline-section font-bold text-ink">{dict.homeIntro.title}</h2>
            <p className="max-w-xl text-base sm:text-lg text-muted leading-relaxed">{dict.homeIntro.description}</p>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <Link to="/tours" className="liquid-glass-button-primary inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage">
                {dict.homeIntro.toursCta}<ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link to="/about" className="inline-flex items-center gap-2 py-3 text-sm font-medium text-muted hover:text-ink transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage">
                {dict.homeIntro.aboutCta}<ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
          <div className="destination-sketches">
            <p className="destination-sketches-label"><Compass size={18} strokeWidth={1.5} aria-hidden="true" />{dict.homeAtmosphere.destinationsLabel}</p>
            <div data-reveal-group className="destination-sketches-photos">
              {destinations.map((destination) => (
                <Link data-reveal="card" key={destination.id} to={`/destinations/${destination.id}`} className="destination-sketch">
                  <div className="destination-sketch-image">
                    <picture>
                      <source srcSet={destination.media.heroImage.replace(/\.jpg$/, ".webp")} type="image/webp" />
                      <img src={destination.media.heroImage} alt={destination.tagline[locale]} loading="lazy" decoding="async" />
                    </picture>
                    <ArrowUpRight size={18} aria-hidden="true" />
                  </div>
                  <span className="destination-sketch-name">{destination.name[locale]}</span>
                  <span className="destination-sketch-coordinate">{destination.coordinates}</span>
                </Link>
              ))}
            </div>
            <p className="destination-sketches-origin"><MapPin size={14} aria-hidden="true" />{dict.homeAtmosphere.departure}</p>
          </div>
        </div>
        <dl data-reveal-group className="home-service-notes">
            {dict.homeIntro.items.map((item) => (
              <div data-reveal key={item.title}>
                <dt className="font-display text-lg font-semibold text-ink">{item.title}</dt>
                <dd className="max-w-lg text-sm text-muted leading-relaxed">{item.text}</dd>
              </div>
            ))}
        </dl>
      </section>

      <FinalCTA dict={dict} locale={locale} reducedMotion={reducedMotion} />
    </div>
  );
};
