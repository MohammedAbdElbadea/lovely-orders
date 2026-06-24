import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { getCategoryBySlug } from "@/services/categories.service";
import { getProductsByCategory } from "@/services/products.service";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);

  if (!category) return { title: "Category Not Found" };

  return {
    title: category.meta_title ?? category.name,
    description:
      category.meta_description ??
      category.description ??
      `Shop ${category.name} at LOVELY ORDERS`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const offset = (page - 1) * DEFAULT_PAGE_SIZE;

  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const result = await getProductsByCategory(
    category.id,
    DEFAULT_PAGE_SIZE,
    offset
  ).catch(() => ({ data: [], total: 0, limit: DEFAULT_PAGE_SIZE, offset }));

  const totalPages = Math.ceil(result.total / DEFAULT_PAGE_SIZE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-xs text-luxury-muted">
        <Link href="/" className="hover:text-gold">
          Home
        </Link>
        {" / "}
        <Link href="/categories" className="hover:text-gold">
          Categories
        </Link>
        {" / "}
        <span className="text-luxury-white">{category.name}</span>
      </nav>

      <h1 className="font-display text-3xl tracking-wide sm:text-4xl">
        {category.name}
      </h1>
      {category.description && (
        <p className="mt-2 max-w-2xl text-luxury-muted">{category.description}</p>
      )}
      <p className="mt-2 text-sm text-luxury-muted">
        {result.total} product{result.total !== 1 ? "s" : ""}
      </p>

      <div className="mt-10">
        <ProductGrid products={result.data} />
      </div>

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-4">
          {page > 1 && (
            <Link href={`/categories/${slug}?page=${page - 1}`}>
              <Button variant="secondary" size="sm">
                Previous
              </Button>
            </Link>
          )}
          <span className="text-sm text-luxury-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/categories/${slug}?page=${page + 1}`}>
              <Button variant="secondary" size="sm">
                Next
              </Button>
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
