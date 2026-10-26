import React, { useEffect, useState } from "react";
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

interface BookingFormProps {
  dict: Dictionary;
  locale: Locale;
  preselectedDestinationId?: DestinationId;
  preselectedTour?: Tour | null;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  dict,
  locale,
  preselectedDestinationId,
  preselectedTour,
}) => {
  const [name, setName] = useState("");
  const [destinationId, setDestinationId] = useState<DestinationId | "">(
    preselectedTour?.destinationId || preselectedDestinationId || "kyrgyzstan"
  );
  const [tourId, setTourId] = useState<string>(preselectedTour?.id || "");
  const [desiredDate, setDesiredDate] = useState("");
  const [travelersCount, setTravelersCount] = useState<string>("2");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name,
      destinationId,
      destinationName: selectedDestination?.name[locale] || "",
      tourTitle: selectedTour?.title[locale] || "",
      desiredDate,
      travelersCount,
      comment,
      locale,
    };

    const validation = validateBookingPayload(payload, locale);
    if (!validation.valid) {
      setErrors(validation.errors);
      setSubmittedWhatsappUrl(null);
      return;
    }

    setErrors({});
    const url = buildWhatsAppBookingUrl(payload);
    const preview = formatWhatsAppMessage(payload);
    setSubmittedWhatsappUrl(url);
    setSubmittedMessagePreview(preview);

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
        <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
          {dict.bookingForm.title}
        </h3>
        <p className="text-sm text-[#EDE6DA]/75 leading-relaxed">
          {dict.bookingForm.subtitle}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Name */}
          <div>
            <label
              htmlFor="booking-name"
              className="block text-xs font-medium text-[#EDE6DA]/85 mb-2"
            >
              {dict.bookingForm.nameLabel}
            </label>
            <input
              id="booking-name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              placeholder={dict.bookingForm.namePlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/18 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-[#6BAFB3]"
            />
            {errors.name && (
              <p role="alert" className="mt-1.5 text-xs text-[#f28b82]">
                {errors.name}
              </p>
            )}
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="booking-country"
              className="block text-xs font-medium text-[#EDE6DA]/85 mb-2"
            >
              {dict.bookingForm.countryLabel}
            </label>
            <select
              id="booking-country"
              value={destinationId}
              onChange={(e) => {
                const nextDest = e.target.value as DestinationId | "";
                setDestinationId(nextDest);
                setTourId("");
                if (errors.destination)
                  setErrors((prev) => ({ ...prev, destination: undefined }));
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#121e24] border border-white/18 text-white text-sm focus:outline-none focus:border-[#6BAFB3]"
            >
              <option value="">{dict.bookingForm.countryPlaceholder}</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name[locale]}
                </option>
              ))}
            </select>
            {errors.destination && (
              <p role="alert" className="mt-1.5 text-xs text-[#f28b82]">
                {errors.destination}
              </p>
            )}
          </div>

          {/* Tour */}
          <div>
            <label
              htmlFor="booking-tour"
              className="block text-xs font-medium text-[#EDE6DA]/85 mb-2"
            >
              {dict.bookingForm.tourLabel}
            </label>
            <select
              id="booking-tour"
              value={tourId}
              onChange={(e) => setTourId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#121e24] border border-white/18 text-white text-sm focus:outline-none focus:border-[#6BAFB3]"
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
              className="block text-xs font-medium text-[#EDE6DA]/85 mb-2"
            >
              {dict.bookingForm.dateLabel}
            </label>
            <input
              id="booking-date"
              type="text"
              value={desiredDate}
              onChange={(e) => {
                setDesiredDate(e.target.value);
                if (errors.desiredDate)
                  setErrors((prev) => ({ ...prev, desiredDate: undefined }));
              }}
              placeholder={dict.bookingForm.datePlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/18 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-[#6BAFB3]"
            />
            {errors.desiredDate && (
              <p role="alert" className="mt-1.5 text-xs text-[#f28b82]">
                {errors.desiredDate}
              </p>
            )}
          </div>

          {/* Travelers Count */}
          <div>
            <label
              htmlFor="booking-travelers"
              className="block text-xs font-medium text-[#EDE6DA]/85 mb-2"
            >
              {dict.bookingForm.travelersLabel}
            </label>
            <input
              id="booking-travelers"
              type="number"
              min={1}
              max={50}
              value={travelersCount}
              onChange={(e) => {
                setTravelersCount(e.target.value);
                if (errors.travelersCount)
                  setErrors((prev) => ({ ...prev, travelersCount: undefined }));
              }}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/18 text-white text-sm tabular-nums focus:outline-none focus:border-[#6BAFB3]"
            />
            {errors.travelersCount && (
              <p role="alert" className="mt-1.5 text-xs text-[#f28b82]">
                {errors.travelersCount}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="md:col-span-2">
            <label
              htmlFor="booking-comment"
              className="block text-xs font-medium text-[#EDE6DA]/85 mb-2"
            >
              {dict.bookingForm.commentLabel}
            </label>
            <textarea
              id="booking-comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={dict.bookingForm.commentPlaceholder}
              className="w-full px-4 py-3 rounded-xl bg-black/30 border border-white/18 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-[#6BAFB3]"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-[#EDE6DA]/55 max-w-md">
            {dict.bookingForm.privacyNote}
          </p>
          <button
            type="submit"
            className="liquid-glass-button-primary px-7 py-4 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>{dict.bookingForm.submitBtn}</span>
          </button>
        </div>
      </form>

      {submittedWhatsappUrl && submittedMessagePreview && (
        <div
          data-testid="booking-whatsapp-preview"
          className="mt-6 p-5 rounded-2xl bg-black/40 border border-[#6BAFB3]/40 space-y-3"
        >
          <p className="text-xs text-[#EDE6DA]/90 leading-relaxed">
            {dict.bookingForm.readyNotice}
          </p>
          <div className="space-y-1">
            <span className="block text-[11px] uppercase tracking-wider text-white/50">
              {dict.bookingForm.readyPreviewLabel}
            </span>
            <pre className="text-xs font-mono text-[#EDE6DA]/85 whitespace-pre-wrap bg-black/30 p-3.5 rounded-xl border border-white/10">
              {submittedMessagePreview}
            </pre>
          </div>
          <a
            href={submittedWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#6BAFB3] hover:text-white underline underline-offset-4"
          >
            <span>{dict.bookingForm.openWhatsappManual}</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      )}
    </GlassPanel>
  );
};
