"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tag,
  FolderTree,
  ShoppingCart,
  Users,
  Star,
  Warehouse,
  Megaphone,
  FileText,
  Search,
  Settings,
  UserCog,
  Shield,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hasPermission, PERMISSIONS, type PermissionName } from "@/lib/rbac/permissions";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: PermissionName;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
    permission: PERMISSIONS.PRODUCTS_VIEW,
  },
  {
    label: "Brands",
    href: "/admin/brands",
    icon: Tag,
    permission: PERMISSIONS.PRODUCTS_VIEW,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
    permission: PERMISSIONS.PRODUCTS_VIEW,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    permission: PERMISSIONS.ORDERS_VIEW,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
    permission: PERMISSIONS.CUSTOMERS_VIEW,
  },
  {
    label: "Reviews",
    href: "/admin/reviews",
    icon: Star,
    permission: PERMISSIONS.REVIEWS_VIEW,
  },
  {
    label: "Inventory",
    href: "/admin/inventory",
    icon: Warehouse,
    permission: PERMISSIONS.INVENTORY_VIEW,
    children: [
      { label: "All Stock", href: "/admin/inventory" },
      { label: "Low Stock", href: "/admin/inventory/low-stock" },
      { label: "Out of Stock", href: "/admin/inventory/out-of-stock" },
    ],
  },
  {
    label: "Marketing",
    href: "/admin/marketing/discounts",
    icon: Megaphone,
    permission: PERMISSIONS.MARKETING_VIEW,
    children: [
      { label: "Discounts", href: "/admin/marketing/discounts" },
      { label: "Coupons", href: "/admin/marketing/coupons" },
      { label: "Banners", href: "/admin/marketing/banners" },
    ],
  },
  {
    label: "CMS",
    href: "/admin/cms/homepage",
    icon: FileText,
    permission: PERMISSIONS.CMS_VIEW,
    children: [
      { label: "Homepage", href: "/admin/cms/homepage" },
      { label: "Pages", href: "/admin/cms/pages" },
    ],
  },
  {
    label: "SEO",
    href: "/admin/seo",
    icon: Search,
    permission: PERMISSIONS.CMS_VIEW,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    permission: PERMISSIONS.SETTINGS_VIEW,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: UserCog,
    permission: PERMISSIONS.USERS_MANAGE,
  },
  {
    label: "Security",
    href: "/admin/security/audit-logs",
    icon: Shield,
    permission: PERMISSIONS.AUDIT_VIEW,
    children: [
      { label: "Audit Logs", href: "/admin/security/audit-logs" },
      { label: "Login History", href: "/admin/security/login-history" },
    ],
  },
];

interface AdminSidebarProps {
  permissions: string[];
}

export function AdminSidebar({ permissions }: AdminSidebarProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter(
    (item) => !item.permission || hasPermission(permissions, item.permission)
  );

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-luxury-border/20 bg-premium-black">
      <div className="flex h-16 items-center gap-2 border-b border-luxury-border/20 px-6">
        <Sparkles className="h-5 w-5 text-gold" />
        <div>
          <p className="font-display text-sm tracking-widest text-luxury-white">
            LOVELY ORDERS
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-luxury-muted">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/") ||
              item.children?.some((c) => pathname === c.href || pathname.startsWith(c.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-luxury px-3 py-2.5 text-sm transition-colors",
                    isActive
                      ? "bg-gold/10 text-gold border border-gold/20"
                      : "text-luxury-muted hover:bg-surface-elevated hover:text-luxury-white"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.children && (
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  )}
                </Link>
                {item.children && isActive && (
                  <ul className="ml-7 mt-1 space-y-0.5 border-l border-luxury-border/20 pl-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className={cn(
                            "block rounded-luxury px-2 py-1.5 text-xs transition-colors",
                            pathname === child.href
                              ? "text-gold"
                              : "text-luxury-muted hover:text-luxury-white"
                          )}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-luxury-border/20 p-4">
        <p className="text-[10px] uppercase tracking-wider text-luxury-muted">
          Luxury Admin Panel
        </p>
      </div>
    </aside>
  );
}
