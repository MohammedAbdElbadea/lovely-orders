import Link from "next/link";
import { Suspense } from "react";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { SearchBar } from "@/components/storefront/SearchBar";
import { FilterPanel } from "@/components/storefront/FilterPanel";
import { Button } from "@/components/ui/button";
import { getProducts, getPriceRange, type ProductSort } from "@/services/products.service";
import { getCategories } from "@/services/categories.service";
import { getBrands } from "@/services/brands.service";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { SortSelect } from "@/components/storefront/SortSelect";

interface ProductsPageProps {
  searchParams: Promise<{
    q?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    sort?: ProductSort;
    page?: string;
    featured?: string;
    new?: string;
    bestseller?: string;
    sale?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const limit = DEFAULT_PAGE_SIZE;
  const offset = (page - 1) * limit;
  const sort = (params.sort ?? "newest") as ProductSort;

  const [categories, brands, priceRange, result] = await Promise.all([
    getCategories().catch(() => []),
    getBrands().catch(() => []),
    getPriceRange().catch(() => ({ min: 0, max: 10000 })),
    getProducts(
      {
        search: params.q,
        categoryId: params.category,
        brandId: params.brand,
        minPrice: params.minPrice ? Number(params.minPrice) : undefined,
        maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined,
        featured: params.featured === "true" || undefined,
        newArrival: params.new === "true" || undefined,
        bestSeller: params.bestseller === "true" || undefined,
        onSale: params.sale === "true" || undefined,
        limit,
        offset,
      },
      sort
    ).catch(() => ({ data: [], total: 0, limit, offset })),
  ]);

  let products = result.data;
  if (params.rating) {
    const minRating = Number(params.rating);
    products = products.filter((p) => p.average_rating >= minRating);
  }

  const totalPages = Math.ceil(result.total / limit);

  const buildPageUrl = (p: number) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && key !== "page") sp.set(key, value);
    });
    if (p > 1) sp.set("page", String(p));
    const qs = sp.toString();
    return qs ? `/products?${qs}` : "/products";
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl tracking-wide sm:text-4xl">
          {params.q ? `Results for "${params.q}"` : "All Products"}
        </h1>
        <p className="mt-2 text-sm text-luxury-muted">
          {result.total} product{result.total !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="mb-6 max-w-xl">
        <SearchBar defaultValue={params.q ?? ""} />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <Suspense fallback={<div className="h-96 animate-pulse rounded-luxury bg-premium-black" />}>
          <FilterPanel
            categories={categories}
            brands={brands}
            priceRange={priceRange}
            className="lg:w-64 lg:shrink-0"
          />
        </Suspense>

        <div className="flex-1">
          <div className="mb-6 flex items-center justify-end">
            <SortSelect defaultValue={sort} />
          </div>

          <ProductGrid products={products} />

          {totalPages > 1 && (
            <nav
              className="mt-10 flex items-center justify-center gap-2"
              aria-label="Pagination"
            >
              {page > 1 && (
                <Link href={buildPageUrl(page - 1)}>
                  <Button variant="secondary" size="sm">
                    Previous
                  </Button>
                </Link>
              )}
              <span className="px-4 text-sm text-luxury-muted">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link href={buildPageUrl(page + 1)}>
                  <Button variant="secondary" size="sm">
                    Next
                  </Button>
                </Link>
              )}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}
