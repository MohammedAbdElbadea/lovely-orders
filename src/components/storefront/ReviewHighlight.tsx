"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import type { Review } from "@/types/domain.types";

interface ReviewHighlightProps {
  reviews: Review[];
  title?: string;
}

export function ReviewHighlight({
  reviews,
  title = "What Our Clients Say",
}: ReviewHighlightProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="border-b border-luxury-border/20 bg-premium-black py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-10 text-center font-display text-2xl tracking-wide text-luxury-white sm:text-3xl">
          {title}
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 3).map((review, index) => (
            <motion.blockquote
              key={review.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative rounded-luxury border border-luxury-border/20 bg-deep-black p-6"
            >
              <Quote className="mb-4 h-6 w-6 text-gold/40" />
              {review.content && (
                <p className="mb-4 text-sm leading-relaxed text-luxury-muted line-clamp-4">
                  &ldquo;{review.content}&rdquo;
                </p>
              )}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-luxury-white">
                    {review.reviewer_name}
                  </p>
                  {review.title && (
                    <p className="text-xs text-luxury-muted">{review.title}</p>
                  )}
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < review.rating
                          ? "fill-gold text-gold"
                          : "text-luxury-border"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
