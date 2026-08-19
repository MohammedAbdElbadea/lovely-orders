import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AdminUser, Role } from "@/types/domain.types";
import type { AdminUsersRow } from "@/types/database.types";
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

// Type for the join result from admin_users with roles
type AdminWithRole = AdminUsersRow & {
  role: Role | null;
};

// Type for role_permissions with nested permission
type RolePermissionWithName = {
  permission: { name: string } | null;
};

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

  const adminClient = createAdminClient();
  const { data: adminRow } = await adminClient
    .from("admin_users")
    .select("*, role:roles(id, name, description, is_system, created_at)")
    .eq("auth_user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!adminRow) return null;

  // Cast the joined result (Supabase join inference limitation)
  const admin = adminRow as unknown as AdminWithRole;

  const { data: rolePermissions } = await adminClient
    .from("role_permissions")
    .select("permission:permissions(name)")
    .eq("role_id", admin.role_id);

  const permissions: string[] =
    (rolePermissions as unknown as RolePermissionWithName[])
      ?.map((rp) => rp.permission?.name)
      .filter((name): name is string => typeof name === "string") ?? [];

  const adminUser: AdminUser = {
    id: admin.id,
    auth_user_id: admin.auth_user_id,
    full_name: admin.full_name,
    email: admin.email,
    role_id: admin.role_id,
    is_active: admin.is_active,
    last_login_at: admin.last_login_at,
    two_factor_enabled: admin.two_factor_enabled,
    created_at: admin.created_at,
    updated_at: admin.updated_at,
    role: admin.role ?? undefined,
    permissions,
  };

  return {
    userId: user.id,
    email: user.email ?? admin.email,
    admin: adminUser,
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
