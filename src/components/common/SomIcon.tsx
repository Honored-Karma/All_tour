import React from "react";

export interface SomIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * Graphical currency symbol of the Kyrgyzstani Som.
 * Matched to the circular geometric design (circular 'C' with 45° radial cuts and horizontal underline).
 *
 * Drawn with pure vector contours (no <text>, no system font, no word "сом", no plain C without underline).
 * Color: currentColor, transparent background, optical height ~1em.
 * Lower underline bar is fully contained within the viewBox.
 */
export const SomIcon: React.FC<SomIconProps> = ({
  className = "",
  size,
  style,
  ...props
}) => {
  return (
    <svg
      viewBox="130 85 290 410"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      role="img"
      className={`inline-block shrink-0 align-middle ${className}`}
      style={{
        width: size || "0.75em",
        height: size || "1.05em",
        verticalAlign: "-0.14em",
        ...style,
      }}
      {...props}
    >
      {/* Circular letter 'C' contour with 45-degree radial end cuts */}
      <path d="M 413.26,141.74 A 163 163 0 1 0 413.26,372.26 L 384.97,343.97 A 123 123 0 1 1 384.97,170.03 Z" />
      {/* Separate horizontal line strictly underneath letter 'C' */}
      <path d="M 145,449 h 270 v 37 h -270 Z" />
    </svg>
  );
};

export default SomIcon;
