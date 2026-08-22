import { requireAdminSession } from "@/lib/rbac/server-auth";
import { getNotifications } from "@/lib/services/admin/misc.service";
import { AdminShell } from "@/components/admin/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();
  const notifications = await getNotifications(session.admin.id);
  const roleName =
    (session.admin.role as { name?: string } | undefined)?.name ?? "admin";

  return (
    <AdminShell
      permissions={session.permissions}
      adminName={session.admin.full_name}
      adminEmail={session.admin.email}
      roleName={roleName}
      notifications={notifications}
    >
      {children}
    </AdminShell>
  );
}
