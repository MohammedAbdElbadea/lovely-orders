import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_HOMEPAGE_SECTIONS } from "@/lib/demo-data";
import type { HomepageSection } from "@/types/domain.types";

function mapSection(row: Record<string, unknown>): HomepageSection {
  return row as unknown as HomepageSection;
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_HOMEPAGE_SECTIONS.filter((s) => s.is_enabled);
  }

  const supabase = await createClient();
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("homepage_sections")
    .select("*")
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data ?? [])
    .filter((section) => {
      const starts = section.starts_at as string | null;
      const ends = section.ends_at as string | null;
      if (starts && starts > now) return false;
      if (ends && ends < now) return false;
      return true;
    })
    .map(mapSection);
}
