import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { CMS_SLUGS } from "@/services/pages.service";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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

    const productRoutes: MetadataRoute.Sitemap = (products.data ?? []).map(
      (p) => ({
        url: `${siteUrl}/products/${p.slug as string}`,
        lastModified: new Date(p.updated_at as string),
        changeFrequency: "weekly",
        priority: 0.9,
      })
    );

    const brandRoutes: MetadataRoute.Sitemap = (brands.data ?? []).map(
      (b) => ({
        url: `${siteUrl}/brands/${b.slug as string}`,
        lastModified: new Date(b.updated_at as string),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );

    const categoryRoutes: MetadataRoute.Sitemap = (categories.data ?? []).map(
      (c) => ({
        url: `${siteUrl}/categories/${c.slug as string}`,
        lastModified: new Date(c.updated_at as string),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );

    const collectionRoutes: MetadataRoute.Sitemap = (
      collections.data ?? []
    ).map((c) => ({
      url: `${siteUrl}/collections/${c.slug as string}`,
      lastModified: new Date(c.updated_at as string),
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const pageRoutes: MetadataRoute.Sitemap = (pages.data ?? [])
      .filter((p) => !CMS_SLUGS.includes(p.slug as (typeof CMS_SLUGS)[number]))
      .map((p) => ({
        url: `${siteUrl}/${p.slug as string}`,
        lastModified: new Date(p.updated_at as string),
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
