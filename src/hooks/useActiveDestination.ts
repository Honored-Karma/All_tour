import { useEffect } from "react";
import { getDestinationById, type DestinationId } from "../data/destinations";

export function useSyncSceneTheme(activeDestinationId: DestinationId): void {
  useEffect(() => {
    if (typeof document === "undefined") return;
    const dest = getDestinationById(activeDestinationId);
    const root = document.documentElement;
    root.style.setProperty("--scene-primary", dest.palette.primary);
    root.style.setProperty("--scene-accent", dest.palette.accent);
    root.style.setProperty("--scene-surface", dest.palette.surface);
    root.style.setProperty("--scene-charcoal", dest.palette.charcoal);
    root.style.setProperty("--scene-glass-tint", dest.palette.glassTint);
    root.style.setProperty("--scene-glow", dest.palette.glowColor);
  }, [activeDestinationId]);
}
