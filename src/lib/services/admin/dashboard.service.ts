import { createClient } from "@/lib/supabase/server";
import type { Order, Product } from "@/types/domain.types";

export interface DashboardStats {
  revenue: number;
  ordersCount: number;
  productsCount: number;
  lowStockCount: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const [ordersRes, productsRes, lowStockRes] = await Promise.all([
    supabase
      .from("orders")
      .select("total_amount, payment_status")
      .neq("status", "cancelled"),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .lte("stock_quantity", 5)
      .gt("stock_quantity", 0),
  ]);

  const orders = ordersRes.data ?? [];
  const revenue = orders
    .filter((o) => o.payment_status === "verified")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  return {
    revenue,
    ordersCount: orders.length,
    productsCount: productsRes.count ?? 0,
    lowStockCount: lowStockRes.count ?? 0,
  };
}

export async function getRecentOrders(limit = 5): Promise<Order[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as Order[];
}

export async function getLowStockProducts(limit = 5): Promise<Product[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .lte("stock_quantity", 5)
    .gt("stock_quantity", 0)
    .order("stock_quantity", { ascending: true })
    .limit(limit);

  return (data ?? []) as Product[];
}
