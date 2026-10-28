import { useState, useEffect, useCallback } from "react";
import { tours } from "../data/tours";

const STORAGE_KEY = "all_tour_favorites_v1";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? [...new Set(parsed.filter((id) => typeof id === "string" && tours.some((tour) => tour.id === id)))] : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Ignore localStorage errors in private browsing
    }
  }, [favorites]);

  const toggleFavorite = useCallback((tourId: string) => {
    setFavorites((prev) =>
      prev.includes(tourId) ? prev.filter((id) => id !== tourId) : [...prev, tourId]
    );
  }, []);

  const isFavorite = useCallback(
    (tourId: string) => favorites.includes(tourId),
    [favorites]
  );

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
  };
}
