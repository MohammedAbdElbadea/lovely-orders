import { BrandsList } from "@/components/admin/BrandsList";
import { getBrands } from "@/lib/services/admin/catalog.service";

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-luxury-white">الماركات والعلامات التجارية (Brands)</h1>
          <p className="text-sm text-luxury-muted">إدارة الماركات الفاخرة المتاحة في المتجر</p>
        </div>
      </div>
      <BrandsList brands={brands} />
    </div>
  );
}
