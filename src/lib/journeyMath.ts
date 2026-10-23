import type { DestinationId } from "../data/destinations";

export interface SceneInterpolationState {
  activeDestinationId: DestinationId;
  activeIndex: number;
  overallProgress: number; // 0 to 1
  sceneWeights: Record<DestinationId, number>;
  sceneLocalProgress: Record<DestinationId, number>;
  transitionPhase: "settled" | "transitioning";
}

const ORDER: DestinationId[] = ["kyrgyzstan", "georgia", "china"];

export function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

export function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/**
 * Computes continuous weights and local camera progress for the 3-world scroll journey:
 * 0.00 - 0.24: Kyrgyzstan primary
 * 0.24 - 0.40: Crossfade transition Kyrgyzstan -> Georgia
 * 0.40 - 0.62: Georgia primary
 * 0.62 - 0.78: Crossfade transition Georgia -> China
 * 0.78 - 1.00: China primary
 */
export function computeJourneyState(rawProgress: number): SceneInterpolationState {
  const p = clamp01(rawProgress);

  let wKyrgyzstan = 0;
  let wGeorgia = 0;
  let wChina = 0;
  let transitionPhase: "settled" | "transitioning" = "settled";

  if (p < 0.24) {
    wKyrgyzstan = 1;
  } else if (p < 0.4) {
    const t = smoothstep(0.24, 0.4, p);
    wKyrgyzstan = 1 - t;
    wGeorgia = t;
    transitionPhase = "transitioning";
  } else if (p < 0.62) {
    wGeorgia = 1;
  } else if (p < 0.78) {
    const t = smoothstep(0.62, 0.78, p);
    wGeorgia = 1 - t;
    wChina = t;
    transitionPhase = "transitioning";
  } else {
    wChina = 1;
  }

  let activeIndex = 0;
  if (p >= 0.7) {
    activeIndex = 2;
  } else if (p >= 0.32) {
    activeIndex = 1;
  }

  const activeDestinationId = ORDER[activeIndex];

  const sceneLocalProgress: Record<DestinationId, number> = {
    kyrgyzstan: clamp01(p / 0.4),
    georgia: clamp01((p - 0.24) / (0.78 - 0.24)),
    china: clamp01((p - 0.62) / (1 - 0.62)),
  };

  return {
    activeDestinationId,
    activeIndex,
    overallProgress: p,
    sceneWeights: {
      kyrgyzstan: Number(wKyrgyzstan.toFixed(4)),
      georgia: Number(wGeorgia.toFixed(4)),
      china: Number(wChina.toFixed(4)),
    },
    sceneLocalProgress,
    transitionPhase,
  };
}

export function getTargetProgressForDestination(destinationId: DestinationId): number {
  switch (destinationId) {
    case "kyrgyzstan":
      return 0.1;
    case "georgia":
      return 0.51;
    case "china":
      return 0.9;
  }
}
