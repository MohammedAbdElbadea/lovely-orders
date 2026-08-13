"use client";

import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";

interface AdminUserRow {
  id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  last_login_at: string | null;
  role?: { name: string };
}

interface AdminUsersListProps {
  users: AdminUserRow[];
}

export function AdminUsersList({ users }: AdminUsersListProps) {
  const columns: Column<AdminUserRow>[] = [
    { key: "full_name", header: "Name" },
    { key: "email", header: "Email" },
    {
      key: "role",
      header: "Role",
      render: (row) => (
        <Badge variant="outline" className="capitalize">
          {row.role?.name?.replace("_", " ") ?? "—"}
        </Badge>
      ),
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
    {
      key: "last_login_at",
      header: "Last Login",
      render: (row) =>
        row.last_login_at
          ? new Date(row.last_login_at).toLocaleString()
          : "Never",
    },
  ];

  return (
    <DataTable
      data={users}
      columns={columns}
      searchKeys={["full_name", "email"]}
    />
  );
}
