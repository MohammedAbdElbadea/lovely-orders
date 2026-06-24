import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { getCoupons } from "@/lib/services/admin/misc.service";
import type { Coupon } from "@/types/domain.types";

export default async function CouponsPage() {
  const coupons = await getCoupons();

  const columns: Column<Coupon & { discount?: { name: string } }>[] = [
    { key: "code", header: "Code" },
    {
      key: "discount",
      header: "Discount",
      render: (row) => row.discount?.name ?? "—",
    },
    {
      key: "usage",
      header: "Usage",
      render: (row) =>
        `${row.usage_count}${row.usage_limit ? ` / ${row.usage_limit}` : ""}`,
    },
    {
      key: "is_active",
      header: "Active",
      render: (row) => (
        <Badge variant={row.is_active ? "inStock" : "outOfStock"}>
          {row.is_active ? "Yes" : "No"}
        </Badge>
      ),
    },
    {
      key: "expires_at",
      header: "Expires",
      render: (row) =>
        row.expires_at ? new Date(row.expires_at).toLocaleDateString() : "—",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Coupons</h1>
        <p className="text-sm text-luxury-muted">Manage promotional coupon codes</p>
      </div>
      <DataTable data={coupons as Coupon[]} columns={columns} searchKeys={["code"]} />
    </div>
  );
}
