import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Route,
  Users,
  Minus,
  Plus,
  SlidersHorizontal,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { tours } from "../../data/tours";
import { destinations } from "../../data/destinations";
import { buildWhatsAppBookingUrl, type Locale } from "../../lib/whatsapp";
import {
  defaultTourPlan,
  formatPlanDates,
  matchesTourPlan,
  writeTourPlan,
  type TourPlan,
} from "../../lib/tourPlanner";
import type { Dictionary } from "../../i18n/ru";
import { TravelCalendar } from "./TravelCalendar";

interface Props {
  locale: Locale;
  dict: Dictionary;
  plan?: TourPlan;
  onChange?: (plan: TourPlan) => void;
  resultCount?: number;
}

export function SmartTourFinder({
  locale,
  dict,
  plan: controlledPlan,
  onChange,
  resultCount,
}: Props) {
  const [localPlan, setLocalPlan] = useState<TourPlan>(defaultTourPlan);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const plan = controlledPlan || localPlan;
  const update = onChange || setLocalPlan;
  const t = dict.planner;
  const availableTours = tours.filter(
    (tour) =>
      plan.destination === "all" || tour.destinationId === plan.destination,
  );
  const count =
    resultCount ?? tours.filter((tour) => matchesTourPlan(tour, plan)).length;
  const selectedTour = tours.find((tour) => tour.slug === plan.tour);
  const destination = destinations.find((item) => item.id === plan.destination);
  const whatsappUrl = buildWhatsAppBookingUrl({
    locale,
    destinationName: destination?.name[locale] || dict.finder.allDestinations,
    tourTitle: selectedTour?.title[locale],
    desiredDate: formatPlanDates(plan, locale),
    travelersCount: plan.travelers,
    comment: [
      dict.finder.whatsappComment,
      plan.duration !== "all" ? dict.finder.durations[plan.duration] : "",
      plan.type !== "all"
        ? plan.type === "multi_day"
          ? t.multiDay
          : dict.finder.types[plan.type]
        : "",
    ]
      .filter(Boolean)
      .join(" · "),
  });
  const showResults = () => {
    if (controlledPlan)
      document
        .getElementById("tour-results")
        ?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
    else
      navigate(
        `/tours?${writeTourPlan(plan, new URLSearchParams({ lang: locale }))}#tour-results`,
      );
  };

  return (
    <section
      id="tour-planner"
      className="tour-planner"
      data-reveal
      aria-labelledby="planner-title"
    >
      <div className="planner-heading">
        <div>
          <p className="planner-kicker">{t.kicker}</p>
          <h2 id="planner-title">{t.title}</h2>
          <p className="planner-subtitle">{t.subtitle}</p>
        </div>
        <span className="planner-departure">
          <MapPin size={15} aria-hidden="true" />
          {t.departure}
        </span>
      </div>
      <div className="planner-fields">
        <label className="planner-field" htmlFor="finder-destination">
          <MapPin size={21} aria-hidden="true" />
          <span>
            <span className="planner-field-label">
              {dict.finder.destinationLabel}
            </span>
            <select
              id="finder-destination"
              value={plan.destination}
              onChange={(event) =>
                update({
                  ...plan,
                  destination: event.target.value as TourPlan["destination"],
                  tour: "",
                })
              }
            >
              <option value="all">{dict.finder.allDestinations}</option>
              {destinations.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name[locale]}
                </option>
              ))}
            </select>
          </span>
        </label>
        <label className="planner-field" htmlFor="finder-tour">
          <Route size={21} aria-hidden="true" />
          <span>
            <span className="planner-field-label">{t.tourLabel}</span>
            <select
              id="finder-tour"
              value={plan.tour}
              onChange={(event) =>
                update({
                  ...plan,
                  tour: event.target.value,
                  duration: "all",
                  type: "all",
                })
              }
            >
              <option value="">{t.anyTour}</option>
              {availableTours.map((tour) => (
                <option key={tour.slug} value={tour.slug}>
                  {tour.title[locale]}
                </option>
              ))}
            </select>
          </span>
        </label>
        <TravelCalendar
          plan={plan}
          onChange={update}
          dict={dict}
          locale={locale}
        />
        <div className="planner-field planner-travelers">
          <Users size={21} aria-hidden="true" />
          <div>
            <label htmlFor="finder-travelers" className="planner-field-label">
              {t.travelersLabel}
            </label>
            <div className="planner-stepper">
              <button
                type="button"
                aria-label={t.fewer}
                disabled={plan.travelers <= 1}
                onClick={() =>
                  update({ ...plan, travelers: plan.travelers - 1 })
                }
              >
                <Minus size={15} />
              </button>
              <input
                id="finder-travelers"
                type="number"
                inputMode="numeric"
                min={1}
                max={50}
                value={plan.travelers}
                onChange={(event) => {
                  const count = Number(event.target.value);
                  if (Number.isInteger(count) && count >= 1 && count <= 50)
                    update({ ...plan, travelers: count });
                }}
              />
              <button
                type="button"
                aria-label={t.more}
                disabled={plan.travelers >= 50}
                onClick={() =>
                  update({ ...plan, travelers: plan.travelers + 1 })
                }
              >
                <Plus size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="planner-options-bar">
        <button
          type="button"
          className="planner-settings-toggle"
          aria-expanded={settingsOpen}
          aria-controls="planner-settings"
          onClick={() => setSettingsOpen(!settingsOpen)}
        >
          <SlidersHorizontal size={16} aria-hidden="true" />
          {t.settings}
          {(plan.duration !== "all" || plan.type !== "all") && (
            <span className="planner-settings-count">
              {Number(plan.duration !== "all") + Number(plan.type !== "all")}
            </span>
          )}
          <ChevronDown
            size={15}
            className={settingsOpen ? "rotate-180" : ""}
            aria-hidden="true"
          />
        </button>
        <button
          type="button"
          className="planner-text-button"
          onClick={() => update({ ...defaultTourPlan })}
        >
          {t.reset}
        </button>
      </div>
      {settingsOpen && (
        <div id="planner-settings" className="planner-settings">
          <label htmlFor="finder-duration">
            {dict.finder.durationLabel}
            <select
              id="finder-duration"
              value={plan.duration}
              onChange={(event) =>
                update({
                  ...plan,
                  tour: "",
                  duration: event.target.value as TourPlan["duration"],
                })
              }
            >
              {Object.entries(dict.finder.durations).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="finder-type">
            {dict.finder.typeLabel}
            <select
              id="finder-type"
              value={plan.type}
              onChange={(event) =>
                update({
                  ...plan,
                  tour: "",
                  type: event.target.value as TourPlan["type"],
                })
              }
            >
              {Object.entries(dict.finder.types).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
              <option value="multi_day">{t.multiDay}</option>
            </select>
          </label>
        </div>
      )}
      <div className="planner-footer">
        <p className="planner-date-note">
          <span className="planner-note-dot" aria-hidden="true" />
          {t.dateNote}
        </p>
        <div className="planner-submit-area">
          <span
            className="planner-result-count"
            aria-live="polite"
            aria-atomic="true"
          >
            {dict.finder.foundCount.replace("{count}", String(count))}
          </span>
          <button
            type="button"
            className="planner-submit"
            onClick={showResults}
          >
            {t.showTours}
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        </div>
      </div>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="planner-consultation"
      >
        <MessageCircle size={16} aria-hidden="true" />
        {t.request}
        <ArrowRight size={14} aria-hidden="true" />
      </a>
    </section>
  );
}
