"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/rbac/server-auth";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { actionError, actionSuccess, type ActionResult } from "@/lib/actions/types";

const adjustStockSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.coerce.number().int(),
  reason: z.enum(["sale", "restock", "adjustment", "return", "damage"]),
  note: z.string().optional(),
});

export async function adjustStock(formData: FormData): Promise<ActionResult> {
  try {
    await requirePermission(PERMISSIONS.INVENTORY_MANAGE);
  } catch {
    return actionError("Insufficient permissions");
  }

  const parsed = adjustStockSchema.safeParse({
    productId: formData.get("productId"),
    quantity: formData.get("quantity"),
    reason: formData.get("reason"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return actionError(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const session = await requirePermission(PERMISSIONS.INVENTORY_MANAGE);

  const { data: product } = await supabase
    .from("products")
    .select("stock_quantity")
    .eq("id", parsed.data.productId)
    .single();

  if (!product) return actionError("Product not found");

  const previousQty = product.stock_quantity;
  const newQty = Math.max(0, previousQty + parsed.data.quantity);
  const changeAmount = newQty - previousQty;

  const { error: updateError } = await supabase
    .from("products")
    .update({ stock_quantity: newQty })
    .eq("id", parsed.data.productId);

  if (updateError) return actionError(updateError.message);

  await supabase.from("inventory_logs").insert({
    product_id: parsed.data.productId,
    previous_quantity: previousQty,
    new_quantity: newQty,
    change_amount: changeAmount,
    reason: parsed.data.reason,
    admin_user_id: session.admin.id,
    note: parsed.data.note,
  });

  await supabase.from("audit_logs").insert({
    admin_user_id: session.admin.id,
    action: "adjust_stock",
    entity_type: "product",
    entity_id: parsed.data.productId,
    old_values: { stock_quantity: previousQty },
    new_values: { stock_quantity: newQty },
  });

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/inventory/low-stock");
  revalidatePath("/admin/inventory/out-of-stock");
  return actionSuccess();
}
