import { DataTable, type Column } from "@/components/admin/DataTable";
import { getAuditLogs } from "@/lib/services/admin/misc.service";

interface AuditLogRow {
  id: string;
  action: string;
  entity_type: string | null;
  created_at: string;
  admin?: { full_name: string; email: string };
}

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Audit Logs</h1>
        <p className="text-sm text-luxury-muted">Track admin actions across the system</p>
      </div>
      <DataTable data={logs as AuditLogRow[]} columns={columns} searchable={false} />
    </div>
  );
}
