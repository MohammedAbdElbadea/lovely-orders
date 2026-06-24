"use client";

import { useActionState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitReviewAction } from "@/app/actions/reviews";
import type { Review } from "@/types/domain.types";

interface ReviewListProps {
  reviews: Review[];
  productId: string;
}

export function ReviewSection({ reviews, productId }: ReviewListProps) {
  const [state, formAction, pending] = useActionState(submitReviewAction, null);

  return (
    <section className="mt-16 border-t border-luxury-border/20 pt-12">
      <h2 className="mb-8 font-display text-2xl tracking-wide">
        Customer Reviews ({reviews.length})
      </h2>

      {reviews.length > 0 ? (
        <div className="mb-12 space-y-6">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-luxury border border-luxury-border/20 bg-premium-black p-6"
            >
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium text-luxury-white">
                  {review.reviewer_name}
                </p>
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
              {review.title && (
                <h3 className="mb-2 text-sm font-medium">{review.title}</h3>
              )}
              {review.content && (
                <p className="text-sm text-luxury-muted">{review.content}</p>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="mb-8 text-luxury-muted">
          No reviews yet. Be the first to review this product.
        </p>
      )}

      <div className="rounded-luxury border border-luxury-border/20 bg-premium-black p-6">
        <h3 className="mb-4 font-display text-lg">Write a Review</h3>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="productId" value={productId} />
          <Input name="reviewerName" label="Your Name" required />
          <Input
            name="rating"
            label="Rating (1-5)"
            type="number"
            min={1}
            max={5}
            required
          />
          <Input name="title" label="Review Title" />
          <Textarea name="content" label="Your Review" rows={4} />
          {state?.error && (
            <p className="text-sm text-red-400">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-sm text-emerald-400">
              Thank you! Your review has been submitted for approval.
            </p>
          )}
          <Button type="submit" loading={pending}>
            Submit Review
          </Button>
        </form>
      </div>
    </section>
  );
}
