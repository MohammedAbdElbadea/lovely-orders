"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ProductImage } from "@/types/domain.types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);
  const primary = sorted.find((i) => i.is_primary) ?? sorted[0];
  const [active, setActive] = useState(primary?.id ?? "");

  const activeImage = sorted.find((i) => i.id === active) ?? primary;

  if (!activeImage) {
    return (
      <div className="aspect-square rounded-luxury bg-surface-elevated" />
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-luxury bg-surface-elevated">
        <Image
          src={activeImage.url}
          alt={activeImage.alt_text ?? productName}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(image.id)}
              className={cn(
                "relative h-16 w-16 shrink-0 overflow-hidden rounded-luxury border-2 transition-colors",
                activeImage.id === image.id
                  ? "border-gold"
                  : "border-transparent hover:border-luxury-border/40"
              )}
            >
              <Image
                src={image.url}
                alt={image.alt_text ?? productName}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
