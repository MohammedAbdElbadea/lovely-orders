import { searchProducts as searchProductsFromCatalog } from "@/services/products.service";
import type { Product } from "@/types/domain.types";

export async function searchProducts(
  query: string,
  limit = 10
): Promise<Product[]> {
  if (!query.trim()) return [];
  const result = await searchProductsFromCatalog(query, limit);
  return result;
}
