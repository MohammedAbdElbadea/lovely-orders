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
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { hasPermission, PERMISSIONS, type PermissionName } from "@/lib/rbac/permissions";
import { Button } from "@/components/ui/button";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: PermissionName;
  children?: { label: string; href: string }[];
}

const navItems: NavItem[] = [
  { label: "لوحة التحكم (Dashboard)", href: "/admin/dashboard", icon: LayoutDashboard },
  {
    label: "المنتجات (Products)",
    href: "/admin/products",
    icon: Package,
    permission: PERMISSIONS.PRODUCTS_VIEW,
  },
  {
    label: "الماركات (Brands)",
    href: "/admin/brands",
    icon: Tag,
    permission: PERMISSIONS.PRODUCTS_VIEW,
  },
  {
    label: "الفئات (Categories)",
    href: "/admin/categories",
    icon: FolderTree,
    permission: PERMISSIONS.PRODUCTS_VIEW,
  },
  {
    label: "الطلبات (Orders)",
    href: "/admin/orders",
    icon: ShoppingCart,
    permission: PERMISSIONS.ORDERS_VIEW,
  },
  {
    label: "العملاء (Customers)",
    href: "/admin/customers",
    icon: Users,
    permission: PERMISSIONS.CUSTOMERS_VIEW,
  },
  {
    label: "التقييمات (Reviews)",
    href: "/admin/reviews",
    icon: Star,
    permission: PERMISSIONS.REVIEWS_VIEW,
  },
  {
    label: "المخزون (Inventory)",
    href: "/admin/inventory",
    icon: Warehouse,
    permission: PERMISSIONS.INVENTORY_VIEW,
    children: [
      { label: "كل المخزون (All Stock)", href: "/admin/inventory" },
      { label: "مخزون منخفض (Low Stock)", href: "/admin/inventory/low-stock" },
      { label: "نفذ من المخزون (Out of Stock)", href: "/admin/inventory/out-of-stock" },
    ],
  },
  {
    label: "التسويق (Marketing)",
    href: "/admin/marketing/discounts",
    icon: Megaphone,
    permission: PERMISSIONS.MARKETING_VIEW,
    children: [
      { label: "الخصومات (Discounts)", href: "/admin/marketing/discounts" },
      { label: "الكوبونات (Coupons)", href: "/admin/marketing/coupons" },
      { label: "البانرات الإعلانية (Banners)", href: "/admin/marketing/banners" },
    ],
  },
  {
    label: "الصفحات والواجهة (CMS)",
    href: "/admin/cms/homepage",
    icon: FileText,
    permission: PERMISSIONS.CMS_VIEW,
    children: [
      { label: "أقسام الرئيسية (Homepage)", href: "/admin/cms/homepage" },
      { label: "الصفحات الثابتة (Pages)", href: "/admin/cms/pages" },
    ],
  },
  {
    label: "محركات البحث (SEO)",
    href: "/admin/seo",
    icon: Search,
    permission: PERMISSIONS.CMS_VIEW,
  },
  {
    label: "إعدادات المتجر (Settings)",
    href: "/admin/settings",
    icon: Settings,
    permission: PERMISSIONS.SETTINGS_VIEW,
  },
  {
    label: "مديرو النظام (Users)",
    href: "/admin/users",
    icon: UserCog,
    permission: PERMISSIONS.USERS_MANAGE,
  },
  {
    label: "الأمان والسجلات (Security)",
    href: "/admin/security/audit-logs",
    icon: Shield,
    permission: PERMISSIONS.AUDIT_VIEW,
    children: [
      { label: "سجل العمليات (Audit Logs)", href: "/admin/security/audit-logs" },
      { label: "سجل الدخول (Login History)", href: "/admin/security/login-history" },
    ],
  },
];

interface AdminSidebarProps {
  permissions: string[];
  isOpen?: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ permissions, isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter(
    (item) => !item.permission || hasPermission(permissions, item.permission)
  );

  return (
    <aside
      className={cn(
        "fixed inset-y-0 z-50 flex w-72 flex-col border-r border-luxury-border/20 bg-premium-black shadow-2xl transition-transform duration-300 ease-in-out lg:w-64 lg:translate-x-0 lg:shadow-none",
        "left-0 rtl:left-auto rtl:right-0 rtl:border-r-0 rtl:border-l",
        isOpen
          ? "translate-x-0"
          : "-translate-x-full rtl:translate-x-full lg:translate-x-0 rtl:lg:translate-x-0"
      )}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between border-b border-luxury-border/20 px-4">
        <div className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Lovely Products Logo"
            className="h-9 w-auto object-contain rounded-md border border-gold/30"
          />
          <div>
            <p className="font-display text-xs tracking-widest text-luxury-white font-bold">
              LOVELY ORDERS
            </p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-gold font-semibold">
              Admin Portal
            </p>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-luxury-muted hover:text-luxury-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation Links */}
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
                  onClick={() => {
                    if (onClose && window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-luxury px-3 py-2.5 text-sm transition-colors touch-manipulation",
                    isActive
                      ? "bg-gold/15 text-gold border border-gold/30 font-medium"
                      : "text-luxury-muted hover:bg-surface-elevated hover:text-luxury-white"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0 text-gold" />
                  <span className="flex-1 text-xs sm:text-sm font-medium">{item.label}</span>
                  {item.children && (
                    <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                  )}
                </Link>
                {item.children && isActive && (
                  <ul className="ml-6 mr-6 mt-1 space-y-0.5 border-l rtl:border-l-0 rtl:border-r border-luxury-border/20 pl-3 rtl:pl-0 rtl:pr-3">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          onClick={() => {
                            if (onClose && window.innerWidth < 1024) {
                              onClose();
                            }
                          }}
                          className={cn(
                            "block rounded-luxury px-2 py-2 text-xs transition-colors touch-manipulation",
                            pathname === child.href
                              ? "text-gold font-semibold bg-gold/10"
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

      {/* Sidebar Footer */}
      <div className="border-t border-luxury-border/20 p-4">
        <p className="text-[10px] uppercase tracking-wider text-luxury-muted text-center">
          لوحة تحكم المتجر الفاخر 🛍️
        </p>
      </div>
    </aside>
  );
}
