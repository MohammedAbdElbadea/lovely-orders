"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Brand } from "@/types/domain.types";

interface BrandCarouselProps {
  brands: Brand[];
  title?: string;
}

export function BrandCarousel({
  brands,
  title = "Featured Brands",
}: BrandCarouselProps) {
  if (brands.length === 0) return null;

  return (
    <section className="border-b border-luxury-border/20 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl tracking-wide text-luxury-white sm:text-3xl">
            {title}
          </h2>
          <Link
            href="/brands"
            className="text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-hover"
          >
            View All
          </Link>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin sm:gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="shrink-0"
            >
              <Link
                href={`/brands/${brand.slug}`}
                className="group flex h-28 w-40 flex-col items-center justify-center rounded-luxury border border-luxury-border/20 bg-premium-black p-4 transition-all hover:border-gold/40 sm:h-32 sm:w-48"
              >
                {brand.logo_url ? (
                  <div className="relative h-12 w-full sm:h-14">
                    <Image
                      src={brand.logo_url}
                      alt={brand.name}
                      fill
                      className="object-contain opacity-80 transition-opacity group-hover:opacity-100"
                      sizes="160px"
                    />
                  </div>
                ) : (
                  <span className="font-display text-lg text-luxury-white transition-colors group-hover:text-gold">
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
