import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/services/admin/products.service";
import { getBrands, getCategories } from "@/lib/services/admin/catalog.service";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, brands, categories] = await Promise.all([
    getProductById(id),
    getBrands(),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">
          Edit Product
        </h1>
        <p className="text-sm text-luxury-muted">{product.name}</p>
      </div>
      <ProductForm product={product} brands={brands} categories={categories} />
    </div>
  );
}
