"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import type { Brand } from "@/types/domain.types";

interface BrandCarouselProps {
  brands: Brand[];
  title?: string;
}

export function BrandCarousel({
  brands,
  title = "العلامات التجارية الفاخرة - Featured Brands",
}: BrandCarouselProps) {
  if (brands.length === 0) return null;

  return (
    <section className="border-b border-luxury-border/30 bg-surface-elevated/40 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-gold" />
            <h2 className="font-display text-xl font-bold tracking-wide text-luxury-white sm:text-2xl">
              {title}
            </h2>
          </div>
          <Link
            href="/brands"
            className="group flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-hover font-semibold transition-colors"
          >
            <span>عرض الكل</span>
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin sm:gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              className="shrink-0"
            >
              <Link
                href={`/brands/${brand.slug}`}
                className="group flex h-28 w-44 flex-col items-center justify-center rounded-luxury border border-luxury-border/30 bg-white p-5 transition-all duration-300 hover:border-gold/60 hover:shadow-lg hover-lift sm:h-32 sm:w-52"
              >
                {brand.logo_url ? (
                  <div className="relative h-12 w-full sm:h-14">
                    <Image
                      src={brand.logo_url}
                      alt={brand.name}
                      fill
                      className="object-contain opacity-85 transition-opacity group-hover:opacity-100"
                      sizes="200px"
                    />
                  </div>
                ) : (
                  <span className="font-display text-lg font-bold text-luxury-white transition-colors group-hover:text-gold">
                    {brand.name}
                  </span>
                )}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
