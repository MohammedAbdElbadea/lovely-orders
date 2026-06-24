import Link from "next/link";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { Button } from "@/components/ui/button";
import { getDeals } from "@/services/products.service";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

interface DealsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata = {
  title: "Deals",
  description: "Exclusive deals on luxury beauty products",
};

export default async function DealsPage({ searchParams }: DealsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const offset = (page - 1) * DEFAULT_PAGE_SIZE;

  const result = await getDeals(DEFAULT_PAGE_SIZE, offset).catch(() => ({
    data: [],
    total: 0,
    limit: DEFAULT_PAGE_SIZE,
    offset,
  }));

  const totalPages = Math.ceil(result.total / DEFAULT_PAGE_SIZE);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-10 rounded-luxury border border-gold/20 bg-gradient-to-r from-gold/10 to-transparent p-8 sm:p-12">
        <p className="text-xs uppercase tracking-[0.3em] text-gold">
          Limited Time
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">
          Exclusive Deals
        </h1>
        <p className="mt-2 max-w-xl text-luxury-muted">
          Save on premium cosmetics and skincare. While stocks last.
        </p>
      </div>

      <p className="mb-6 text-sm text-luxury-muted">
        {result.total} deal{result.total !== 1 ? "s" : ""} available
      </p>

      <ProductGrid
        products={result.data}
        emptyMessage="No deals available at the moment. Check back soon!"
      />

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-4">
          {page > 1 && (
            <Link href={`/deals?page=${page - 1}`}>
              <Button variant="secondary" size="sm">
                Previous
              </Button>
            </Link>
          )}
          <span className="text-sm text-luxury-muted">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`/deals?page=${page + 1}`}>
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
