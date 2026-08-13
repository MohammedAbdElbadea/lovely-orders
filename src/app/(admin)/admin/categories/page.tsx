import { CategoriesList } from "@/components/admin/CategoriesList";
import { getCategories } from "@/lib/services/admin/catalog.service";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-luxury-white">الفئات والكتالوج (Categories)</h1>
          <p className="text-sm text-luxury-muted">إدارة وتنسيق أقسام وفئات المنتجات بالمتجر</p>
        </div>
      </div>

      <CategoriesList categories={categories} />
    </div>
  );
}
