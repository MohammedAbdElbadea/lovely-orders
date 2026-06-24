import { ProductForm } from "@/components/admin/ProductForm";
import { getBrands, getCategories } from "@/lib/services/admin/catalog.service";

export default async function NewProductPage() {
  const [brands, categories] = await Promise.all([getBrands(), getCategories()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">
          New Product
        </h1>
        <p className="text-sm text-luxury-muted">Add a new product to your catalog</p>
      </div>
      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}
