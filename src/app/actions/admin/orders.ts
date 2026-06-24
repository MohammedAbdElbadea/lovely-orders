"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/rbac/server-auth";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { actionError, actionSuccess, type ActionResult } from "@/lib/actions/types";
import type { OrderStatus } from "@/types/domain.types";

const statusSchema = z.object({
  status: z.enum([
    "pending_payment",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "completed",
    "cancelled",
  ]),
  note: z.string().optional(),
});

export async function updateOrderStatus(
  orderId: string,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requirePermission(PERMISSIONS.ORDERS_UPDATE);
  } catch {
    return actionError("Insufficient permissions");
  }

  const parsed = statusSchema.safeParse({
    status: formData.get("status"),
    note: formData.get("note") || undefined,
  });

  if (!parsed.success) {
    return actionError(parsed.error.errors[0]?.message ?? "Invalid status");
  }

  const supabase = await createClient();
  const session = await requirePermission(PERMISSIONS.ORDERS_UPDATE);

  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (!order) return actionError("Order not found");

  const { error } = await supabase
    .from("orders")
    .update({ status: parsed.data.status as OrderStatus })
    .eq("id", orderId);

  if (error) return actionError(error.message);

  await supabase.from("order_status_history").insert({
    order_id: orderId,
    previous_status: order.status,
    new_status: parsed.data.status,
    changed_by: session.admin.id,
    note: parsed.data.note,
  });

  await supabase.from("audit_logs").insert({
    admin_user_id: session.admin.id,
    action: "update_status",
    entity_type: "order",
    entity_id: orderId,
    old_values: { status: order.status },
    new_values: { status: parsed.data.status },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return actionSuccess();
}

export async function verifyPayment(orderId: string): Promise<ActionResult> {
  try {
    await requirePermission(PERMISSIONS.ORDERS_VERIFY_PAYMENT);
  } catch {
    return actionError("Insufficient permissions");
  }

  const supabase = await createClient();
  const session = await requirePermission(PERMISSIONS.ORDERS_VERIFY_PAYMENT);

  const { data: order } = await supabase
    .from("orders")
    .select("payment_status, status")
    .eq("id", orderId)
    .single();

  if (!order) return actionError("Order not found");

  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: "verified",
      status: order.status === "pending_payment" ? "paid" : order.status,
    })
    .eq("id", orderId);

  if (error) return actionError(error.message);

  if (order.status === "pending_payment") {
    await supabase.from("order_status_history").insert({
      order_id: orderId,
      previous_status: order.status,
      new_status: "paid",
      changed_by: session.admin.id,
      note: "Payment verified",
    });
  }

  await supabase.from("audit_logs").insert({
    admin_user_id: session.admin.id,
    action: "verify_payment",
    entity_type: "order",
    entity_id: orderId,
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  return actionSuccess();
}

export async function updateOrderNotes(
  orderId: string,
  notes: string
): Promise<ActionResult> {
  try {
    await requirePermission(PERMISSIONS.ORDERS_UPDATE);
  } catch {
    return actionError("Insufficient permissions");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ internal_notes: notes })
    .eq("id", orderId);

  if (error) return actionError(error.message);

  revalidatePath(`/admin/orders/${orderId}`);
  return actionSuccess();
}
