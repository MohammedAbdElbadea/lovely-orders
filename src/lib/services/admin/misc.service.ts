import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/constants";
import {
  DEMO_PRODUCTS,
  DEMO_REVIEWS,
  DEMO_BRANDS,
  DEMO_DISCOUNTS,
  DEMO_COUPONS,
  DEMO_BANNERS,
  DEMO_HOMEPAGE_SECTIONS,
  DEMO_PAGES,
} from "@/lib/demo-data";
import type { Review, Product, InventoryLog } from "@/types/domain.types";
import type {
  StoreSettingsRow,
  ProductsRow,
  PagesRow,
  BrandsRow,
} from "@/types/database.types";

export async function getReviews(
  status?: string,
  limit = 20,
  offset = 0
) {
  if (!isSupabaseConfigured()) {
    let reviews = [...DEMO_REVIEWS];
    if (status) reviews = reviews.filter((r) => r.status === status);
    return { data: reviews.slice(offset, offset + limit), total: reviews.length, limit, offset };
  }

  const supabase = createAdminClient();
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
  if (!isSupabaseConfigured()) {
    let prods = [...DEMO_PRODUCTS];
    if (filter === "low") {
      prods = prods.filter((p) => p.stock_quantity <= 5);
    } else if (filter === "out") {
      prods = prods.filter((p) => p.stock_quantity === 0);
    }
    return { data: prods.slice(offset, offset + limit), total: prods.length, limit, offset };
  }

  const supabase = createAdminClient();
  let query = supabase.from("products").select("*", { count: "exact" });

  if (filter === "low") {
    query = query.lte("stock_quantity", 5);
  } else if (filter === "out") {
    query = query.eq("stock_quantity", 0);
  }

  const { data, count } = await query
    .order("stock_quantity", { ascending: true })
    .range(offset, offset + limit - 1);

  return { data: (data ?? []) as Product[], total: count ?? 0, limit, offset };
}

export async function getInventoryLogs(limit = 20): Promise<InventoryLog[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("inventory_logs")
    .select("*, product:products(name)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []) as InventoryLog[];
}

export async function getNotifications(adminUserId: string) {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("admin_user_id", adminUserId)
    .order("created_at", { ascending: false })
    .limit(10);
  return data ?? [];
}

export async function getStoreSettings() {
  if (!isSupabaseConfigured()) {
    return {
      store_name: "LOVELY ORDERS",
      store_phone: "01067258266",
      store_email: "hello@lovelyorders.com",
      currency: "EGP",
    };
  }

  const supabase = createAdminClient();
  const { data } = await supabase.from("store_settings").select("*");
  const settings: Record<string, unknown> = {};
  for (const row of (data ?? []) as StoreSettingsRow[]) {
    settings[row.key] = row.value;
  }
  return settings;
}

export async function getAdminUsers() {
  if (!isSupabaseConfigured()) {
    return [
      {
        id: "demo-admin-id",
        full_name: "Demo Admin",
        email: "admin@lovelyorders.com",
        role: { name: "super_admin" },
        is_active: true,
        created_at: new Date().toISOString(),
      },
    ];
  }

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("admin_users")
    .select("*, role:roles(name)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAuditLogs(limit = 50) {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("audit_logs")
    .select("*, admin:admin_users(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getLoginHistory(limit = 50) {
  if (!isSupabaseConfigured()) return [];

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("login_history")
    .select("*, admin:admin_users(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getHomepageSections() {
  if (!isSupabaseConfigured()) return DEMO_HOMEPAGE_SECTIONS;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("homepage_sections")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data && data.length > 0) ? data : DEMO_HOMEPAGE_SECTIONS;
}

export async function getPages() {
  if (!isSupabaseConfigured()) return DEMO_PAGES;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("pages")
    .select("*")
    .order("title", { ascending: true });
  return (data && data.length > 0) ? data : DEMO_PAGES;
}

export async function getPageById(id: string) {
  if (!isSupabaseConfigured()) {
    return DEMO_PAGES.find((p) => p.id === id) ?? null;
  }

  const supabase = createAdminClient();
  const { data } = await supabase.from("pages").select("*").eq("id", id).maybeSingle();
  return data ?? (DEMO_PAGES.find((p) => p.id === id) ?? null);
}

export async function getDiscounts() {
  if (!isSupabaseConfigured()) return DEMO_DISCOUNTS;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("discounts")
    .select("*")
    .order("created_at", { ascending: false });
  return (data && data.length > 0) ? data : DEMO_DISCOUNTS;
}

export async function getCoupons() {
  if (!isSupabaseConfigured()) return DEMO_COUPONS;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("coupons")
    .select("*, discount:discounts(*)")
    .order("created_at", { ascending: false });
  return (data && data.length > 0) ? data : DEMO_COUPONS;
}

export async function getBanners() {
  if (!isSupabaseConfigured()) return DEMO_BANNERS;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("promotional_banners")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data && data.length > 0) ? data : DEMO_BANNERS;
}

type SeoProductRow = Pick<ProductsRow, "id" | "meta_title" | "meta_description" | "status">;
type SeoPageRow = Pick<PagesRow, "id" | "meta_title" | "meta_description" | "status">;
type SeoBrandRow = Pick<BrandsRow, "id" | "meta_title" | "meta_description" | "is_active">;

export async function getSeoHealth() {
  if (!isSupabaseConfigured()) {
    return {
      totalProducts: DEMO_PRODUCTS.length,
      totalPages: DEMO_PAGES.length,
      totalBrands: DEMO_BRANDS.length,
      missingMetaProducts: 0,
      missingMetaPages: 0,
      missingMetaBrands: 0,
      score: 100,
    };
  }

  const supabase = createAdminClient();
  const [products, pages, brands] = await Promise.all([
    supabase.from("products").select("id, meta_title, meta_description, status"),
    supabase.from("pages").select("id, meta_title, meta_description, status"),
    supabase.from("brands").select("id, meta_title, meta_description, is_active"),
  ]);

  const prodList = (products.data ?? []) as SeoProductRow[];
  const pageList = (pages.data ?? []) as SeoPageRow[];
  const brandList = (brands.data ?? []) as SeoBrandRow[];

  const missingMetaProducts = prodList.filter(
    (p) => !p.meta_title || !p.meta_description
  ).length;
  const missingMetaPages = pageList.filter(
    (p) => !p.meta_title || !p.meta_description
  ).length;
  const missingMetaBrands = brandList.filter(
    (b) => !b.meta_title || !b.meta_description
  ).length;

  const totalItems = prodList.length + pageList.length + brandList.length;
  const totalMissing =
    missingMetaProducts + missingMetaPages + missingMetaBrands;
  const score =
    totalItems > 0 ? Math.round(((totalItems - totalMissing) / totalItems) * 100) : 100;

  return {
    totalProducts: prodList.length,
    totalPages: pageList.length,
    totalBrands: brandList.length,
    missingMetaProducts,
    missingMetaPages,
    missingMetaBrands,
    score,
  };
}
