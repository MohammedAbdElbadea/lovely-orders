import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_BRANDS } from "@/lib/demo-data";
import type { Brand } from "@/types/domain.types";

export interface BrandInput {
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_active?: boolean;
  sort_order?: number;
}

export async function getBrands(activeOnly = true): Promise<Brand[]> {
  if (!isSupabaseConfigured()) {
    return activeOnly
      ? DEMO_BRANDS.filter((b) => b.is_active)
      : [...DEMO_BRANDS];
  }

  const supabase = await createClient();
  let query = supabase.from("brands").select("*").order("sort_order");

  if (activeOnly) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as Brand[];
}

export async function getFeaturedBrands(limit = 6): Promise<Brand[]> {
  const brands = await getBrands(true);
  return brands.slice(0, limit);
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_BRANDS.find((b) => b.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Brand;
}

export async function createBrand(input: BrandInput): Promise<Brand> {
  if (!isSupabaseConfigured()) {
    const brand: Brand = {
      id: crypto.randomUUID(),
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      logo_url: input.logo_url ?? null,
      banner_url: input.banner_url ?? null,
      meta_title: input.meta_title ?? null,
      meta_description: input.meta_description ?? null,
      is_active: input.is_active ?? true,
      sort_order: input.sort_order ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    DEMO_BRANDS.push(brand);
    return brand;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brands")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Brand;
}

export async function updateBrand(
  id: string,
  input: Partial<BrandInput>
): Promise<Brand> {
  if (!isSupabaseConfigured()) {
    const index = DEMO_BRANDS.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Brand not found");
    DEMO_BRANDS[index] = {
      ...DEMO_BRANDS[index],
      ...input,
      updated_at: new Date().toISOString(),
    };
    return DEMO_BRANDS[index];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brands")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Brand;
}

export async function deleteBrand(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const index = DEMO_BRANDS.findIndex((b) => b.id === id);
    if (index === -1) throw new Error("Brand not found");
    DEMO_BRANDS.splice(index, 1);
    return;
  }

  const supabase = await createClient();
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
