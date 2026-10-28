import React, { useEffect, useRef } from "react";

/** Update the decorative bar without rendering React on every scroll event. */
export const ScrollProgressIndicator: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      const progress = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
      barRef.current?.style.setProperty("transform", `scaleX(${progress})`);
    };
    const queue = () => { if (!frame) frame = window.requestAnimationFrame(update); };
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(queue);
    observer?.observe(document.documentElement);
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    queue();
    return () => {
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
    };
  }, []);
  return (
    <div aria-hidden="true" className="fixed top-0 left-0 right-0 h-[2px] z-50 pointer-events-none bg-transparent">
      <div ref={barRef} className="h-full bg-sage transition-transform duration-150 ease-out origin-left" style={{ transform: "scaleX(0)" }} />
    </div>
  );
};
