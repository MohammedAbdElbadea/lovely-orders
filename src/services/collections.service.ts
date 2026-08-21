import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/constants";
import type { Collection } from "@/types/domain.types";

function mapCollection(row: Record<string, unknown>): Collection {
  return row as unknown as Collection;
}

export async function getCollections(): Promise<Collection[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(mapCollection);
  } catch {
    return [];
  }
}

export async function getFeaturedCollections(): Promise<Collection[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });

    if (error || !data) return [];
    return data.map(mapCollection);
  } catch {
    return [];
  }
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) return null;
    return mapCollection(data);
  } catch {
    return null;
  }
}
