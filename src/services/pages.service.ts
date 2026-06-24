import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_PAGES } from "@/lib/demo-data";
import type { Page } from "@/types/domain.types";

function mapPage(row: Record<string, unknown>): Page {
  return row as unknown as Page;
}

export async function getPageBySlug(slug: string): Promise<Page | null> {
  if (!isSupabaseConfigured()) {
    return (
      DEMO_PAGES.find((p) => p.slug === slug && p.status === "active") ?? null
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (error) throw error;
  return data ? mapPage(data) : null;
}

export async function getActivePages(): Promise<Page[]> {
  if (!isSupabaseConfigured()) {
    return DEMO_PAGES.filter((p) => p.status === "active");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("slug, title, updated_at")
    .eq("status", "active")
    .order("title", { ascending: true });

  if (error) throw error;
  return (data ?? []).map(mapPage);
}

export const CMS_SLUGS = [
  "about",
  "contact",
  "faq",
  "privacy",
  "refund",
  "shipping",
] as const;

export type CmsSlug = (typeof CMS_SLUGS)[number];

export function isCmsSlug(slug: string): slug is CmsSlug {
  return CMS_SLUGS.includes(slug as CmsSlug);
}
