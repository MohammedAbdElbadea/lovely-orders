import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_INVENTORY_LOGS, DEMO_PRODUCTS } from "@/lib/demo-data";
import type { InventoryLog, InventoryReason, Product } from "@/types/domain.types";

export async function adjustStock(
  productId: string,
  changeAmount: number,
  reason: InventoryReason,
  options?: {
    variantId?: string;
    adminUserId?: string;
    note?: string;
  }
): Promise<{ product: Product; log: InventoryLog }> {
  if (!isSupabaseConfigured()) {
    const product = DEMO_PRODUCTS.find((p) => p.id === productId);
    if (!product) throw new Error("Product not found");

    const previousQuantity = product.stock_quantity;
    const newQuantity = Math.max(0, previousQuantity + changeAmount);
    product.stock_quantity = newQuantity;
    product.is_available = newQuantity > 0 && product.status === "published";
    product.updated_at = new Date().toISOString();

    const log: InventoryLog = {
      id: crypto.randomUUID(),
      product_id: productId,
      variant_id: options?.variantId ?? null,
      previous_quantity: previousQuantity,
      new_quantity: newQuantity,
      change_amount: changeAmount,
      reason,
      admin_user_id: options?.adminUserId ?? null,
      note: options?.note ?? null,
      created_at: new Date().toISOString(),
    };
    DEMO_INVENTORY_LOGS.unshift(log);

    return { product, log };
  }

  const supabase = createAdminClient();

  const { data: product, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

  if (fetchError || !product) throw new Error("Product not found");

  const previousQuantity = product.stock_quantity;
  const newQuantity = Math.max(0, previousQuantity + changeAmount);

  const { data: updated, error: updateError } = await supabase
    .from("products")
    .update({ stock_quantity: newQuantity })
    .eq("id", productId)
    .select()
    .single();

  if (updateError) throw new Error(updateError.message);

  const { data: log, error: logError } = await supabase
    .from("inventory_logs")
    .insert({
      product_id: productId,
      variant_id: options?.variantId ?? null,
      previous_quantity: previousQuantity,
      new_quantity: newQuantity,
      change_amount: changeAmount,
      reason,
      admin_user_id: options?.adminUserId ?? null,
      note: options?.note ?? null,
    })
    .select()
    .single();

  if (logError) throw new Error(logError.message);

  return { product: updated as Product, log: log as InventoryLog };
}

export async function getLowStock(threshold?: number): Promise<Product[]> {
  const stockThreshold = threshold ?? 5;

  if (!isSupabaseConfigured()) {
    return DEMO_PRODUCTS.filter(
      (p) => p.stock_quantity > 0 && p.stock_quantity <= stockThreshold
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .gt("stock_quantity", 0)
    .lte("stock_quantity", stockThreshold)
    .order("stock_quantity");

  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export async function getOutOfStock(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_PRODUCTS.filter((p) => p.stock_quantity === 0);
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("stock_quantity", 0)
    .order("name");

  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export async function getInventoryLogs(options?: {
  productId?: string;
  limit?: number;
}): Promise<InventoryLog[]> {
  const limit = options?.limit ?? 50;

  if (!isSupabaseConfigured()) {
    let logs = [...DEMO_INVENTORY_LOGS];
    if (options?.productId) {
      logs = logs.filter((l) => l.product_id === options.productId);
    }
    return logs.slice(0, limit);
  }

  const supabase = createAdminClient();
  let query = supabase
    .from("inventory_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (options?.productId) query = query.eq("product_id", options.productId);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as InventoryLog[];
}
