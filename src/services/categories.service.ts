import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_CATEGORIES } from "@/lib/demo-data";
import type { Category } from "@/types/domain.types";

export interface CategoryInput {
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export async function getCategories(activeOnly = true): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    const categories = activeOnly
      ? DEMO_CATEGORIES.filter((c) => c.is_active)
      : [...DEMO_CATEGORIES];

    const roots = categories.filter((c) => !c.parent_id);
    return roots.map((root) => ({
      ...root,
      children: categories.filter((c) => c.parent_id === root.id),
    }));
  }

  const supabase = await createClient();
  let query = supabase.from("categories").select("*").order("sort_order");

  if (activeOnly) query = query.eq("is_active", true);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const categories = (data ?? []) as Category[];
  const roots = categories.filter((c) => !c.parent_id);
  return roots.map((root) => ({
    ...root,
    children: categories.filter((c) => c.parent_id === root.id),
  }));
}

export async function getTopLevelCategories(): Promise<Category[]> {
  return getCategories(true);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Category;
}

export async function createCategory(input: CategoryInput): Promise<Category> {
  if (!isSupabaseConfigured()) {
    const category: Category = {
      id: crypto.randomUUID(),
      name: input.name,
      slug: input.slug,
      description: input.description ?? null,
      image_url: input.image_url ?? null,
      parent_id: input.parent_id ?? null,
      meta_title: input.meta_title ?? null,
      meta_description: input.meta_description ?? null,
      sort_order: input.sort_order ?? 0,
      is_active: input.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    DEMO_CATEGORIES.push(category);
    return category;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .insert(input)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Category;
}

export async function updateCategory(
  id: string,
  input: Partial<CategoryInput>
): Promise<Category> {
  if (!isSupabaseConfigured()) {
    const index = DEMO_CATEGORIES.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Category not found");
    DEMO_CATEGORIES[index] = {
      ...DEMO_CATEGORIES[index],
      ...input,
      updated_at: new Date().toISOString(),
    };
    return DEMO_CATEGORIES[index];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    const index = DEMO_CATEGORIES.findIndex((c) => c.id === id);
    if (index === -1) throw new Error("Category not found");
    DEMO_CATEGORIES.splice(index, 1);
    return;
  }

  const supabase = await createClient();
  // Unlink products and child categories first
  await supabase.from("products").update({ category_id: null }).eq("category_id", id);
  await supabase.from("products").update({ subcategory_id: null }).eq("subcategory_id", id);
  await supabase.from("categories").update({ parent_id: null }).eq("parent_id", id);

  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
