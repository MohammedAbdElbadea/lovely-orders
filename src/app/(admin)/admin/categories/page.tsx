import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { getCategories } from "@/lib/services/admin/catalog.service";
import type { Category } from "@/types/domain.types";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  const columns: Column<Category>[] = [
    { key: "name", header: "Category" },
    { key: "slug", header: "Slug" },
    {
      key: "parent_id",
      header: "Parent",
      render: (row) => {
        if (!row.parent_id) return "—";
        const parent = categories.find((c) => c.id === row.parent_id);
        return parent?.name ?? "—";
      },
    },
    {
      key: "is_active",
      header: "Status",
      render: (row) => (
        <Badge variant={row.is_active ? "inStock" : "outOfStock"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    { key: "sort_order", header: "Order" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Categories</h1>
        <p className="text-sm text-luxury-muted">Organize products by category</p>
      </div>
      <DataTable data={categories} columns={columns} searchKeys={["name", "slug"]} />
    </div>
  );
}
