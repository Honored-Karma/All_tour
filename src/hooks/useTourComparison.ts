import { useState, useCallback } from "react";

export function useTourComparison(maxAllowed: number = 3) {
  const [comparedTours, setComparedTours] = useState<string[]>([]);

  const toggleCompare = useCallback(
    (tourId: string) => {
      setComparedTours((prev) => {
        if (prev.includes(tourId)) {
          return prev.filter((id) => id !== tourId);
        }
        if (prev.length >= maxAllowed) {
          // Replace the oldest item or prevent
          return [...prev.slice(1), tourId];
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
