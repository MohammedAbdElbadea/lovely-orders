import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_HOMEPAGE_SECTIONS, DEMO_PAGES } from "@/lib/demo-data";
import type { HomepageSection, Page } from "@/types/domain.types";

export async function getHomepageSections(): Promise<HomepageSection[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_HOMEPAGE_SECTIONS.filter((s) => s.is_enabled).sort(
      (a, b) => a.sort_order - b.sort_order
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("is_enabled", true)
    .order("sort_order");

  if (error || !data || data.length === 0) {
    return DEMO_HOMEPAGE_SECTIONS.filter((s) => s.is_enabled).sort(
      (a, b) => a.sort_order - b.sort_order
    );
  }
  return data as HomepageSection[];
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  if (!isSupabaseConfigured()) {
    return (
      DEMO_PAGES.find((p) => p.slug === slug && p.status === "active") ?? null
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) {
    return (
      DEMO_PAGES.find((p) => p.slug === slug && p.status === "active") ?? null
    );
  }
  return data as Page;
}

export async function updateHomepageSection(
  id: string,
  updates: Partial<Pick<HomepageSection, "title" | "config" | "sort_order" | "is_enabled">>
): Promise<HomepageSection> {
  if (!isSupabaseConfigured()) {
    const section = DEMO_HOMEPAGE_SECTIONS.find((s) => s.id === id);
    if (!section) throw new Error("Homepage section not found");
    Object.assign(section, updates, { updated_at: new Date().toISOString() });
    return section;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("homepage_sections")
    .update(updates as import("@/types/database.types").HomepageSectionsUpdate)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as HomepageSection;
}
