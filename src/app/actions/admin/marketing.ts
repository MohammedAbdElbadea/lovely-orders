"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_COUPONS, DEMO_DISCOUNTS, DEMO_BANNERS } from "@/lib/demo-data";
import { createClient } from "@/lib/supabase/server";
import { actionError, actionSuccess, type ActionResult } from "@/lib/actions/types";
import type { Coupon, Discount, PromotionalBanner, DiscountType } from "@/types/domain.types";

export async function createCouponAction(formData: FormData): Promise<ActionResult> {
  const code = (formData.get("code") as string)?.trim().toUpperCase();
  const rawType = (formData.get("type") as string) || "percentage";
  const discountType: DiscountType = rawType === "fixed" || rawType === "fixed_amount" ? "fixed" : "percentage";
  const value = Number(formData.get("value") || 10);
  const usageLimit = formData.get("usageLimit") ? Number(formData.get("usageLimit")) : null;

  if (!code) {
    return actionError("يرجى إدخال رمز الكود (Promo Code)");
  }
  if (!value || value <= 0) {
    return actionError("يرجى إدخال قيمة خصم صالحة أكبر من صفر");
  }

  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    // Check duplicate code in Demo Mode
    const exists = DEMO_COUPONS.some((c) => c.code.toUpperCase() === code);
    if (exists) {
      return actionError("رمز كود الخصم هذا موجود بالفعل، استخدم رمزاً آخر");
    }

    const discountId = crypto.randomUUID();
    const newDiscount: Discount = {
      id: discountId,
      name: `${code} ${discountType === "percentage" ? `${value}%` : `${value} EGP`} Off`,
      type: discountType,
      value,
      applies_to: "all",
      target_id: null,
      starts_at: now,
      ends_at: null,
      is_active: true,
      status: "active",
      created_at: now,
      updated_at: now,
    };
    DEMO_DISCOUNTS.unshift(newDiscount);

    const newCoupon: Coupon = {
      id: crypto.randomUUID(),
      code,
      discount_id: discountId,
      usage_limit: usageLimit,
      usage_count: 0,
      is_active: true,
      expires_at: null,
      created_at: now,
      discount: newDiscount,
    };
    DEMO_COUPONS.unshift(newCoupon);

    revalidatePath("/admin/marketing/coupons");
    return actionSuccess();
  }

  try {
    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("coupons")
      .select("id")
      .eq("code", code)
      .maybeSingle();

    if (existing) {
      return actionError("رمز كود الخصم هذا موجود بالفعل، استخدم رمزاً آخر");
    }

    const { data: discount, error: discErr } = await supabase
      .from("discounts")
      .insert({
        name: `${code} Discount`,
        type: discountType,
        value,
        applies_to: "all",
        is_active: true,
        status: "active",
      })
      .select("id")
      .single();

    if (discErr || !discount) {
      return actionError(discErr?.message ?? "فشل إضافة الخصم");
    }

    const { error: coupErr } = await supabase.from("coupons").insert({
      code,
      discount_id: discount.id,
      usage_limit: usageLimit,
      usage_count: 0,
      is_active: true,
    });

    if (coupErr) {
      return actionError(coupErr.message);
    }

    revalidatePath("/admin/marketing/coupons");
    return actionSuccess();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create coupon";
    return actionError(msg);
  }
}

export async function toggleCouponStatusAction(couponId: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    const coupon = DEMO_COUPONS.find((c) => c.id === couponId);
    if (!coupon) return actionError("Coupon not found");
    coupon.is_active = !coupon.is_active;
    revalidatePath("/admin/marketing/coupons");
    return actionSuccess();
  }

  try {
    const supabase = await createClient();
    const { data: coupon } = await supabase
      .from("coupons")
      .select("is_active")
      .eq("id", couponId)
      .single();

    if (!coupon) return actionError("Coupon not found");

    const { error } = await supabase
      .from("coupons")
      .update({ is_active: !coupon.is_active })
      .eq("id", couponId);

    if (error) return actionError(error.message);

    revalidatePath("/admin/marketing/coupons");
    return actionSuccess();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to toggle coupon";
    return actionError(msg);
  }
}

export async function deleteCouponAction(couponId: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    const idx = DEMO_COUPONS.findIndex((c) => c.id === couponId);
    if (idx !== -1) {
      DEMO_COUPONS.splice(idx, 1);
    }
    revalidatePath("/admin/marketing/coupons");
    return actionSuccess();
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("coupons").delete().eq("id", couponId);
    if (error) return actionError(error.message);

    revalidatePath("/admin/marketing/coupons");
    return actionSuccess();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete coupon";
    return actionError(msg);
  }
}

export async function createBannerAction(formData: FormData): Promise<ActionResult> {
  const title = (formData.get("title") as string)?.trim();
  const subtitle = (formData.get("subtitle") as string)?.trim() || null;
  const imageUrl = (formData.get("imageUrl") as string)?.trim();
  const linkUrl = (formData.get("linkUrl") as string)?.trim() || "/products";

  if (!title || !imageUrl) {
    return actionError("يرجى إدخال عنوان البنر ورابط الصورة");
  }

  const now = new Date().toISOString();

  if (!isSupabaseConfigured()) {
    const newBanner: PromotionalBanner = {
      id: crypto.randomUUID(),
      title,
      subtitle,
      image_url: imageUrl,
      link_url: linkUrl,
      placement: "homepage",
      sort_order: DEMO_BANNERS.length + 1,
      is_active: true,
      starts_at: now,
      ends_at: null,
      created_at: now,
    };
    DEMO_BANNERS.unshift(newBanner);
    revalidatePath("/admin/marketing/banners");
    return actionSuccess();
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("promotional_banners").insert({
      title,
      subtitle,
      image_url: imageUrl,
      link_url: linkUrl,
      placement: "homepage",
      sort_order: 1,
      is_active: true,
    });

    if (error) return actionError(error.message);

    revalidatePath("/admin/marketing/banners");
    return actionSuccess();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create banner";
    return actionError(msg);
  }
}

export async function toggleBannerStatusAction(bannerId: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    const banner = DEMO_BANNERS.find((b) => b.id === bannerId);
    if (!banner) return actionError("Banner not found");
    banner.is_active = !banner.is_active;
    revalidatePath("/admin/marketing/banners");
    return actionSuccess();
  }

  try {
    const supabase = await createClient();
    const { data: banner } = await supabase
      .from("promotional_banners")
      .select("is_active")
      .eq("id", bannerId)
      .single();

    if (!banner) return actionError("Banner not found");

    const { error } = await supabase
      .from("promotional_banners")
      .update({ is_active: !banner.is_active })
      .eq("id", bannerId);

    if (error) return actionError(error.message);

    revalidatePath("/admin/marketing/banners");
    return actionSuccess();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to toggle banner";
    return actionError(msg);
  }
}

export async function deleteBannerAction(bannerId: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    const idx = DEMO_BANNERS.findIndex((b) => b.id === bannerId);
    if (idx !== -1) {
      DEMO_BANNERS.splice(idx, 1);
    }
    revalidatePath("/admin/marketing/banners");
    return actionSuccess();
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("promotional_banners").delete().eq("id", bannerId);
    if (error) return actionError(error.message);

    revalidatePath("/admin/marketing/banners");
    return actionSuccess();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete banner";
    return actionError(msg);
  }
}
