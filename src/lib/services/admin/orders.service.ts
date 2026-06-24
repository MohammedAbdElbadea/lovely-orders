import { createClient } from "@/lib/supabase/server";
import type { Order, OrderStatus, PaginatedResult } from "@/types/domain.types";

export interface OrderFilters {
  status?: OrderStatus;
  paymentStatus?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export async function getOrders(
  filters: OrderFilters = {}
): Promise<PaginatedResult<Order>> {
  const supabase = await createClient();
  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;

  let query = supabase.from("orders").select("*", { count: "exact" });

  if (filters.status) query = query.eq("status", filters.status);
  if (filters.paymentStatus)
    query = query.eq("payment_status", filters.paymentStatus);
  if (filters.search) {
    query = query.or(
      `order_number.ilike.%${filters.search}%,guest_name.ilike.%${filters.search}%,guest_phone.ilike.%${filters.search}%`
    );
  }

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    data: (data ?? []) as Order[],
    total: count ?? 0,
    limit,
    offset,
  };
}

export async function getOrderById(id: string) {
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();

  if (!order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", id);

  const { data: history } = await supabase
    .from("order_status_history")
    .select("*")
    .eq("order_id", id)
    .order("created_at", { ascending: true });

  return {
    ...(order as Order),
    items: items ?? [],
    statusHistory: history ?? [],
  };
}
