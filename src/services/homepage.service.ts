import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_HOMEPAGE_SECTIONS } from "@/lib/demo-data";
import type { HomepageSection } from "@/types/domain.types";

function mapSection(row: Record<string, unknown>): HomepageSection {
  return row as unknown as HomepageSection;
}

export async function getHomepageSections(): Promise<HomepageSection[]> {
  const fallback = DEMO_HOMEPAGE_SECTIONS.filter((s) => s.is_enabled);
  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("homepage_sections")
      .select("*")
      .eq("is_enabled", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) return fallback;

    const filtered = data
      .filter((section) => {
        const starts = section.starts_at as string | null;
        const ends = section.ends_at as string | null;
        if (starts && starts > now) return false;
        if (ends && ends < now) return false;
        return true;
      })
      .map(mapSection);

    return filtered.length > 0 ? filtered : fallback;
  } catch {
    return fallback;
  }
}
