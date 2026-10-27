import { useLayoutEffect, type RefObject } from "react";

/** Enhance marked content without making visibility depend on animation support. */
export function useScrollReveal(rootRef: RefObject<HTMLElement | null>, reducedMotion: boolean) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion || typeof IntersectionObserver === "undefined" ||
        typeof Element.prototype.animate !== "function") return;

    const seen = new WeakSet<HTMLElement>();
    const pending = new Map<HTMLElement, Animation>();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        const element = target as HTMLElement;
        const animation = pending.get(element);
        observer.unobserve(element);
        animation?.play();
      });
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

    const register = () => {
      // Release detached cards after filtering or route navigation.
      pending.forEach((animation, element) => {
        if (!root.contains(element)) {
          animation.cancel();
          observer.unobserve(element);
          pending.delete(element);
        }
      });
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        if (seen.has(element)) return;
        seen.add(element);
        const group = element.closest<HTMLElement>("[data-reveal-group]");
        const siblings = group ? [...group.querySelectorAll<HTMLElement>("[data-reveal]")] : [];
        const columns = group ? getComputedStyle(group).gridTemplateColumns.split(" ").length : 1;
        const order = group ? Math.max(0, siblings.indexOf(element)) % Math.max(1, columns) : 0;
        const card = element.dataset.reveal === "card";
        const animation = element.animate([
          { opacity: 0, transform: `translate3d(0, ${card ? 36 : 22}px, 0) scale(${card ? 0.97 : 1})` },
          { opacity: 1, transform: "translate3d(0, 0, 0) scale(1)" },
        ], {
          duration: card ? 720 : 620,
          delay: Math.min(order * 100 + Number(element.dataset.revealDelay || 0), 300),
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "both",
        });
        animation.pause();
        pending.set(element, animation);
        animation.finished.then(() => {
          animation.cancel(); // Remove the transform so hover and sticky children work normally.
          pending.delete(element);
        }).catch(() => {}); // Cancellation on navigation/reduced motion is expected.
        observer.observe(element);
      });
    };

    const revealFocused = (event: FocusEvent) => {
      pending.forEach((animation, element) => {
        if (event.target instanceof Node && element.contains(event.target)) {
          animation.finish();
          observer.unobserve(element);
        }
      });
    };
    register();
    const mutations = new MutationObserver(register);
    mutations.observe(root, { childList: true, subtree: true });
    root.addEventListener("focusin", revealFocused);
    return () => {
      mutations.disconnect();
      observer.disconnect();
      root.removeEventListener("focusin", revealFocused);
      pending.forEach((animation) => animation.cancel());
    };
  }, [rootRef, reducedMotion]);
}
