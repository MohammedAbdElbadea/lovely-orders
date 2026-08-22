"use client";

import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import type { Brand } from "@/types/domain.types";

interface BrandCarouselProps {
  brands: Brand[];
  title?: string;
}

export function BrandCarousel({
  brands = [],
  title = "العلامات التجارية الفاخرة - Featured Brands",
}: BrandCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      direction: "rtl",
      dragFree: true,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  if (!brands || brands.length === 0) return null;

  return (
    <section className="border-b border-luxury-border/30 bg-surface-elevated/40 py-10 sm:py-14 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold animate-pulse" />
            <h2 className="font-display text-lg font-bold tracking-wide text-luxury-white sm:text-2xl">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/brands"
              className="group flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-hover font-semibold transition-colors"
            >
              <span>عرض الكل</span>
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Embla Touch & Autoplay Carousel */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex gap-4 sm:gap-6 -mr-4 pr-4">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="shrink-0 flex-[0_0_150px] sm:flex-[0_0_190px] md:flex-[0_0_220px]"
              >
                <Link
                  href={`/brands/${brand.slug}`}
                  className="group flex h-24 sm:h-28 flex-col items-center justify-center rounded-2xl border border-luxury-border/30 bg-premium-black/60 p-4 transition-all duration-300 hover:border-gold/60 hover:bg-surface-elevated hover:shadow-xl hover-lift"
                >
                  {brand.logo_url ? (
                    <div className="relative h-10 w-full sm:h-12">
                      <Image
                        src={brand.logo_url}
                        alt={brand.name}
                        fill
                        className="object-contain opacity-85 transition-opacity group-hover:opacity-100"
                        sizes="200px"
                      />
                    </div>
                  ) : (
                    <span className="font-display text-sm sm:text-base font-bold text-luxury-white transition-colors group-hover:text-gold text-center">
                      {brand.name}
                    </span>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
