"use client";

import Image, { type ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ProductImageProps extends Omit<ImageProps, "onError"> {
  fallbackClassName?: string;
}

function ProductImage({
  src,
  alt,
  className,
  fallbackClassName,
  ...props
}: ProductImageProps) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-surface-elevated text-luxury-muted",
          fallbackClassName,
          className
        )}
        role="img"
        aria-label={alt || "Product image unavailable"}
      >
        <ImageOff className="h-8 w-8 opacity-50" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {!loaded && (
        <div
          className="absolute inset-0 animate-pulse bg-surface-elevated"
          aria-hidden="true"
        />
      )}
      <Image
        src={src}
        alt={alt}
        className={cn(
          "object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
    </div>
  );
}

export { ProductImage };
