import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_BANNERS, DEMO_COUPONS, DEMO_DISCOUNTS } from "@/lib/demo-data";
import type { Coupon, Discount, PromotionalBanner } from "@/types/domain.types";

export interface CouponResult {
  valid: boolean;
  discountAmount: number;
  coupon?: Coupon;
  message?: string;
}

export async function getDiscounts(activeOnly = true): Promise<Discount[]> {
  if (!isSupabaseConfigured()) {
    return activeOnly
      ? DEMO_DISCOUNTS.filter((d) => d.is_active && d.status === "active")
      : [...DEMO_DISCOUNTS];
  }

  const supabase = createAdminClient();
  let query = supabase.from("discounts").select("*").order("created_at", {
    ascending: false,
  });

  if (activeOnly) {
    query = query.eq("is_active", true).eq("status", "active");
  }

  const { data, error } = await query;
  if (error || !data || data.length === 0) {
    return activeOnly
      ? DEMO_DISCOUNTS.filter((d) => d.is_active && d.status === "active")
      : [...DEMO_DISCOUNTS];
  }
  return data as Discount[];
}

export async function applyCoupon(
  code: string,
  subtotal: number
): Promise<CouponResult> {
  if (!isSupabaseConfigured()) {
    const coupon = DEMO_COUPONS.find(
      (c) => c.code.toUpperCase() === code.toUpperCase() && c.is_active
    );

    if (!coupon || !coupon.discount) {
      return { valid: false, discountAmount: 0, message: "Invalid coupon code" };
    }

    const discount = coupon.discount;
    let discountAmount = 0;

    if (discount.type === "percentage") {
      discountAmount = (subtotal * discount.value) / 100;
    } else {
      discountAmount = Math.min(discount.value, subtotal);
    }

    return { valid: true, discountAmount, coupon };
  }

  const supabase = createAdminClient();
  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*, discount:discounts(*)")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .maybeSingle();

  if (error || !coupon) {
    return { valid: false, discountAmount: 0, message: "Invalid coupon code" };
  }

  if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
    return { valid: false, discountAmount: 0, message: "Coupon usage limit reached" };
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { valid: false, discountAmount: 0, message: "Coupon has expired" };
  }

  const discount = coupon.discount as Discount;
  if (!discount?.is_active || discount.status !== "active") {
    return { valid: false, discountAmount: 0, message: "Discount is no longer active" };
  }

  let discountAmount = 0;
  if (discount.type === "percentage") {
    discountAmount = (subtotal * discount.value) / 100;
  } else {
    discountAmount = Math.min(discount.value, subtotal);
  }

  return { valid: true, discountAmount, coupon: coupon as Coupon };
}

export async function getBanners(placement = "homepage"): Promise<PromotionalBanner[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_BANNERS.filter(
      (b) => b.is_active && b.placement === placement
    ).sort((a, b) => a.sort_order - b.sort_order);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("promotional_banners")
    .select("*")
    .eq("is_active", true)
    .eq("placement", placement)
    .order("sort_order");

  if (error || !data || data.length === 0) {
    return DEMO_BANNERS.filter(
      (b) => b.is_active && b.placement === placement
    ).sort((a, b) => a.sort_order - b.sort_order);
  }
  return data as PromotionalBanner[];
}
