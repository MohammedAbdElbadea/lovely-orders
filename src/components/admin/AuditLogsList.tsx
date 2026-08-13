"use client";

import { DataTable, type Column } from "@/components/admin/DataTable";

export interface AuditLogRow {
  id: string;
  action: string;
  entity_type: string | null;
  created_at: string;
  admin?: { full_name: string; email: string };
}

interface AuditLogsListProps {
  logs: AuditLogRow[];
}

export function AuditLogsList({ logs }: AuditLogsListProps) {
  const columns: Column<AuditLogRow>[] = [
    {
      key: "created_at",
      header: "Time",
      render: (row) => new Date(row.created_at).toLocaleString(),
    },
    {
      key: "admin",
      header: "Admin",
      render: (row) => row.admin?.full_name ?? "System",
    },
    { key: "action", header: "Action" },
    { key: "entity_type", header: "Entity", render: (row) => row.entity_type ?? "—" },
  ];

  return <DataTable data={logs} columns={columns} searchable={false} />;
}
