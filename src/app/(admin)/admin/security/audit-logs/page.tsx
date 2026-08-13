import { AuditLogsList, type AuditLogRow } from "@/components/admin/AuditLogsList";
import { getAuditLogs } from "@/lib/services/admin/misc.service";

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Audit Logs</h1>
        <p className="text-sm text-luxury-muted">Track admin actions across the system</p>
      </div>
      <AuditLogsList logs={logs as AuditLogRow[]} />
    </div>
  );
}
