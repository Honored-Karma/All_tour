import React from "react";
import { SomIcon } from "./SomIcon";
import type { TourPriceResult } from "../../lib/currency";

export interface PriceDisplayProps {
  priceResult: TourPriceResult;
  className?: string;
  amountClassName?: string;
}

/**
 * Universal price display component:
 * - Renders amount and currency symbol together in an inline-flex container.
 * - align-items: center, small gap, white-space: nowrap (no line wrap).
 * - For KGS: renders the vector <SomIcon /> with sr-only "кыргызских сомов".
 * - For other currencies: renders standard symbol (₸, $, €, ₾, ¥).
 * - Prefix ≈ for converted prices.
 */
export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  priceResult,
  className = "",
  amountClassName = "",
}) => {
  const isKgs = priceResult.currencyCode === "KGS";

  if (priceResult.rawConverted === null) {
    return <span className={`font-medium text-ink ${className}`}>{priceResult.formatted}</span>;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono tabular-nums whitespace-nowrap text-ink ${className}`}
    >
      {priceResult.prefix && (
        <span className="text-muted text-[0.85em] font-normal select-none">
          {priceResult.prefix.trim()}
        </span>
      )}

      <span className={`font-bold tracking-tight ${amountClassName}`}>
        {priceResult.amountOnly}
      </span>

      {isKgs ? (
        <span
          className="inline-flex items-center ml-0.5 shrink-0 select-none text-ink"
          title="сом"
        >
          <SomIcon className="w-[0.78em] h-[1.1em] shrink-0" />
          <span className="sr-only">кыргызских сомов</span>
        </span>
      ) : (
        <span className="font-normal ml-0.5 select-none">
          {priceResult.symbol}
        </span>
      )}
    </span>
  );
};

export default PriceDisplay;
