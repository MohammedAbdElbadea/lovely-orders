"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requirePermission } from "@/lib/rbac/server-auth";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { actionError, actionSuccess, type ActionResult } from "@/lib/actions/types";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_ORDERS, DEMO_PRODUCTS } from "@/lib/demo-data";
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

function revalidateAllOrderPaths(orderId: string) {
  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/inventory/low-stock");
  revalidatePath("/admin/inventory/out-of-stock");
  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

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

  const newStatus = parsed.data.status as OrderStatus;

  if (!isSupabaseConfigured()) {
    const order = DEMO_ORDERS.find((o) => o.id === orderId);
    if (!order) return actionError("Order not found");
    const oldStatus = order.status;
    order.status = newStatus;
    order.updated_at = new Date().toISOString();

    // Restock logic for demo mode
    if (newStatus === "cancelled" && oldStatus !== "cancelled") {
      for (const item of order.items ?? []) {
        const prod = DEMO_PRODUCTS.find((p) => p.id === item.product_id);
        if (prod) {
          prod.stock_quantity = (prod.stock_quantity ?? 0) + item.quantity;
          prod.is_available = prod.stock_quantity > 0;
        }
      }
    } else if (oldStatus === "cancelled" && newStatus !== "cancelled") {
      for (const item of order.items ?? []) {
        const prod = DEMO_PRODUCTS.find((p) => p.id === item.product_id);
        if (prod) {
          prod.stock_quantity = Math.max(0, (prod.stock_quantity ?? 0) - item.quantity);
          prod.is_available = prod.stock_quantity > 0;
        }
      }
    }

    revalidateAllOrderPaths(orderId);
    return actionSuccess();
  }

  const supabase = await createClient();
  const session = await requirePermission(PERMISSIONS.ORDERS_UPDATE);

  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (!order) return actionError("Order not found");
  const oldStatus = order.status as OrderStatus;

  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) return actionError(error.message);

  // Automatic Stock Restock Logic on Cancellation in Supabase Mode
  if (newStatus === "cancelled" && oldStatus !== "cancelled") {
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    if (orderItems) {
      for (const item of orderItems) {
        if (!item.product_id) continue;
        const productId = item.product_id;
        const { data: prod } = await supabase
          .from("products")
          .select("stock_quantity")
          .eq("id", productId)
          .maybeSingle();

        if (prod && prod.stock_quantity !== null) {
          const newStock = prod.stock_quantity + item.quantity;
          await supabase
            .from("products")
            .update({ stock_quantity: newStock, is_available: newStock > 0 })
            .eq("id", productId);
        }
      }
    }
  } else if (oldStatus === "cancelled" && newStatus !== "cancelled") {
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    if (orderItems) {
      for (const item of orderItems) {
        if (!item.product_id) continue;
        const productId = item.product_id;
        const { data: prod } = await supabase
          .from("products")
          .select("stock_quantity")
          .eq("id", productId)
          .maybeSingle();

        if (prod && prod.stock_quantity !== null) {
          const newStock = Math.max(0, prod.stock_quantity - item.quantity);
          await supabase
            .from("products")
            .update({ stock_quantity: newStock, is_available: newStock > 0 })
            .eq("id", productId);
        }
      }
    }
  }

  await supabase.from("order_status_history").insert({
    order_id: orderId,
    previous_status: oldStatus,
    new_status: newStatus,
    changed_by: session.admin.id,
    note: parsed.data.note,
  });

  await supabase.from("audit_logs").insert({
    admin_user_id: session.admin.id,
    action: "update_status",
    entity_type: "order",
    entity_id: orderId,
    old_values: { status: oldStatus },
    new_values: { status: newStatus },
  });

  revalidateAllOrderPaths(orderId);
  return actionSuccess();
}

export async function verifyPayment(orderId: string): Promise<ActionResult> {
  try {
    await requirePermission(PERMISSIONS.ORDERS_VERIFY_PAYMENT);
  } catch {
    return actionError("Insufficient permissions");
  }

  if (!isSupabaseConfigured()) {
    const order = DEMO_ORDERS.find((o) => o.id === orderId);
    if (!order) return actionError("Order not found");
    order.payment_status = "verified";
    if (order.status === "pending_payment") {
      order.status = "paid";
    }
    order.updated_at = new Date().toISOString();
    revalidateAllOrderPaths(orderId);
    return actionSuccess();
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

  revalidateAllOrderPaths(orderId);
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

  if (!isSupabaseConfigured()) {
    const order = DEMO_ORDERS.find((o) => o.id === orderId);
    if (!order) return actionError("Order not found");
    order.internal_notes = notes;
    order.updated_at = new Date().toISOString();
    revalidatePath(`/admin/orders/${orderId}`);
    return actionSuccess();
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
