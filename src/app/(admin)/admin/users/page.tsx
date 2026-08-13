import { AdminUsersList } from "@/components/admin/AdminUsersList";
import { getAdminUsers } from "@/lib/services/admin/misc.service";

interface AdminUserRow {
  id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  last_login_at: string | null;
  role?: { name: string };
}

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Admin Users</h1>
        <p className="text-sm text-luxury-muted">Manage admin accounts and roles</p>
      </div>
      <AdminUsersList users={users as AdminUserRow[]} />
    </div>
  );
}
