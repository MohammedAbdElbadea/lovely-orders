import { createClient } from "@/lib/supabase/server";
import type { Product, ProductFilters, PaginatedResult } from "@/types/domain.types";

export async function getProducts(
  filters: ProductFilters = {}
): Promise<PaginatedResult<Product>> {
  const supabase = await createClient();
  const limit = filters.limit ?? 20;
  const offset = filters.offset ?? 0;

  let query = supabase
    .from("products")
    .select("*, brand:brands(id, name, slug), category:categories(id, name, slug)", {
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
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, brand:brands(*), category:categories(*), images:product_images(*)")
    .eq("id", id)
    .single();

  return data as Product | null;
}

export async function deleteProducts(ids: string[]): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().in("id", ids);
  if (error) throw error;
}
