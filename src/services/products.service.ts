import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import {
  DEMO_PRODUCTS,
  enrichProduct,
  enrichProducts,
} from "@/lib/demo-data";
import type { CreateProductInput, UpdateProductInput } from "@/lib/validation/product.schema";
import type { PaginatedResult, Product, ProductFilters } from "@/types/domain.types";

function filterDemoProducts(filters: ProductFilters = {}): Product[] {
  let results = DEMO_PRODUCTS.filter((p) => p.status === "published");

  if (filters.brandId) {
    results = results.filter((p) => p.brand_id === filters.brandId);
  }
  if (filters.categoryId) {
    results = results.filter(
      (p) =>
        p.category_id === filters.categoryId ||
        p.subcategory_id === filters.categoryId
    );
  }
  if (filters.minPrice !== undefined) {
    results = results.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice !== undefined) {
    results = results.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.featured) results = results.filter((p) => p.is_featured);
  if (filters.bestSeller) results = results.filter((p) => p.is_best_seller);
  if (filters.newArrival) results = results.filter((p) => p.is_new_arrival);
  if (filters.onSale) results = results.filter((p) => p.is_on_sale);
  if (filters.status) results = results.filter((p) => p.status === filters.status);
  if (filters.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q)
    );
  }

  return enrichProducts(results);
}

export type ProductSort =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "name";

function sortProducts(products: Product[], sort: ProductSort): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price_asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price_desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.average_rating - a.average_rating);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }
}

function applySupabaseSort<T extends { order: (column: string, options?: { ascending?: boolean }) => T }>(
  query: T,
  sort: ProductSort
): T {
  switch (sort) {
    case "price_asc":
      return query.order("price", { ascending: true });
    case "price_desc":
      return query.order("price", { ascending: false });
    case "rating":
      return query.order("average_rating", { ascending: false });
    case "name":
      return query.order("name", { ascending: true });
    case "newest":
    default:
      return query.order("created_at", { ascending: false });
  }
}

export async function getProducts(
  filters: ProductFilters = {},
  sort: ProductSort = "newest"
): Promise<PaginatedResult<Product>> {
  const limit = filters.limit ?? DEFAULT_PAGE_SIZE;
  const offset = filters.offset ?? 0;

  if (!isSupabaseConfigured()) {
    const all = sortProducts(filterDemoProducts(filters), sort);
    return {
      data: all.slice(offset, offset + limit),
      total: all.length,
      limit,
      offset,
    };
  }

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, brand:brands(*), category:categories!products_category_id_fkey(*), images:product_images(*)", {
      count: "exact",
    });

  if (filters.brandId) query = query.eq("brand_id", filters.brandId);
  if (filters.categoryId) {
    query = query.or(
      `category_id.eq.${filters.categoryId},subcategory_id.eq.${filters.categoryId}`
    );
  }
  if (filters.minPrice !== undefined) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice !== undefined) query = query.lte("price", filters.maxPrice);
  if (filters.featured) query = query.eq("is_featured", true);
  if (filters.bestSeller) query = query.eq("is_best_seller", true);
  if (filters.newArrival) query = query.eq("is_new_arrival", true);
  if (filters.onSale) query = query.eq("is_on_sale", true);
  if (filters.status) query = query.eq("status", filters.status);
  else query = query.eq("status", "published");
  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%,sku.ilike.%${filters.search}%`
    );
  }

  query = applySupabaseSort(query, sort).range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw new Error(error.message);

  return {
    data: (data ?? []) as Product[],
    total: count ?? 0,
    limit,
    offset,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    const product = DEMO_PRODUCTS.find((p) => p.slug === slug);
    return product ? enrichProduct(product) : null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, brand:brands(*), category:categories!products_category_id_fkey(*), images:product_images(*), variants:product_variants(*)")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Product;
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const result = await getProducts({ featured: true, limit }, "newest");
  return result.data;
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const result = await getProducts({ newArrival: true, limit }, "newest");
  return result.data;
}

export async function getBestSellers(limit = 8): Promise<Product[]> {
  const result = await getProducts({ bestSeller: true, limit }, "rating");
  return result.data;
}

export async function getDeals(
  limit = DEFAULT_PAGE_SIZE,
  offset = 0
): Promise<PaginatedResult<Product>> {
  return getProducts({ onSale: true, limit, offset }, "price_asc");
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 4
): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    let related = DEMO_PRODUCTS.filter(
      (p) => p.id !== productId && p.status === "published"
    );
    if (categoryId) {
      related = related.filter(
        (p) => p.category_id === categoryId || p.subcategory_id === categoryId
      );
    }
    return enrichProducts(related.slice(0, limit));
  }

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*, brand:brands(*), category:categories!products_category_id_fkey(*), images:product_images(*)")
    .eq("status", "published")
    .neq("id", productId)
    .limit(limit);

  if (categoryId) {
    query = query.or(
      `category_id.eq.${categoryId},subcategory_id.eq.${categoryId}`
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Product[];
}

export async function getProductsByBrand(
  brandId: string,
  limit = DEFAULT_PAGE_SIZE,
  offset = 0,
  sort: ProductSort = "newest"
): Promise<PaginatedResult<Product>> {
  return getProducts({ brandId, limit, offset }, sort);
}

export async function getProductsByCategory(
  categoryId: string,
  limit = DEFAULT_PAGE_SIZE,
  offset = 0,
  sort: ProductSort = "newest"
): Promise<PaginatedResult<Product>> {
  return getProducts({ categoryId, limit, offset }, sort);
}

export async function getProductsByCollection(
  collectionId: string,
  limit = DEFAULT_PAGE_SIZE,
  offset = 0
): Promise<PaginatedResult<Product>> {
  if (!isSupabaseConfigured()) {
    return { data: [], total: 0, limit, offset };
  }

  const supabase = await createClient();
  const { data: links, error: linkError } = await supabase
    .from("product_collections")
    .select("product_id")
    .eq("collection_id", collectionId);

  if (linkError) throw new Error(linkError.message);

  const productIds = (links ?? []).map((l) => l.product_id as string);
  if (productIds.length === 0) {
    return { data: [], total: 0, limit, offset };
  }

  const { data, count, error } = await supabase
    .from("products")
    .select("*, brand:brands(*), category:categories!products_category_id_fkey(*), images:product_images(*)", {
      count: "exact",
    })
    .eq("status", "published")
    .in("id", productIds)
    .range(offset, offset + limit - 1);

  if (error) throw new Error(error.message);

  return {
    data: (data ?? []) as Product[],
    total: count ?? 0,
    limit,
    offset,
  };
}

export async function getPriceRange(): Promise<{ min: number; max: number }> {
  if (!isSupabaseConfigured()) {
    const prices = DEMO_PRODUCTS.filter((p) => p.status === "published").map(
      (p) => p.price
    );
    if (prices.length === 0) return { min: 0, max: 10000 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("price")
    .eq("status", "published")
    .order("price", { ascending: true });

  const prices = (data ?? []).map((p) => Number(p.price));
  if (prices.length === 0) return { min: 0, max: 10000 };
  return { min: prices[0], max: prices[prices.length - 1] };
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  if (!isSupabaseConfigured()) {
    const product: Product = {
      id: crypto.randomUUID(),
      ...input,
      compare_at_price: input.compare_at_price ?? null,
      brand_id: input.brand_id ?? null,
      category_id: input.category_id ?? null,
      subcategory_id: input.subcategory_id ?? null,
      description: input.description ?? null,
      short_description: input.short_description ?? null,
      meta_title: input.meta_title ?? null,
      meta_description: input.meta_description ?? null,
      meta_keywords: input.meta_keywords ?? null,
      is_available: input.stock_quantity > 0 && input.status === "published",
      average_rating: 0,
      review_count: 0,
      published_at: input.status === "published" ? new Date().toISOString() : null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    DEMO_PRODUCTS.push(product);
    return enrichProduct(product);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      ...input,
      published_at: input.status === "published" ? new Date().toISOString() : null,
    })
    .select("*, brand:brands(*), category:categories!products_category_id_fkey(*), images:product_images(*)")
    .single();

  if (error) throw new Error(error.message);
  return data as Product;
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<Product> {
  if (!isSupabaseConfigured()) {
    const index = DEMO_PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");
    DEMO_PRODUCTS[index] = {
      ...DEMO_PRODUCTS[index],
      ...input,
      updated_at: new Date().toISOString(),
    };
    return enrichProduct(DEMO_PRODUCTS[index]);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .update(input)
    .eq("id", id)
    .select("*, brand:brands(*), category:categories!products_category_id_fkey(*), images:product_images(*)")
    .single();

  if (error) throw new Error(error.message);
  return data as Product;
}

export async function searchProducts(
  query: string,
  limit = DEFAULT_PAGE_SIZE
): Promise<Product[]> {
  const result = await getProducts({ search: query, limit, offset: 0 });
  return result.data;
}

export async function deleteProduct(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const index = DEMO_PRODUCTS.findIndex((p) => p.id === id);
    if (index === -1) throw new Error("Product not found");
    DEMO_PRODUCTS.splice(index, 1);
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
