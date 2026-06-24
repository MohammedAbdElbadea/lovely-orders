"use server";

import { z } from "zod";
import { submitReview } from "@/services/reviews.service";

const reviewSchema = z.object({
  productId: z.string().uuid(),
  reviewerName: z.string().min(2, "Name is required"),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().optional(),
  content: z.string().optional(),
});

export interface SubmitReviewState {
  success?: boolean;
  error?: string;
}

export async function submitReviewAction(
  _prevState: SubmitReviewState | null,
  formData: FormData
): Promise<SubmitReviewState> {
  try {
    const parsed = reviewSchema.safeParse({
      productId: formData.get("productId"),
      reviewerName: formData.get("reviewerName"),
      rating: formData.get("rating"),
      title: formData.get("title") || undefined,
      content: formData.get("content") || undefined,
    });

    if (!parsed.success) {
      return {
        error: parsed.error.errors[0]?.message ?? "Invalid review data",
      };
    }

    await submitReview({
      product_id: parsed.data.productId,
      reviewer_name: parsed.data.reviewerName,
      rating: parsed.data.rating,
      title: parsed.data.title,
      content: parsed.data.content,
    });

    return { success: true };
  } catch (err) {
    console.error("Submit review error:", err);
    return { error: "Failed to submit review. Please try again." };
  }
}
