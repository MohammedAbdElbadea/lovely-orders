import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { getDiscounts } from "@/lib/services/admin/misc.service";
import type { Discount } from "@/types/domain.types";

export default async function DiscountsPage() {
  const discounts = await getDiscounts();

  const columns: Column<Discount>[] = [
    { key: "name", header: "Name" },
    { key: "type", header: "Type", render: (row) => row.type },
    { key: "value", header: "Value", render: (row) => String(row.value) },
    {
      key: "is_active",
      header: "Active",
      render: (row) => (
        <Badge variant={row.is_active ? "inStock" : "outOfStock"}>
          {row.is_active ? "Yes" : "No"}
        </Badge>
      ),
    },
    { key: "status", header: "Status" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Discounts</h1>
        <p className="text-sm text-luxury-muted">Manage store-wide and targeted discounts</p>
      </div>
      <DataTable data={discounts as Discount[]} columns={columns} searchKeys={["name"]} />
    </div>
  );
}
