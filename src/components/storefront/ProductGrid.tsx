import { ProductCard } from "@/components/storefront/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/domain.types";

interface ProductGridProps {
  products: Product[];
  className?: string;
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  className,
  emptyMessage = "No products found.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-luxury border border-dashed border-luxury-border/30 bg-premium-black/50 px-6 py-12 text-center">
        <p className="text-luxury-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
        />
      ))}
    </div>
  );
}
