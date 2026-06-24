import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { getLoginHistory } from "@/lib/services/admin/misc.service";

interface LoginHistoryRow {
  id: string;
  email: string | null;
  success: boolean;
  created_at: string;
  ip_address: string | null;
  admin?: { full_name: string; email: string };
}

export default async function LoginHistoryPage() {
  const history = await getLoginHistory();

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
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Login History</h1>
        <p className="text-sm text-luxury-muted">Monitor admin authentication attempts</p>
      </div>
      <DataTable
        data={history as LoginHistoryRow[]}
        columns={columns}
        searchKeys={["email"]}
        searchPlaceholder="Search by email..."
      />
    </div>
  );
}
