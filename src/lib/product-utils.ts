import type { Product, ProductImage } from "@/types/domain.types";

export function getPrimaryImage(product: Product): ProductImage | undefined {
  return (
    product.images?.find((img) => img.is_primary) ??
    product.images?.sort((a, b) => a.sort_order - b.sort_order)[0]
  );
}
