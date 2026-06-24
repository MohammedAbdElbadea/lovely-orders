"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/rbac/server-auth";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { actionError, actionSuccess, type ActionResult } from "@/lib/actions/types";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().min(0),
  compare_at_price: z.coerce.number().optional().nullable(),
  stock_quantity: z.coerce.number().int().min(0),
  low_stock_threshold: z.coerce.number().int().min(0).default(5),
  brand_id: z.string().uuid().optional().nullable(),
  category_id: z.string().uuid().optional().nullable(),
  description: z.string().optional().nullable(),
  short_description: z.string().optional().nullable(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  is_featured: z.coerce.boolean().optional(),
  is_best_seller: z.coerce.boolean().optional(),
  is_new_arrival: z.coerce.boolean().optional(),
  is_on_sale: z.coerce.boolean().optional(),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
});

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function createProduct(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    await requirePermission(PERMISSIONS.PRODUCTS_CREATE);
  } catch {
    return actionError("Insufficient permissions");
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse({
    ...raw,
    is_featured: raw.is_featured === "on" || raw.is_featured === "true",
    is_best_seller: raw.is_best_seller === "on" || raw.is_best_seller === "true",
    is_new_arrival: raw.is_new_arrival === "on" || raw.is_new_arrival === "true",
    is_on_sale: raw.is_on_sale === "on" || raw.is_on_sale === "true",
  });

  if (!parsed.success) {
    return actionError(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const session = await requirePermission(PERMISSIONS.PRODUCTS_CREATE);

  const payload = {
    ...parsed.data,
    slug: parsed.data.slug || slugify(parsed.data.name),
    published_at: parsed.data.status === "published" ? new Date().toISOString() : null,
  };

  const { data, error } = await supabase
    .from("products")
    .insert(payload)
    .select("id")
    .single();

  if (error) return actionError(error.message);

  await supabase.from("audit_logs").insert({
    admin_user_id: session.admin.id,
    action: "create",
    entity_type: "product",
    entity_id: data.id,
    new_values: payload,
  });

  revalidatePath("/admin/products");
  return actionSuccess({ id: data.id });
}

export async function updateProduct(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requirePermission(PERMISSIONS.PRODUCTS_EDIT);
  } catch {
    return actionError("Insufficient permissions");
  }

  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse({
    ...raw,
    is_featured: raw.is_featured === "on" || raw.is_featured === "true",
    is_best_seller: raw.is_best_seller === "on" || raw.is_best_seller === "true",
    is_new_arrival: raw.is_new_arrival === "on" || raw.is_new_arrival === "true",
    is_on_sale: raw.is_on_sale === "on" || raw.is_on_sale === "true",
  });

  if (!parsed.success) {
    return actionError(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const session = await requirePermission(PERMISSIONS.PRODUCTS_EDIT);

  const { data: existing } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  const payload = {
    ...parsed.data,
    slug: parsed.data.slug || slugify(parsed.data.name),
    published_at:
      parsed.data.status === "published" && !existing?.published_at
        ? new Date().toISOString()
        : existing?.published_at,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("products").update(payload).eq("id", id);

  if (error) return actionError(error.message);

  await supabase.from("audit_logs").insert({
    admin_user_id: session.admin.id,
    action: "update",
    entity_type: "product",
    entity_id: id,
    old_values: existing,
    new_values: payload,
  });

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  return actionSuccess();
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    await requirePermission(PERMISSIONS.PRODUCTS_DELETE);
  } catch {
    return actionError("Insufficient permissions");
  }

  const supabase = await createClient();
  const session = await requirePermission(PERMISSIONS.PRODUCTS_DELETE);

  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) return actionError(error.message);

  await supabase.from("audit_logs").insert({
    admin_user_id: session.admin.id,
    action: "delete",
    entity_type: "product",
    entity_id: id,
  });

  revalidatePath("/admin/products");
  return actionSuccess();
}

export async function deleteProductsBulk(ids: string[]): Promise<ActionResult> {
  try {
    await requirePermission(PERMISSIONS.PRODUCTS_DELETE);
  } catch {
    return actionError("Insufficient permissions");
  }

  const supabase = await createClient();
  const session = await requirePermission(PERMISSIONS.PRODUCTS_DELETE);

  const { error } = await supabase.from("products").delete().in("id", ids);

  if (error) return actionError(error.message);

  await supabase.from("audit_logs").insert({
    admin_user_id: session.admin.id,
    action: "bulk_delete",
    entity_type: "product",
    new_values: { ids },
  });

  revalidatePath("/admin/products");
  return actionSuccess();
}
