import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      let observer: MutationObserver | undefined;
      const scroll = () => {
        const element = document.getElementById(id);
        if (!element) return false;
        element.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
        observer?.disconnect();
        return true;
      };
      // Lazy route content can commit after the navigation effect.
      const frame = window.requestAnimationFrame(() => {
        if (!scroll()) {
          observer = new MutationObserver(scroll);
          observer.observe(document.querySelector("main") || document.body, { childList: true, subtree: true });
        }
      });
      const timeout = window.setTimeout(() => observer?.disconnect(), 10000);
      return () => { window.cancelAnimationFrame(frame); window.clearTimeout(timeout); observer?.disconnect(); };
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
