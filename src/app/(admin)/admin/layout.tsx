import { requireAdminSession } from "@/lib/rbac/server-auth";
import { getNotifications } from "@/lib/services/admin/misc.service";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AutoRefreshOnFocus } from "@/components/shared/AutoRefreshOnFocus";

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
    <div className="min-h-screen bg-deep-black">
      <AutoRefreshOnFocus />
      <AdminSidebar permissions={session.permissions} />
      <div className="pl-64">
        <AdminHeader
          adminName={session.admin.full_name}
          adminEmail={session.admin.email}
          roleName={roleName}
          notifications={notifications}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
