import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_PRODUCTS } from "@/lib/demo-data";
import type { Product, ProductFilters, PaginatedResult } from "@/types/domain.types";

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResult<Product>> {
  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;

  if (!isSupabaseConfigured()) {
    let prods = [...DEMO_PRODUCTS];
    if (filters.status) prods = prods.filter((p) => p.status === filters.status);
    if (filters.brandId) prods = prods.filter((p) => p.brand_id === filters.brandId);
    if (filters.categoryId) prods = prods.filter((p) => p.category_id === filters.categoryId);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      prods = prods.filter(
        (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)
      );
    }
    return {
      data: prods.slice(offset, offset + limit),
      total: prods.length,
      limit,
      offset,
    };
  }

  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, brand:brands(id, name, slug), category:categories!products_category_id_fkey(id, name, slug)", {
      count: "exact",
    });

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`
    );
  }
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.brandId) query = query.eq("brand_id", filters.brandId);
  if (filters.categoryId) query = query.eq("category_id", filters.categoryId);

  const { data, count, error } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return {
    data: (data ?? []) as Product[],
    total: count ?? 0,
    limit,
    offset,
  };
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_PRODUCTS.find((p) => p.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, brand:brands(*), category:categories!products_category_id_fkey(*), images:product_images(*)")
    .eq("id", id)
    .single();

  return data as Product | null;
}

export async function deleteProducts(ids: string[]): Promise<void> {
  if (!isSupabaseConfigured()) {
    for (const id of ids) {
      const idx = DEMO_PRODUCTS.findIndex((p) => p.id === id);
      if (idx !== -1) DEMO_PRODUCTS.splice(idx, 1);
    }
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().in("id", ids);
  if (error) throw error;
}
