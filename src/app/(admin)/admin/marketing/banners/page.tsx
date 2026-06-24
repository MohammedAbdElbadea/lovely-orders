import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { getBanners } from "@/lib/services/admin/misc.service";
import type { PromotionalBanner } from "@/types/domain.types";

export default async function BannersPage() {
  const banners = await getBanners();

  const columns: Column<PromotionalBanner>[] = [
    { key: "title", header: "Title" },
    { key: "placement", header: "Placement" },
    { key: "sort_order", header: "Order" },
    {
      key: "is_active",
      header: "Active",
      render: (row) => (
        <Badge variant={row.is_active ? "inStock" : "outOfStock"}>
          {row.is_active ? "Yes" : "No"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Banners</h1>
        <p className="text-sm text-luxury-muted">Manage promotional banners</p>
      </div>
      <DataTable data={banners as PromotionalBanner[]} columns={columns} searchKeys={["title"]} />
    </div>
  );
}
