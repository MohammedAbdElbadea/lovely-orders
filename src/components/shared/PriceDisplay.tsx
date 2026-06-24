"use client";

import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  currency?: string;
  locale?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  showDiscountBadge?: boolean;
}

const sizeClasses = {
  sm: {
    price: "text-sm",
    compare: "text-xs",
  },
  md: {
    price: "text-base",
    compare: "text-sm",
  },
  lg: {
    price: "text-2xl",
    compare: "text-base",
  },
};

function PriceDisplay({
  price,
  compareAtPrice,
  currency = "USD",
  locale = "en-US",
  className,
  size = "md",
  showDiscountBadge = true,
}: PriceDisplayProps) {
  const hasDiscount =
    compareAtPrice != null && compareAtPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span
        className={cn(
          "font-medium text-luxury-white",
          sizeClasses[size].price,
          hasDiscount && "text-gold"
        )}
      >
        {formatPrice(price, currency, locale)}
      </span>

      {hasDiscount && (
        <>
          <span
            className={cn(
              "text-luxury-muted line-through",
              sizeClasses[size].compare
            )}
          >
            {formatPrice(compareAtPrice, currency, locale)}
          </span>
          {showDiscountBadge && discountPercent > 0 && (
            <Badge variant="sale">-{discountPercent}%</Badge>
          )}
        </>
      )}
    </div>
  );
}

export { PriceDisplay };
