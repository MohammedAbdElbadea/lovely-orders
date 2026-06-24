import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { AdminUser } from "@/types/domain.types";
import {
  hasPermission,
  PERMISSIONS,
  type PermissionName,
} from "@/lib/rbac/permissions";
import { ROUTES, isSupabaseConfigured } from "@/lib/constants";

export interface AdminSession {
  userId: string;
  email: string;
  admin: AdminUser;
  permissions: string[];
}

const DEMO_ADMIN: AdminUser = {
  id: "demo-admin-id",
  auth_user_id: "demo-user-id",
  full_name: "Demo Admin",
  email: "admin@lovelyorders.com",
  role_id: "a0000000-0000-0000-0000-000000000001",
  is_active: true,
  last_login_at: null,
  two_factor_enabled: false,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  role: {
    id: "a0000000-0000-0000-0000-000000000001",
    name: "super_admin",
    description: "Full system access",
    is_system: true,
    created_at: new Date().toISOString(),
  },
};

const DEMO_PERMISSIONS = Object.values(PERMISSIONS);

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) {
    return {
      userId: "demo-user-id",
      email: DEMO_ADMIN.email,
      admin: DEMO_ADMIN,
      permissions: DEMO_PERMISSIONS,
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: admin } = await supabase
    .from("admin_users")
    .select("*, role:roles(id, name, description, is_system, created_at)")
    .eq("auth_user_id", user.id)
    .eq("is_active", true)
    .single();

  if (!admin) return null;

  const { data: rolePermissions } = await supabase
    .from("role_permissions")
    .select("permission:permissions(name)")
    .eq("role_id", admin.role_id);

  const permissions =
    rolePermissions
      ?.map((rp) => {
        const perm = rp.permission as { name: string } | { name: string }[] | null;
        if (Array.isArray(perm)) return perm[0]?.name;
        return perm?.name;
      })
      .filter(Boolean) as string[] ?? [];

  return {
    userId: user.id,
    email: user.email ?? admin.email,
    admin: admin as AdminUser,
    permissions,
  };
}

export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    redirect(ROUTES.ADMIN_LOGIN);
  }
  return session;
}

export async function requirePermission(
  permission: PermissionName | PermissionName[]
): Promise<AdminSession> {
  const session = await requireAdminSession();
  if (!hasPermission(session.permissions, permission)) {
    throw new Error("Insufficient permissions");
  }
  return session;
}

export function assertPermission(
  session: AdminSession,
  permission: PermissionName | PermissionName[]
): void {
  if (!hasPermission(session.permissions, permission)) {
    throw new Error("Insufficient permissions");
  }
}
