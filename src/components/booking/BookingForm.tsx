import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { destinations, type DestinationId } from "../../data/destinations";
import { tours, type Tour } from "../../data/tours";
import type { Dictionary } from "../../i18n/ru";
import {
  buildWhatsAppBookingUrl,
  formatWhatsAppMessage,
  validateBookingPayload,
  type Locale,
} from "../../lib/whatsapp";
import { GlassPanel } from "../glass/GlassPanel";
import { readCampaign, trackEvent } from "../../lib/analytics";
import { isLeadCaptureEnabled, saveLead } from "../../lib/leads";

interface BookingFormProps {
  dict: Dictionary;
  locale: Locale;
  mode?: "consultation" | "tour";
  captureLeads?: boolean;
  preselectedDestinationId?: DestinationId;
  preselectedTour?: Tour | null;
  initialDesiredDate?: string;
  initialTravelers?: number;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  dict,
  locale,
  mode = "tour",
  captureLeads = isLeadCaptureEnabled(),
  preselectedDestinationId,
  preselectedTour,
  initialDesiredDate = "",
  initialTravelers = 2,
}) => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const startedRef = useRef(false);
  const savingRef = useRef(false);
  const mountedRef = useRef(true);
  const requestRef = useRef<{ fingerprint: string; key: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savedLeadId, setSavedLeadId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState(false);
  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);
  const [destinationId, setDestinationId] = useState<DestinationId | "">(
    preselectedTour?.destinationId || preselectedDestinationId || (mode === "consultation" ? "" : "kyrgyzstan")
  );
  const [tourId, setTourId] = useState<string>(preselectedTour?.id || "");
  const [desiredDate, setDesiredDate] = useState(initialDesiredDate);
  const [travelersCount, setTravelersCount] = useState<string>(String(initialTravelers));
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    contact?: string;
    destination?: string;
    desiredDate?: string;
    travelersCount?: string;
  }>({});
  const [submittedWhatsappUrl, setSubmittedWhatsappUrl] = useState<string | null>(
    null
  );
  const [submittedMessagePreview, setSubmittedMessagePreview] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (preselectedTour) {
      setDestinationId(preselectedTour.destinationId);
      setTourId(preselectedTour.id);
    } else if (preselectedDestinationId) {
      setDestinationId(preselectedDestinationId);
    }
  }, [preselectedDestinationId, preselectedTour]);

  const availableTours = tours.filter(
    (t) => !destinationId || t.destinationId === destinationId
  );

  const selectedDestination = destinations.find((d) => d.id === destinationId);
  const selectedTour = tours.find((t) => t.id === tourId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingRef.current) return;

    const payload = {
      name,
      contact,
      destinationId,
      destinationName: selectedDestination?.name[locale] || "",
      tourTitle: selectedTour?.title[locale] || "",
      desiredDate,
      travelersCount,
      comment,
      locale,
    };

    const validation = validateBookingPayload(payload, locale, {
      destination: mode === "tour", date: mode === "tour", contact: captureLeads,
    });
    if (!validation.valid) {
      trackEvent("form_invalid", { locale, source: "form", count: Object.keys(validation.errors).length });
      setErrors(validation.errors);
      setSubmittedWhatsappUrl(null);
      const fields = { name: "booking-name", contact: "booking-contact", destination: "booking-country", desiredDate: "booking-date", travelersCount: "booking-travelers" };
      const first = Object.keys(validation.errors)[0] as keyof typeof fields;
      formRef.current?.querySelector<HTMLElement>(`#${fields[first]}`)?.focus();
      return;
    }

    setErrors({});
    const url = buildWhatsAppBookingUrl(payload);
    const preview = formatWhatsAppMessage(payload);
    setSubmittedWhatsappUrl(url);
    setSubmittedMessagePreview(preview);
    setSaveError(false);
    setSavedLeadId(null);
    if (captureLeads) {
      savingRef.current = true;
      setIsSaving(true);
      const request = { ...payload, tourId: selectedTour?.id || "", mode, attribution: readCampaign() };
      const fingerprint = JSON.stringify(request);
      if (requestRef.current?.fingerprint !== fingerprint) requestRef.current = { fingerprint, key: crypto.randomUUID() };
      try {
        const id = await saveLead(request, requestRef.current.key);
        if (!mountedRef.current) return;
        setSavedLeadId(id);
        trackEvent("lead_saved", { locale, source: "form", tourId: selectedTour?.id });
      } catch {
        if (mountedRef.current) { setSaveError(true); trackEvent("app_error", { locale, source: "form" }); }
        return;
      } finally {
        savingRef.current = false;
        if (mountedRef.current) setIsSaving(false);
      }
    }
    trackEvent("message_ready", { locale, source: "form", tourId: selectedTour?.id });

    // Open in a new tab using a transient anchor click (respecting iframe safety)
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  return (
    <GlassPanel id="booking" className="scroll-mt-28 p-6 sm:p-10">
      <div className="mb-8 space-y-2">
        <h3 className="font-display text-xl sm:text-2xl font-bold text-ink">
          {mode === "consultation" ? dict.bookingForm.consultationTitle : dict.bookingForm.title}
        </h3>
        <p className="text-sm text-muted leading-relaxed">
          {dict.bookingForm.subtitle}
        </p>
      </div>

      <form ref={formRef} aria-busy={isSaving} onSubmit={handleSubmit} onFocus={() => {
        if (!startedRef.current) { startedRef.current = true; trackEvent("form_start", { locale, source: "form" }); }
      }} noValidate className="space-y-5">
        {Object.values(errors).some(Boolean) && <p role="alert" className="text-sm text-accent">{dict.bookingForm.errorSummary}</p>}
        <fieldset disabled={isSaving} className="min-w-0 grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label
              htmlFor="booking-name"
              className="block text-xs font-medium text-muted mb-2"
            >
              {dict.bookingForm.nameLabel}
            </label>
            <input
              id="booking-name"
              type="text"
              name="name"
              autoComplete="name"
              required
              maxLength={80}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "booking-name-error" : undefined}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder={dict.bookingForm.namePlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-surface-soft border border-line text-ink placeholder:text-muted text-base sm:text-sm focus:outline-none focus:border-sage"
            />
            {errors.name && (
              <p id="booking-name-error" className="mt-1.5 text-xs text-accent">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="booking-contact" className="block text-xs font-medium text-muted mb-2">{captureLeads ? dict.bookingForm.contactRequiredLabel : dict.bookingForm.contactLabel}</label>
            <input id="booking-contact" name="tel" type="tel" required={captureLeads} autoComplete="tel" inputMode="tel" maxLength={30}
              value={contact} onChange={(event) => { setContact(event.target.value); setErrors((previous) => ({ ...previous, contact: undefined })); }}
              aria-invalid={!!errors.contact} aria-describedby={errors.contact ? "booking-contact-error" : "booking-contact-hint"}
              placeholder="+7 700 123 45 67"
              className="w-full px-4 py-3 rounded-xl bg-surface-soft border border-line text-ink text-base sm:text-sm focus:border-sage" />
            <p id="booking-contact-hint" className="mt-1.5 text-xs text-muted">{captureLeads ? dict.bookingForm.captureContactHint : dict.bookingForm.contactHint}</p>
            {errors.contact && <p id="booking-contact-error" className="mt-1.5 text-xs text-accent">{errors.contact}</p>}
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="booking-country"
              className="block text-xs font-medium text-muted mb-2"
            >
              {mode === "consultation" ? dict.finder.destinationLabel : dict.bookingForm.countryLabel}
            </label>
            <select
              id="booking-country"
              name="destination"
              required={mode === "tour"}
              aria-invalid={!!errors.destination}
              aria-describedby={errors.destination ? "booking-country-error" : undefined}
              value={destinationId}
              onChange={(e) => {
                const nextDest = e.target.value as DestinationId | "";
                setDestinationId(nextDest);
                setTourId("");
                if (errors.destination)
                  setErrors((prev) => ({ ...prev, destination: undefined }));
              }}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-ink text-base sm:text-sm focus:outline-none focus:border-sage"
            >
              <option value="">{mode === "consultation" ? dict.planner.anyTour : dict.bookingForm.countryPlaceholder}</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name[locale]}
                </option>
              ))}
            </select>
            {errors.destination && (
              <p id="booking-country-error" className="mt-1.5 text-xs text-accent">
                {errors.destination}
              </p>
            )}
          </div>

          {/* Tour */}
          <div>
            <label
              htmlFor="booking-tour"
              className="block text-xs font-medium text-muted mb-2"
            >
              {dict.bookingForm.tourLabel}
            </label>
            <select
              id="booking-tour"
              name="tour"
              value={tourId}
              onChange={(e) => {
                setTourId(e.target.value);
                const nextTour = tours.find((tour) => tour.id === e.target.value);
                if (nextTour) setDestinationId(nextTour.destinationId);
              }}
              className="w-full px-4 py-3 rounded-xl bg-surface border border-line text-ink text-base sm:text-sm focus:outline-none focus:border-sage"
            >
              <option value="">{dict.bookingForm.tourPlaceholder}</option>
              {availableTours.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title[locale]}
                </option>
              ))}
            </select>
          </div>

          {/* Desired Date */}
          <div>
            <label
              htmlFor="booking-date"
              className="block text-xs font-medium text-muted mb-2"
            >
              {mode === "consultation" ? dict.bookingForm.optionalDateLabel : dict.bookingForm.dateLabel}
            </label>
            <input
              id="booking-date"
              type="text"
              name="desiredDate"
              maxLength={160}
              required={mode === "tour"}
              aria-invalid={!!errors.desiredDate}
              aria-describedby={errors.desiredDate ? "booking-date-error" : undefined}
              value={desiredDate}
              onChange={(e) => {
                setDesiredDate(e.target.value);
                if (errors.desiredDate)
                  setErrors((prev) => ({ ...prev, desiredDate: undefined }));
              }}
              placeholder={dict.bookingForm.datePlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-surface-soft border border-line text-ink placeholder:text-muted text-base sm:text-sm focus:outline-none focus:border-sage"
            />
            {errors.desiredDate && (
              <p id="booking-date-error" className="mt-1.5 text-xs text-accent">
                {errors.desiredDate}
              </p>
            )}
          </div>

          {/* Travelers Count */}
          <div>
            <label
              htmlFor="booking-travelers"
              className="block text-xs font-medium text-muted mb-2"
            >
              {dict.bookingForm.travelersLabel}
            </label>
            <input
              id="booking-travelers"
              type="number"
              name="travelers"
              step={1}
              required
              aria-invalid={!!errors.travelersCount}
              aria-describedby={errors.travelersCount ? "booking-travelers-error" : undefined}
              min={1}
              max={50}
              value={travelersCount}
              onChange={(e) => {
                setTravelersCount(e.target.value);
                if (errors.travelersCount)
                  setErrors((prev) => ({ ...prev, travelersCount: undefined }));
              }}
              className="w-full px-4 py-3 rounded-xl bg-surface-soft border border-line text-ink text-base sm:text-sm tabular-nums focus:outline-none focus:border-sage"
            />
            {errors.travelersCount && (
              <p id="booking-travelers-error" className="mt-1.5 text-xs text-accent">
                {errors.travelersCount}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="md:col-span-2">
            <label
              htmlFor="booking-comment"
              className="block text-xs font-medium text-muted mb-2"
            >
              {dict.bookingForm.commentLabel}
            </label>
            <textarea
              id="booking-comment"
              rows={3}
              name="comment"
              maxLength={2000}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={dict.bookingForm.commentPlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-surface-soft border border-line text-ink placeholder:text-muted text-base sm:text-sm focus:outline-none focus:border-sage"
            />
          </div>
        </fieldset>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-muted max-w-md">
            {captureLeads ? dict.bookingForm.captureNotice : dict.bookingForm.privacyNote}
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="liquid-glass-button-primary px-7 py-4 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>{isSaving ? dict.bookingForm.saving : captureLeads ? dict.bookingForm.saveAndOpen : dict.bookingForm.submitBtn}</span>
          </button>
        </div>
      </form>

      {saveError && <p role="alert" className="mt-4 text-sm text-accent">{dict.bookingForm.saveError}</p>}

      {submittedWhatsappUrl && submittedMessagePreview && (
        <div
          data-testid="booking-whatsapp-preview"
          role="status"
          className="mt-6 p-5 rounded-2xl bg-surface-soft border border-sage/40 space-y-3"
        >
          {savedLeadId && <p className="text-sm font-semibold text-sage-ink">{dict.bookingForm.savedNotice.replace("{number}", savedLeadId)}</p>}
          <p className="text-xs text-ink leading-relaxed">
            {dict.bookingForm.readyNotice}
          </p>
          <div className="space-y-1">
            <span className="block text-[11px] uppercase tracking-wider text-muted">
              {dict.bookingForm.readyPreviewLabel}
            </span>
            <pre className="text-xs font-mono text-muted whitespace-pre-wrap bg-surface-soft p-3.5 rounded-xl border border-line">
              {submittedMessagePreview}
            </pre>
          </div>
          <a
            href={submittedWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-sage-ink hover:text-ink underline underline-offset-4"
          >
            <span>{dict.bookingForm.openWhatsappManual}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </GlassPanel>
  );
};
