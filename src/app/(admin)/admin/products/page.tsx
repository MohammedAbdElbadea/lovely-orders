import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsList } from "@/components/admin/ProductsList";
import { getProducts } from "@/lib/services/admin/products.service";

export default async function AdminProductsPage() {
  const { data: products } = await getProducts({ limit: 100 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-luxury-white">
            Products
          </h1>
          <p className="text-sm text-luxury-muted">Manage your product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <ProductsList products={products} />
    </div>
  );
}
