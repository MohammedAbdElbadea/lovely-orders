import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { getBrands } from "@/lib/services/admin/catalog.service";
import type { Brand } from "@/types/domain.types";

export default async function AdminBrandsPage() {
  const brands = await getBrands();

  const columns: Column<Brand>[] = [
    {
      key: "name",
      header: "Brand",
      render: (row) => (
        <span className="font-medium text-luxury-white">{row.name}</span>
      ),
    },
    { key: "slug", header: "Slug" },
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-luxury-white">Brands</h1>
          <p className="text-sm text-luxury-muted">Manage luxury brand partners</p>
        </div>
        <Link href="/admin/brands/new">
          <Button><Plus className="h-4 w-4" /> Add Brand</Button>
        </Link>
      </div>
      <DataTable data={brands} columns={columns} searchKeys={["name", "slug"]} />
    </div>
  );
}
