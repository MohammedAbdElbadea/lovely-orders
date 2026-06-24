import { createClient } from "@/lib/supabase/server";
import type { Review, Product, InventoryLog } from "@/types/domain.types";

export async function getReviews(
  status?: string,
  limit = 20,
  offset = 0
) {
  const supabase = await createClient();
  let query = supabase
    .from("reviews")
    .select("*, product:products(name)", { count: "exact" });

  if (status) query = query.eq("status", status);

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return { data: (data ?? []) as Review[], total: count ?? 0, limit, offset };
}

export async function getInventoryProducts(
  filter: "all" | "low" | "out" = "all",
  limit = 20,
  offset = 0
) {
  const supabase = await createClient();
  let query = supabase.from("products").select("*", { count: "exact" });

  if (filter === "low") {
    query = query.lte("stock_quantity", 5).gt("stock_quantity", 0);
  } else if (filter === "out") {
    query = query.eq("stock_quantity", 0);
  }

  const { data, count } = await query
    .order("stock_quantity", { ascending: true })
    .range(offset, offset + limit - 1);

  return { data: (data ?? []) as Product[], total: count ?? 0, limit, offset };
}

export async function getInventoryLogs(limit = 20): Promise<InventoryLog[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inventory_logs")
    .select("*, product:products(name)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as InventoryLog[];
}

export async function getNotifications(adminUserId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("admin_user_id", adminUserId)
    .order("created_at", { ascending: false })
    .limit(20);
  return data ?? [];
}

export async function getStoreSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("store_settings").select("*");
  const settings: Record<string, unknown> = {};
  for (const row of data ?? []) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function getAdminUsers() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("admin_users")
    .select("*, role:roles(name)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAuditLogs(limit = 50) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("*, admin:admin_users(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getLoginHistory(limit = 50) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("login_history")
    .select("*, admin:admin_users(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getHomepageSections() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getPages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .order("title", { ascending: true });
  return data ?? [];
}

export async function getPageById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("pages").select("*").eq("id", id).single();
  return data;
}

export async function getDiscounts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("discounts")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getCoupons() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("coupons")
    .select("*, discount:discounts(name)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getBanners() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("promotional_banners")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getSeoHealth() {
  const supabase = await createClient();
  const [products, pages, brands] = await Promise.all([
    supabase.from("products").select("id, meta_title, meta_description, status"),
    supabase.from("pages").select("id, meta_title, meta_description, status"),
    supabase.from("brands").select("id, meta_title, meta_description, is_active"),
  ]);

  const productRows = products.data ?? [];
  const pageRows = pages.data ?? [];
  const brandRows = brands.data ?? [];

  const missingMetaProducts = productRows.filter(
    (p) => !p.meta_title || !p.meta_description
  ).length;
  const missingMetaPages = pageRows.filter(
    (p) => !p.meta_title || !p.meta_description
  ).length;
  const missingMetaBrands = brandRows.filter(
    (b) => !b.meta_title || !b.meta_description
  ).length;

  const total = productRows.length + pageRows.length + brandRows.length;
  const covered =
    total -
    missingMetaProducts -
    missingMetaPages -
    missingMetaBrands;

  return {
    totalProducts: productRows.length,
    totalPages: pageRows.length,
    totalBrands: brandRows.length,
    missingMetaProducts,
    missingMetaPages,
    missingMetaBrands,
    score: Math.round((covered / Math.max(total, 1)) * 100),
  };
}
