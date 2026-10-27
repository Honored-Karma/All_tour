import React, { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  const isKz = typeof document !== "undefined" && document.documentElement.lang === "kk";

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={isKz ? "Жоғарыға оралу" : "Вернуться наверх"}
      className="fixed bottom-6 right-6 z-40 p-3 rounded-2xl liquid-glass-nav text-muted hover:text-ink transition-all shadow-xl cursor-pointer hover:scale-105 focus-visible:outline-2 focus-visible:outline-sage"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
};
