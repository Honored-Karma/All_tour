import React, { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import {
  dateKey,
  formatPlanDates,
  isDateKey,
  todayKey,
  type TourPlan,
} from "../../lib/tourPlanner";

interface Props {
  plan: TourPlan;
  onChange: (next: TourPlan) => void;
  dict: Dictionary;
  locale: Locale;
}

export function TravelCalendar({ plan, onChange, dict, locale }: Props) {
  const t = dict.planner;
  const today = todayKey();
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() =>
    new Date(`${plan.from || today}T12:00:00`).setDate(1),
  );
  const [focusDay, setFocusDay] = useState(plan.from || today);
  const trigger = useRef<HTMLButtonElement>(null);
  const calendar = useRef<HTMLDivElement>(null);
  const language = locale === "kz" ? "kk-KZ" : "ru-RU";

  useEffect(() => {
    if (open) {
      const day = plan.from || today;
      setFocusDay(day);
      setMonth(new Date(`${day}T12:00:00`).setDate(1));
      const frame = requestAnimationFrame(() => {
        calendar.current
          ?.querySelector<HTMLButtonElement>(`[data-day="${day}"]`)
          ?.focus({ preventScroll: true });
        calendar.current?.scrollIntoView({
          block: "start",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [open]);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };
  const changeMonth = (offset: number) => {
    const next = new Date(month);
    next.setMonth(next.getMonth() + offset);
    setMonth(next.getTime());
    setFocusDay(dateKey(next) < today ? today : dateKey(next));
  };
  const chooseDay = (day: string) => {
    setFocusDay(day);
    onChange(
      !plan.from || plan.to || day < plan.from
        ? { ...plan, from: day, to: "" }
        : { ...plan, to: day },
    );
  };
  const moveFocus = (event: React.KeyboardEvent, day: string) => {
    const next = new Date(`${day}T12:00:00`);
    const weekday = (next.getDay() + 6) % 7;
    switch (event.key) {
      case "ArrowLeft":
        next.setDate(next.getDate() - 1);
        break;
      case "ArrowRight":
        next.setDate(next.getDate() + 1);
        break;
      case "ArrowUp":
        next.setDate(next.getDate() - 7);
        break;
      case "ArrowDown":
        next.setDate(next.getDate() + 7);
        break;
      case "Home":
        next.setDate(next.getDate() - weekday);
        break;
      case "End":
        next.setDate(next.getDate() + 6 - weekday);
        break;
      case "PageUp":
        next.setMonth(next.getMonth() - 1);
        break;
      case "PageDown":
        next.setMonth(next.getMonth() + 1);
        break;
      default:
        return;
    }
    event.preventDefault();
    const key = dateKey(next) < today ? today : dateKey(next);
    setFocusDay(key);
    setMonth(new Date(`${key}T12:00:00`).setDate(1));
    requestAnimationFrame(() =>
      calendar.current
        ?.querySelector<HTMLButtonElement>(`[data-day="${key}"]`)
        ?.focus(),
    );
  };
  const renderMonth = (offset: number) => {
    const start = new Date(month);
    start.setMonth(start.getMonth() + offset);
    const prefix = (start.getDay() + 6) % 7;
    const days = new Date(
      start.getFullYear(),
      start.getMonth() + 1,
      0,
    ).getDate();
    return (
      <div
        className={`travel-month ${offset ? "travel-month-secondary" : ""}`}
        key={offset}
      >
        <h4>
          {start.toLocaleDateString(language, {
            month: "long",
            year: "numeric",
          })}
        </h4>
        <div className="travel-weekdays" aria-hidden="true">
          {t.weekdays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <div
          className="travel-days"
          role="group"
          aria-label={start.toLocaleDateString(language, {
            month: "long",
            year: "numeric",
          })}
        >
          {Array.from({ length: prefix }, (_, i) => (
            <span key={`empty-${i}`} />
          ))}
          {Array.from({ length: days }, (_, i) => {
            const day = dateKey(
              new Date(start.getFullYear(), start.getMonth(), i + 1),
            );
            const selected = day === plan.from || day === plan.to;
            const inRange =
              !!plan.from && !!plan.to && day > plan.from && day < plan.to;
            return (
              <button
                key={day}
                type="button"
                data-day={day}
                disabled={day < today}
                tabIndex={day === focusDay ? 0 : -1}
                aria-pressed={selected || inRange}
                aria-current={day === today ? "date" : undefined}
                aria-label={new Date(`${day}T12:00:00`).toLocaleDateString(
                  language,
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
                className={`${selected ? "is-selected" : ""} ${inRange ? "is-in-range" : ""}`}
                onKeyDown={(event) => moveFocus(event, day)}
                onClick={() => chooseDay(day)}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`travel-date-control ${open ? "is-open" : ""}`}>
      <button
        ref={trigger}
        type="button"
        className="planner-field planner-date-trigger"
        aria-expanded={open}
        aria-controls="travel-calendar"
        onClick={() => setOpen(!open)}
      >
        <CalendarDays size={21} aria-hidden="true" />
        <span>
          <span className="planner-field-label">{t.datesLabel}</span>
          <span className="planner-field-value">
            {formatPlanDates(plan, locale) || t.anyDates}
          </span>
        </span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <div
          id="travel-calendar"
          className="travel-calendar"
          ref={calendar}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              close();
            }
          }}
        >
          <div className="travel-calendar-heading">
            <div>
              <h3>{t.calendarTitle}</h3>
              <p id="calendar-hint">{t.calendarHint}</p>
            </div>
            <div className="travel-month-navigation">
              <button
                type="button"
                aria-label={t.previousMonth}
                disabled={
                  dateKey(new Date(month)).slice(0, 7) <= today.slice(0, 7)
                }
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label={t.nextMonth}
                onClick={() => changeMonth(1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="travel-date-inputs">
            <label>
              {t.from}
              <input
                type="date"
                aria-describedby="calendar-hint"
                min={today}
                value={plan.from}
                onChange={(event) => {
                  const from = event.target.value;
                  if (from && (!isDateKey(from) || from < today)) return;
                  onChange({
                    ...plan,
                    from,
                    to: from && plan.to >= from ? plan.to : "",
                  });
                  if (from) {
                    setMonth(new Date(`${from}T12:00:00`).setDate(1));
                    setFocusDay(from);
                  }
                }}
              />
            </label>
            <label>
              {t.to}
              <input
                type="date"
                aria-describedby="calendar-hint"
                min={plan.from || today}
                disabled={!plan.from}
                value={plan.to}
                onChange={(event) => {
                  const to = event.target.value;
                  if (!to || (isDateKey(to) && to >= plan.from))
                    onChange({ ...plan, to });
                }}
              />
            </label>
          </div>
          <div className="travel-months">
            {renderMonth(0)}
            {renderMonth(1)}
          </div>
          <div className="travel-calendar-footer">
            <label className="planner-checkbox">
              <input
                type="checkbox"
                checked={plan.flexible}
                onChange={(event) =>
                  onChange({ ...plan, flexible: event.target.checked })
                }
              />
              {t.flexible}
            </label>
            <div className="travel-calendar-actions">
              <button
                type="button"
                className="planner-text-button"
                onClick={() =>
                  onChange({ ...plan, from: "", to: "", flexible: false })
                }
              >
                {t.clearDates}
              </button>
              <button
                type="button"
                className="planner-calendar-done"
                onClick={close}
              >
                <Check size={16} aria-hidden="true" />
                {t.done}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
