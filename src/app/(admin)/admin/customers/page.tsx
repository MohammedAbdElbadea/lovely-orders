import Link from "next/link";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { getCustomers } from "@/lib/services/admin/catalog.service";
import { formatPrice } from "@/lib/utils";
import type { Customer } from "@/types/domain.types";

export default async function AdminCustomersPage() {
  const { data: customers } = await getCustomers(undefined, 100);

  const columns: Column<Customer>[] = [
    {
      key: "full_name",
      header: "Name",
      render: (row) => (
        <Link href={`/admin/customers/${row.id}`} className="font-medium text-gold hover:underline">
          {row.full_name}
        </Link>
      ),
    },
    { key: "phone", header: "Phone" },
    { key: "email", header: "Email", render: (row) => row.email ?? "—" },
    {
      key: "segment",
      header: "Segment",
      render: (row) => (
        <Badge variant="outline" className="capitalize">
          {row.segment.replace("_", " ")}
        </Badge>
      ),
    },
    { key: "total_orders", header: "Orders" },
    {
      key: "total_spent",
      header: "Spent",
      render: (row) => formatPrice(Number(row.total_spent), "EGP", "en-EG"),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Customers</h1>
        <p className="text-sm text-luxury-muted">View and manage customer profiles</p>
      </div>
      <DataTable data={customers} columns={columns} searchKeys={["full_name", "phone", "email"]} />
    </div>
  );
}
