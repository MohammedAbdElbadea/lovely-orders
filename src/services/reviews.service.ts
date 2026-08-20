import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_REVIEWS } from "@/lib/demo-data";
import type { Review, ReviewStatus } from "@/types/domain.types";

export interface SubmitReviewInput {
  product_id: string;
  reviewer_name: string;
  rating: number;
  title?: string;
  content?: string;
  customer_id?: string;
}

export async function getReviews(options?: {
  productId?: string;
  status?: ReviewStatus;
  limit?: number;
}): Promise<Review[]> {
  const limit = options?.limit ?? 20;

  if (!isSupabaseConfigured()) {
    let reviews = [...DEMO_REVIEWS];
    if (options?.productId) {
      reviews = reviews.filter((r) => r.product_id === options.productId);
    }
    if (options?.status) {
      reviews = reviews.filter((r) => r.status === options.status);
    }
    return reviews.slice(0, limit);
  }

  try {
    const supabase = await createClient();
    let query = supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (options?.productId) query = query.eq("product_id", options.productId);
    if (options?.status) query = query.eq("status", options.status);
    else query = query.eq("status", "approved");

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      let reviews = [...DEMO_REVIEWS];
      if (options?.productId) {
        reviews = reviews.filter((r) => r.product_id === options.productId);
      }
      if (options?.status) {
        reviews = reviews.filter((r) => r.status === options.status);
      }
      return reviews.slice(0, limit);
    }
    return data as Review[];
  } catch {
    let reviews = [...DEMO_REVIEWS];
    if (options?.productId) {
      reviews = reviews.filter((r) => r.product_id === options.productId);
    }
    if (options?.status) {
      reviews = reviews.filter((r) => r.status === options.status);
    }
    return reviews.slice(0, limit);
  }
}

export async function getApprovedReviews(limit = 6): Promise<Review[]> {
  return getReviews({ status: "approved", limit });
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  return getReviews({ productId, status: "approved" });
}

export async function submitReview(input: SubmitReviewInput): Promise<Review> {
  if (!isSupabaseConfigured()) {
    const review: Review = {
      id: crypto.randomUUID(),
      product_id: input.product_id,
      customer_id: input.customer_id ?? null,
      reviewer_name: input.reviewer_name,
      rating: input.rating,
      title: input.title ?? null,
      content: input.content ?? null,
      status: "pending",
      created_at: new Date().toISOString(),
    };
    DEMO_REVIEWS.unshift(review);
    return review;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      product_id: input.product_id,
      customer_id: input.customer_id ?? null,
      reviewer_name: input.reviewer_name,
      rating: input.rating,
      title: input.title,
      content: input.content,
      status: "pending",
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Review;
}

export async function moderateReview(
  id: string,
  status: ReviewStatus
): Promise<Review> {
  if (!isSupabaseConfigured()) {
    const review = DEMO_REVIEWS.find((r) => r.id === id);
    if (!review) throw new Error("Review not found");
    review.status = status;
    return review;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Review;
}
