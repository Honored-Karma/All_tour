import { useState, useCallback, useEffect } from "react";
import { tours } from "../data/tours";

const STORAGE_KEY = "alltour_comparison_v1";

export function useTourComparison(maxAllowed: number = 3) {
  const [comparedTours, setComparedTours] = useState<string[]>(() => {
    try {
      const stored: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(stored) ? [...new Set(stored.filter((id) => typeof id === "string" && tours.some((tour) => tour.id === id)))].slice(0, maxAllowed) : [];
    } catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(comparedTours)); } catch {}
  }, [comparedTours]);

  const toggleCompare = useCallback(
    (tourId: string) => {
      setComparedTours((prev) => {
        if (prev.includes(tourId)) {
          return prev.filter((id) => id !== tourId);
        }
        if (prev.length >= maxAllowed) {
          return prev;
        }
        return [...prev, tourId];
      });
    },
    [maxAllowed]
  );

  const isCompared = useCallback(
    (tourId: string) => comparedTours.includes(tourId),
    [comparedTours]
  );

  const clearCompare = useCallback(() => {
    setComparedTours([]);
  }, []);

  return {
    comparedTours,
    toggleCompare,
    isCompared,
    clearCompare,
    compareCount: comparedTours.length,
  };
}
