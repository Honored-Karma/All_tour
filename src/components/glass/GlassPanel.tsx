import React, { useRef } from "react";

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  interactiveReflection?: boolean;
  subtle?: boolean;
  children: React.ReactNode;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({
  interactiveReflection = true,
  subtle = false,
  className = "",
  children,
  ...props
}) => {
  const panelRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveReflection || !panelRef.current) return;
    const rect = panelRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    panelRef.current.style.setProperty("--spotlight-x", `${x}px`);
    panelRef.current.style.setProperty("--spotlight-y", `${y}px`);
  };

  return (
    <div
      ref={panelRef}
      onMouseMove={handleMouseMove}
      className={`${subtle ? "liquid-glass-subtle rounded-2xl" : "liquid-glass-panel"} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
