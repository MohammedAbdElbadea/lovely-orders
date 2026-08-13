"use client";

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2 } from "lucide-react";
import type { Review } from "@/types/domain.types";

interface ReviewHighlightProps {
  reviews: Review[];
  title?: string;
}

export function ReviewHighlight({
  reviews,
  title = "آراء وتجارب عميلاتنا الفاخرة - Customer Reviews",
}: ReviewHighlightProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="border-b border-luxury-border/30 bg-surface-elevated/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            ثقة ورضاء العملاء أولويتنا
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-wide text-luxury-white sm:text-3xl">
            {title}
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 3).map((review, index) => (
            <motion.blockquote
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative flex flex-col justify-between rounded-luxury border border-luxury-border/40 bg-white p-6 shadow-xs hover-lift transition-all"
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <Quote className="h-8 w-8 text-gold/30" />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-luxury-border"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {review.content && (
                  <p className="mb-6 text-sm leading-relaxed text-luxury-muted italic">
                    &ldquo;{review.content}&rdquo;
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-luxury-border/20 pt-4">
                <div>
                  <p className="text-sm font-bold text-luxury-white">
                    {review.reviewer_name}
                  </p>
                  {review.title && (
                    <p className="text-xs text-gold font-medium">{review.title}</p>
                  )}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" />
                  <span>شراء مؤكد</span>
                </div>
              </div>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
