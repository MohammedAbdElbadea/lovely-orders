import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { Button } from "@/components/ui/button";
import { getBrandBySlug } from "@/services/brands.service";
import { getProductsByBrand } from "@/services/products.service";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface BrandPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: BrandPageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug).catch(() => null);

  if (!brand) return { title: "Brand Not Found" };

  return {
    title: brand.meta_title ?? brand.name,
    description:
      brand.meta_description ??
      brand.description ??
      `Shop ${brand.name} at LOVELY ORDERS`,
  };
}

export default async function BrandPage({
  params,
  searchParams,
}: BrandPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const offset = (page - 1) * DEFAULT_PAGE_SIZE;

  const brand = await getBrandBySlug(slug);
  if (!brand) notFound();

  const result = await getProductsByBrand(
    brand.id,
    DEFAULT_PAGE_SIZE,
    offset
  ).catch(() => ({ data: [], total: 0, limit: DEFAULT_PAGE_SIZE, offset }));

  const totalPages = Math.ceil(result.total / DEFAULT_PAGE_SIZE);

  return (
    <div>
      {brand.banner_url && (
        <div className="relative h-48 bg-surface-elevated sm:h-64">
          <Image
            src={brand.banner_url}
            alt={brand.name}
            fill
            className="object-cover opacity-60"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-black to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-xs text-luxury-muted">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          {" / "}
          <Link href="/brands" className="hover:text-gold">
            Brands
          </Link>
          {" / "}
          <span className="text-luxury-white">{brand.name}</span>
        </nav>

        <div className="flex items-center gap-6">
          {brand.logo_url && (
            <div className="relative h-16 w-24 shrink-0">
              <Image
                src={brand.logo_url}
                alt={brand.name}
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
          )}
          <div>
            <h1 className="font-display text-3xl tracking-wide sm:text-4xl">
              {brand.name}
            </h1>
            {brand.description && (
              <p className="mt-2 max-w-2xl text-luxury-muted">
                {brand.description}
              </p>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm text-luxury-muted">
          {result.total} product{result.total !== 1 ? "s" : ""}
        </p>

        <div className="mt-10">
          <ProductGrid products={result.data} />
        </div>

        {totalPages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-4">
            {page > 1 && (
              <Link href={`/brands/${slug}?page=${page - 1}`}>
                <Button variant="secondary" size="sm">
                  Previous
                </Button>
              </Link>
            )}
            <span className="text-sm text-luxury-muted">
              Page {page} of {totalPages}
            </span>
            {page < totalPages && (
              <Link href={`/brands/${slug}?page=${page + 1}`}>
                <Button variant="secondary" size="sm">
                  Next
                </Button>
              </Link>
            )}
          </nav>
        )}
      </div>
    </div>
  );
}
