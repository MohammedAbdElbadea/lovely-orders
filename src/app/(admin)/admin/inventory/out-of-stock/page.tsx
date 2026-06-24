import { InventoryTable } from "@/components/admin/InventoryTable";
import { getInventoryProducts } from "@/lib/services/admin/misc.service";

export default async function OutOfStockPage() {
  const { data: products } = await getInventoryProducts("out", 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Out of Stock</h1>
        <p className="text-sm text-luxury-muted">Products with zero inventory</p>
      </div>
      <InventoryTable products={products} showAdjust />
    </div>
  );
}
