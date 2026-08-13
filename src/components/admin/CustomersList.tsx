"use client";

import Link from "next/link";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Customer } from "@/types/domain.types";

interface CustomersListProps {
  customers: Customer[];
}

export function CustomersList({ customers }: CustomersListProps) {
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
    <DataTable data={customers} columns={columns} searchKeys={["full_name", "phone", "email"]} />
  );
}
