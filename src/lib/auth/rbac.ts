import { createClient } from "@/lib/supabase/server";
import type { AdminUser, Role } from "@/types/domain.types";
import type { AdminUsersRow } from "@/types/database.types";

export const PERMISSIONS = {
  PRODUCTS_VIEW: "products.view",
  PRODUCTS_CREATE: "products.create",
  PRODUCTS_EDIT: "products.edit",
  PRODUCTS_DELETE: "products.delete",
  ORDERS_VIEW: "orders.view",
  ORDERS_UPDATE: "orders.update",
  ORDERS_CANCEL: "orders.cancel",
  ORDERS_VERIFY_PAYMENT: "orders.verify_payment",
  CUSTOMERS_VIEW: "customers.view",
  CUSTOMERS_MANAGE: "customers.manage",
  INVENTORY_VIEW: "inventory.view",
  INVENTORY_MANAGE: "inventory.manage",
  MARKETING_VIEW: "marketing.view",
  MARKETING_MANAGE: "marketing.manage",
  REVIEWS_VIEW: "reviews.view",
  REVIEWS_MODERATE: "reviews.moderate",
  CMS_VIEW: "cms.view",
  CMS_MANAGE: "cms.manage",
  SETTINGS_VIEW: "settings.view",
  SETTINGS_MANAGE: "settings.manage",
  USERS_MANAGE: "users.manage",
  PERMISSIONS_MANAGE: "permissions.manage",
  AUDIT_VIEW: "audit.view",
  SECURITY_VIEW: "security.view",
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<string, PermissionName[]> = {
  super_admin: Object.values(PERMISSIONS),
  admin: Object.values(PERMISSIONS).filter(
    (p) =>
      p !== PERMISSIONS.USERS_MANAGE && p !== PERMISSIONS.PERMISSIONS_MANAGE
  ),
  order_manager: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_UPDATE,
    PERMISSIONS.ORDERS_CANCEL,
    PERMISSIONS.ORDERS_VERIFY_PAYMENT,
    PERMISSIONS.CUSTOMERS_VIEW,
  ],
  inventory_manager: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_EDIT,
    PERMISSIONS.INVENTORY_VIEW,
    PERMISSIONS.INVENTORY_MANAGE,
    PERMISSIONS.ORDERS_VIEW,
  ],
  marketing_manager: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.MARKETING_VIEW,
    PERMISSIONS.MARKETING_MANAGE,
    PERMISSIONS.CMS_VIEW,
    PERMISSIONS.CMS_MANAGE,
  ],
  support_manager: [
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.CUSTOMERS_VIEW,
    PERMISSIONS.CUSTOMERS_MANAGE,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.REVIEWS_VIEW,
    PERMISSIONS.REVIEWS_MODERATE,
  ],
};

type AdminWithRole = AdminUsersRow & {
  role: Role | null;
};

type RolePermissionWithName = {
  permission: { name: string } | null;
};

export async function getAdminUser(
  authUserId: string
): Promise<AdminUser | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("admin_users")
    .select(
      `
      *,
      role:roles(*)
    `
    )
    .eq("auth_user_id", authUserId)
    .eq("is_active", true)
    .single();

  if (error || !data) {
    return null;
  }

  const admin = data as unknown as AdminWithRole;

  const { data: rolePerms } = await supabase
    .from("role_permissions")
    .select("permission:permissions(name)")
    .eq("role_id", admin.role_id);

  const permissions =
    (rolePerms as unknown as RolePermissionWithName[])
      ?.map((rp) => rp.permission?.name)
      .filter((name): name is string => typeof name === "string") ?? [];

  return {
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
}

export function hasPermission(
  adminUser: AdminUser | null,
  permission: PermissionName
): boolean {
  if (!adminUser?.is_active) {
    return false;
  }

  if (adminUser.permissions?.includes(permission)) {
    return true;
  }

  const roleName = adminUser.role?.name;
  if (roleName && ROLE_PERMISSIONS[roleName]?.includes(permission)) {
    return true;
  }

  return false;
}

export async function requirePermission(
  authUserId: string,
  permission: PermissionName
): Promise<AdminUser> {
  const adminUser = await getAdminUser(authUserId);

  if (!adminUser) {
    throw new Error("Unauthorized: admin user not found");
  }

  if (!hasPermission(adminUser, permission)) {
    throw new Error(`Forbidden: missing permission '${permission}'`);
  }

  return adminUser;
}
