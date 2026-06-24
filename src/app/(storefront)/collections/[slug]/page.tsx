import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { Button } from "@/components/ui/button";
import { getCollectionBySlug } from "@/services/collections.service";
import { getProductsByCollection } from "@/services/products.service";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug).catch(() => null);

  if (!collection) return { title: "Collection Not Found" };

  return {
    title: collection.meta_title ?? collection.name,
    description:
      collection.meta_description ??
      collection.description ??
      `Shop the ${collection.name} collection`,
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const offset = (page - 1) * DEFAULT_PAGE_SIZE;

  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const result = await getProductsByCollection(
    collection.id,
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
        <Link href="/collections" className="hover:text-gold">
          Collections
        </Link>
        {" / "}
        <span className="text-luxury-white">{collection.name}</span>
      </nav>

      {collection.image_url && (
        <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-luxury bg-surface-elevated">
          <Image
            src={collection.image_url}
            alt={collection.name}
            fill
            className="object-cover opacity-70"
            sizes="100vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-deep-black/80 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8">
            <h1 className="font-display text-3xl tracking-wide sm:text-4xl">
              {collection.name}
            </h1>
          </div>
        </div>
      )}

      {!collection.image_url && (
        <h1 className="font-display text-3xl tracking-wide sm:text-4xl">
          {collection.name}
        </h1>
      )}

      {collection.description && (
        <p className="mt-2 max-w-2xl text-luxury-muted">
          {collection.description}
        </p>
      )}

      <p className="mt-4 text-sm text-luxury-muted">
        {result.total} product{result.total !== 1 ? "s" : ""}
      </p>

      <div className="mt-10">
        <ProductGrid products={result.data} />
      </div>

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-4">
          {page > 1 && (
            <Link href={`/collections/${slug}?page=${page - 1}`}>
              <Button variant="secondary" size="sm">
                Previous
              </Button>
            </Link>
          )}
          <span className="text-sm text-luxury-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/collections/${slug}?page=${page + 1}`}>
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
