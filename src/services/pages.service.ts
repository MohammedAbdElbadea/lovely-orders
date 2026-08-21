import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_PAGES } from "@/lib/demo-data";
import type { Page } from "@/types/domain.types";

function mapPage(row: Record<string, unknown>): Page {
  return row as unknown as Page;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const fallback = DEMO_PAGES.find((p) => p.slug === slug && p.status === "active") ?? null;
  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .eq("slug", slug)
      .eq("status", "active")
      .maybeSingle();

    if (error || !data) return fallback;
    return mapPage(data);
  } catch {
    return fallback;
  }
}

export async function getActivePages(): Promise<Page[]> {
  const fallback = DEMO_PAGES.filter((p) => p.status === "active");
  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("pages")
      .select("slug, title, updated_at")
      .eq("status", "active")
      .order("title", { ascending: true });

    if (error || !data || data.length === 0) return fallback;
    return data.map(mapPage);
  } catch {
    return fallback;
  }
}

export const CMS_SLUGS = [
  "about",
  "contact",
  "faq",
  "privacy",
  "refund",
  "shipping",
  "shipping-policy",
] as const;

export type CmsSlug = (typeof CMS_SLUGS)[number];

export function isCmsSlug(slug: string): slug is CmsSlug {
  return CMS_SLUGS.includes(slug as CmsSlug);
}
