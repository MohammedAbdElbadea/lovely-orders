import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_ORDERS, DEMO_PRODUCTS } from "@/lib/demo-data";
import type { Order, Product } from "@/types/domain.types";
import type { OrdersRow } from "@/types/database.types";

export interface DashboardStats {
  revenue: number;
  ordersCount: number;
  productsCount: number;
  lowStockCount: number;
}

type OrderSummary = Pick<OrdersRow, "total_amount" | "payment_status">;

export async function getDashboardStats(): Promise<DashboardStats> {
  if (!isSupabaseConfigured()) {
    const revenue = DEMO_ORDERS
      .filter((o) => o.payment_status === "verified")
      .reduce((sum, o) => sum + Number(o.total_amount), 0);
    const lowStockCount = DEMO_PRODUCTS.filter(
      (p) => p.stock_quantity <= 5
    ).length;

    return {
      revenue,
      ordersCount: DEMO_ORDERS.length,
      productsCount: DEMO_PRODUCTS.length,
      lowStockCount,
    };
  }

  const supabase = createAdminClient();

  const [ordersRes, productsRes, lowStockRes] = await Promise.all([
    supabase
      .from("orders")
      .select("total_amount, payment_status")
      .neq("status", "cancelled"),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id", { count: "exact", head: true })
      .lte("stock_quantity", 5),
  ]);

  const orders = (ordersRes.data ?? []) as OrderSummary[];
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
  if (!isSupabaseConfigured()) {
    return DEMO_ORDERS.slice(0, limit);
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as Order[];
}

export async function getLowStockProducts(limit = 5): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_PRODUCTS.filter(
      (p) => p.stock_quantity <= 5
    ).slice(0, limit);
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*")
    .lte("stock_quantity", 5)
    .order("stock_quantity", { ascending: true })
    .limit(limit);

  return (data ?? []) as Product[];
}

export async function getMonthlyRevenueTrend() {
  if (!isSupabaseConfigured()) {
    return [
      { month: "يناير", revenue: 12500 },
      { month: "فبراير", revenue: 18200 },
      { month: "مارس", revenue: 15400 },
      { month: "أبريل", revenue: 24800 },
      { month: "مايو", revenue: 29100 },
      { month: "يونيو", revenue: 34500 },
    ];
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("created_at, total_amount, payment_status")
    .eq("payment_status", "verified");

  if (!data || data.length === 0) {
    return [
      { month: "يناير", revenue: 0 },
      { month: "فبراير", revenue: 0 },
      { month: "مارس", revenue: 0 },
      { month: "أبريل", revenue: 0 },
      { month: "مايو", revenue: 0 },
      { month: "يونيو", revenue: 0 },
    ];
  }

  const monthlyMap: Record<string, number> = {};
  for (const item of data) {
    const d = new Date(item.created_at);
    const monthName = d.toLocaleDateString("ar-EG", { month: "short" });
    monthlyMap[monthName] = (monthlyMap[monthName] ?? 0) + Number(item.total_amount);
  }

  return Object.entries(monthlyMap).map(([month, revenue]) => ({
    month,
    revenue,
  }));
}

export async function getOrderStatusBreakdown() {
  if (!isSupabaseConfigured()) {
    return [
      { statusLabel: "في انتظار الدفع (Pending)", count: DEMO_ORDERS.filter((o) => o.status === "pending_payment").length, color: "bg-amber-400" },
      { statusLabel: "تم تأكيد الدفع (Paid)", count: DEMO_ORDERS.filter((o) => o.status === "paid").length, color: "bg-emerald-500" },
      { statusLabel: "جاري التجهيز (Processing)", count: DEMO_ORDERS.filter((o) => o.status === "processing").length, color: "bg-purple-500" },
      { statusLabel: "مع المندوب للشحن (Shipped)", count: DEMO_ORDERS.filter((o) => o.status === "shipped").length, color: "bg-blue-500" },
      { statusLabel: "مكتمل وتسليم (Delivered/Completed)", count: DEMO_ORDERS.filter((o) => o.status === "delivered" || o.status === "completed").length, color: "bg-teal-400" },
    ];
  }

  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("status");

  const orders = data ?? [];
  return [
    { statusLabel: "في انتظار الدفع (Pending)", count: orders.filter((o) => o.status === "pending_payment").length, color: "bg-amber-400" },
    { statusLabel: "تم تأكيد الدفع (Paid)", count: orders.filter((o) => o.status === "paid").length, color: "bg-emerald-500" },
    { statusLabel: "جاري التجهيز (Processing)", count: orders.filter((o) => o.status === "processing").length, color: "bg-purple-500" },
    { statusLabel: "مع المندوب للشحن (Shipped)", count: orders.filter((o) => o.status === "shipped").length, color: "bg-blue-500" },
    { statusLabel: "مكتمل وتسليم (Delivered/Completed)", count: orders.filter((o) => o.status === "delivered" || o.status === "completed").length, color: "bg-teal-400" },
  ];
}

