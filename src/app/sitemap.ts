import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_PRODUCTS, DEMO_BRANDS, DEMO_CATEGORIES } from "@/lib/demo-data";
import { CMS_SLUGS } from "@/services/pages.service";

const rawSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "https://lovely-orders.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://")
  ? rawSiteUrl
  : `https://${rawSiteUrl}`;

interface SitemapItem {
  slug: string;
  updated_at: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/categories",
    "/brands",
    "/collections",
    "/deals",
    "/cart",
    "/checkout",
    "/track-order",
    ...CMS_SLUGS.map((slug) => `/${slug}`),
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  if (!isSupabaseConfigured()) {
    const productRoutes: MetadataRoute.Sitemap = DEMO_PRODUCTS.map((p) => ({
      url: `${siteUrl}/products/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly",
      priority: 0.9,
    }));

    const brandRoutes: MetadataRoute.Sitemap = DEMO_BRANDS.map((b) => ({
      url: `${siteUrl}/brands/${b.slug}`,
      lastModified: new Date(b.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const categoryRoutes: MetadataRoute.Sitemap = DEMO_CATEGORIES.map((c) => ({
      url: `${siteUrl}/categories/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    return [...staticRoutes, ...productRoutes, ...brandRoutes, ...categoryRoutes];
  }

  try {
    const supabase = await createClient();

    const [products, brands, categories, collections, pages] =
      await Promise.all([
        supabase
          .from("products")
          .select("slug, updated_at")
          .eq("status", "published"),
        supabase.from("brands").select("slug, updated_at").eq("is_active", true),
        supabase
          .from("categories")
          .select("slug, updated_at")
          .eq("is_active", true),
        supabase
          .from("collections")
          .select("slug, updated_at")
          .eq("is_active", true),
        supabase.from("pages").select("slug, updated_at").eq("status", "active"),
      ]);

    const productRoutes: MetadataRoute.Sitemap = ((products.data ?? []) as SitemapItem[]).map(
      (p) => ({
        url: `${siteUrl}/products/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "weekly",
        priority: 0.9,
      })
    );

    const brandRoutes: MetadataRoute.Sitemap = ((brands.data ?? []) as SitemapItem[]).map(
      (b) => ({
        url: `${siteUrl}/brands/${b.slug}`,
        lastModified: new Date(b.updated_at),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );

    const categoryRoutes: MetadataRoute.Sitemap = ((categories.data ?? []) as SitemapItem[]).map(
      (c) => ({
        url: `${siteUrl}/categories/${c.slug}`,
        lastModified: new Date(c.updated_at),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );

    const collectionRoutes: MetadataRoute.Sitemap = (
      (collections.data ?? []) as SitemapItem[]
    ).map((c) => ({
      url: `${siteUrl}/collections/${c.slug}`,
      lastModified: new Date(c.updated_at),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const pageRoutes: MetadataRoute.Sitemap = ((pages.data ?? []) as SitemapItem[])
      .filter((p) => !CMS_SLUGS.includes(p.slug as (typeof CMS_SLUGS)[number]))
      .map((p) => ({
        url: `${siteUrl}/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: "monthly",
        priority: 0.5,
      }));

    return [
      ...staticRoutes,
      ...productRoutes,
      ...brandRoutes,
      ...categoryRoutes,
      ...collectionRoutes,
      ...pageRoutes,
    ];
  } catch {
    return staticRoutes;
  }
}
