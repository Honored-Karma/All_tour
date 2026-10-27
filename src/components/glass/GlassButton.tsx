import React, { useRef, useState } from "react";

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "subtle";
  href?: string;
  target?: string;
  rel?: string;
  magnetic?: boolean;
  children: React.ReactNode;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  variant = "primary",
  href,
  target,
  rel,
  magnetic = false,
  className = "",
  children,
  ...props
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!magnetic || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.12;
    const deltaY = (e.clientY - centerY) * 0.12;
    setOffset({
      x: Math.max(-6, Math.min(6, deltaX)),
      y: Math.max(-4, Math.min(4, deltaY)),
    });
  };

  const handleMouseLeave = () => {
    if (!magnetic) return;
    setOffset({ x: 0, y: 0 });
  };

  const variantClasses =
    variant === "primary"
      ? "liquid-glass-button-primary font-semibold"
      : variant === "secondary"
      ? "liquid-glass-button-secondary font-medium"
      : "liquid-glass-subtle text-ink hover:border-line font-medium";

  const baseClasses = `inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl text-sm whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage ${variantClasses} ${className}`;

  const style: React.CSSProperties | undefined = magnetic
    ? {
        transform: `translate3d(${offset.x.toFixed(1)}px, ${offset.y.toFixed(1)}px, 0)`,
      }
    : undefined;

  if (href) {
    return (
      <a
        ref={(node) => {
          ref.current = node;
        }}
        href={href}
        target={target}
        rel={rel}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        className={baseClasses}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={(node) => {
        ref.current = node;
      }}
      type="button"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={baseClasses}
      {...props}
    >
      {children}
    </button>
  );
};
