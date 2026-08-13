"use client";

import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";

export interface LoginHistoryRow {
  id: string;
  email: string | null;
  success: boolean;
  created_at: string;
  ip_address: string | null;
  admin?: { full_name: string; email: string };
}

interface LoginHistoryListProps {
  history: LoginHistoryRow[];
}

export function LoginHistoryList({ history }: LoginHistoryListProps) {
  const columns: Column<LoginHistoryRow>[] = [
    {
      key: "created_at",
      header: "Time",
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
    {
      key: "email",
      header: "Email",
      render: (row) => row.email ?? row.admin?.email ?? "—",
    },
    {
      key: "success",
      header: "Result",
      render: (row) => (
        <Badge variant={row.success ? "inStock" : "outOfStock"}>
          {row.success ? "Success" : "Failed"}
        </Badge>
      ),
    },
    {
      key: "ip_address",
      header: "IP",
      render: (row) => row.ip_address ?? "—",
    },
  ];

  return (
    <DataTable
      data={history}
      columns={columns}
      searchKeys={["email"]}
      searchPlaceholder="Search by email..."
    />
  );
}
