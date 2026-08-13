"use server";

import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_COUPONS, DEMO_DISCOUNTS } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";

export interface ValidateCouponResult {
  success: boolean;
  error?: string;
  couponId?: string;
  code?: string;
  discountAmount?: number;
  discountType?: "percentage" | "fixed_amount";
  discountValue?: number;
}

export async function validateCouponAction(
  codeRaw: string,
  subtotal: number
): Promise<ValidateCouponResult> {
  const code = codeRaw?.trim().toUpperCase();
  if (!code) {
    return { success: false, error: "يرجى إدخال كود الخصم" };
  }

  if (!isSupabaseConfigured()) {
    const coupon = DEMO_COUPONS.find(
      (c) => c.code.toUpperCase() === code
    );

    if (!coupon) {
      return { success: false, error: "كود الخصم غير صحيح" };
    }

    if (!coupon.is_active) {
      return { success: false, error: "هذا الكود غير نَشِط حالياً" };
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { success: false, error: "لقد انتهت صلاحية كود الخصم هذا" };
    }

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return { success: false, error: "تم استنفاد الحد الأقصى لاستخدام هذا الكود" };
    }

    const discount = coupon.discount || DEMO_DISCOUNTS.find((d) => d.id === coupon.discount_id);
    let discountAmount = 0;
    const type = discount?.type ?? "percentage";
    const val = discount?.value ?? 10;

    if (type === "percentage") {
      discountAmount = (subtotal * val) / 100;
    } else {
      discountAmount = val;
    }

    discountAmount = Math.min(subtotal, Math.max(0, discountAmount));

    return {
      success: true,
      couponId: coupon.id,
      code: coupon.code,
      discountAmount,
      discountType: type as "percentage" | "fixed_amount",
      discountValue: val,
    };
  }

  try {
    const supabase = await createClient();
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*, discount:discounts(*)")
      .eq("code", code)
      .maybeSingle();

    if (error || !coupon) {
      return { success: false, error: "كود الخصم غير صحيح" };
    }

    if (!coupon.is_active) {
      return { success: false, error: "هذا الكود غير نَشِط حالياً" };
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return { success: false, error: "لقد انتهت صلاحية كود الخصم هذا" };
    }

    if (coupon.usage_limit && coupon.usage_count >= coupon.usage_limit) {
      return { success: false, error: "تم استنفاد الحد الأقصى لاستخدام هذا الكود" };
    }

    const discount = coupon.discount;
    const type = discount?.type ?? "percentage";
    const val = discount?.value ?? 10;
    let discountAmount = 0;

    if (type === "percentage") {
      discountAmount = (subtotal * val) / 100;
    } else {
      discountAmount = val;
    }

    discountAmount = Math.min(subtotal, Math.max(0, discountAmount));

    return {
      success: true,
      couponId: coupon.id,
      code: coupon.code,
      discountAmount,
      discountType: type as "percentage" | "fixed_amount",
      discountValue: val,
    };
  } catch (err) {
    console.error("Validate coupon error:", err);
    return { success: false, error: "حدث خطأ أثناء التحقق من الكود" };
  }
}
