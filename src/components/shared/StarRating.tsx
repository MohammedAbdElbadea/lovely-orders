"use client";

import { Star } from "lucide-react";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

export interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
  showValue?: boolean;
}

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

function StarRating({
  rating,
  maxRating = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
  showValue = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const displayRating = hoverRating ?? rating;

  const handleClick = useCallback(
    (index: number) => {
      if (interactive && onChange) {
        onChange(index + 1);
      }
    },
    [interactive, onChange]
  );

  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role={interactive ? "radiogroup" : "img"}
      aria-label={
        interactive
          ? `Rate ${rating} out of ${maxRating} stars`
          : `Rating: ${rating} out of ${maxRating} stars`
      }
    >
      {Array.from({ length: maxRating }, (_, index) => {
        const filled = displayRating >= index + 1;
        const partial =
          !filled &&
          displayRating > index &&
          displayRating < index + 1;
        const fillPercent = partial
          ? Math.round((displayRating - index) * 100)
          : filled
            ? 100
            : 0;

        const starContent = (
          <>
            <Star
              className={cn(sizeClasses[size], "text-luxury-border/40")}
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fillPercent}%` }}
            >
              <Star
                className={cn(sizeClasses[size], "fill-gold text-gold")}
                aria-hidden="true"
              />
            </div>
          </>
        );

        if (interactive) {
          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={filled}
              aria-label={`${index + 1} stars`}
              className={cn(
                "relative transition-transform cursor-pointer hover:scale-110",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
              )}
              onClick={() => handleClick(index)}
              onMouseEnter={() => setHoverRating(index + 1)}
              onMouseLeave={() => setHoverRating(null)}
            >
              {starContent}
            </button>
          );
        }

        return (
          <span key={index} className="relative" aria-hidden="true">
            {starContent}
          </span>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm text-luxury-muted">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}

export { StarRating };
