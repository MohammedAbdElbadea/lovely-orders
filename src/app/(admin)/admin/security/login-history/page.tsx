import { LoginHistoryList, type LoginHistoryRow } from "@/components/admin/LoginHistoryList";
import { getLoginHistory } from "@/lib/services/admin/misc.service";

export default async function LoginHistoryPage() {
  const history = await getLoginHistory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Login History</h1>
        <p className="text-sm text-luxury-muted">Monitor admin authentication attempts</p>
      </div>
      <LoginHistoryList history={history as LoginHistoryRow[]} />
    </div>
  );
}
