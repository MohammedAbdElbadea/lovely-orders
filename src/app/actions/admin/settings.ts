"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession, requirePermission } from "@/lib/rbac/server-auth";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { actionError, actionSuccess, type ActionResult } from "@/lib/actions/types";

import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_REVIEWS } from "@/lib/demo-data";

async function requireAdminSessionForNotification() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

const settingsSchema = z.object({
  storeName: z.string().min(1).optional(),
  storePhone: z.string().optional(),
  storeEmail: z.string().email().optional().or(z.literal("")),
  vodafoneNumber: z.string().optional(),
  instapayNumber: z.string().optional(),
  lowStockThreshold: z.coerce.number().int().min(0).optional(),
});

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  try {
    await requirePermission(PERMISSIONS.SETTINGS_MANAGE);
  } catch {
    return actionError("Insufficient permissions");
  }

  const parsed = settingsSchema.safeParse({
    storeName: formData.get("storeName") || undefined,
    storePhone: formData.get("storePhone") || undefined,
    storeEmail: formData.get("storeEmail") || undefined,
    vodafoneNumber: formData.get("vodafoneNumber") || undefined,
    instapayNumber: formData.get("instapayNumber") || undefined,
    lowStockThreshold: formData.get("lowStockThreshold") || undefined,
  });

  if (!parsed.success) {
    return actionError(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/settings");
    return actionSuccess();
  }

  const supabase = await createClient();
  const session = await requirePermission(PERMISSIONS.SETTINGS_MANAGE);

  const updates: { key: string; value: import("@/types/database.types").Json }[] = [];

  if (parsed.data.storeName !== undefined) {
    updates.push({ key: "store.name", value: parsed.data.storeName });
  }
  if (parsed.data.storePhone !== undefined || parsed.data.storeEmail !== undefined) {
    updates.push({
      key: "store.contact",
      value: {
        phone: parsed.data.storePhone ?? "",
        email: parsed.data.storeEmail ?? "",
      },
    });
  }
  if (parsed.data.vodafoneNumber !== undefined) {
    updates.push({ key: "payment.vodafone_number", value: parsed.data.vodafoneNumber });
  }
  if (parsed.data.instapayNumber !== undefined) {
    updates.push({ key: "payment.instapay_number", value: parsed.data.instapayNumber });
  }
  if (parsed.data.lowStockThreshold !== undefined) {
    updates.push({
      key: "inventory.low_stock_threshold",
      value: parsed.data.lowStockThreshold,
    });
  }

  for (const item of updates) {
    const { error } = await supabase.from("store_settings").upsert({
      key: item.key,
      value: item.value,
      updated_by: session.admin.id,
      updated_at: new Date().toISOString(),
    });

    if (error) return actionError(error.message);
  }

  await supabase.from("audit_logs").insert({
    admin_user_id: session.admin.id,
    action: "update_settings",
    entity_type: "store_settings",
    new_values: parsed.data,
  });

  revalidatePath("/admin/settings");
  return actionSuccess();
}

export async function toggleHomepageSection(
  id: string,
  isEnabled: boolean
): Promise<ActionResult> {
  try {
    await requirePermission(PERMISSIONS.CMS_MANAGE);
  } catch {
    return actionError("Insufficient permissions");
  }

  if (!isSupabaseConfigured()) {
    revalidatePath("/admin/cms/homepage");
    return actionSuccess();
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("homepage_sections")
    .update({ is_enabled: isEnabled })
    .eq("id", id);

  if (error) return actionError(error.message);

  revalidatePath("/admin/cms/homepage");
  return actionSuccess();
}

export async function moderateReview(
  id: string,
  status: "approved" | "rejected"
): Promise<ActionResult> {
  try {
    await requirePermission(PERMISSIONS.REVIEWS_MODERATE);
  } catch {
    return actionError("Insufficient permissions");
  }

  if (!isSupabaseConfigured()) {
    const review = DEMO_REVIEWS.find((r) => r.id === id);
    if (review) {
      review.status = status;
    }
    revalidatePath("/admin/reviews");
    return actionSuccess();
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ status })
    .eq("id", id);

  if (error) return actionError(error.message);

  revalidatePath("/admin/reviews");
  return actionSuccess();
}

export async function markNotificationRead(id: string): Promise<ActionResult> {
  let session;
  try {
    session = await requireAdminSessionForNotification();
  } catch {
    return actionError("Unauthorized");
  }

  if (!isSupabaseConfigured()) {
    return actionSuccess();
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("admin_user_id", session.admin.id);

  if (error) return actionError(error.message);
  return actionSuccess();
}
