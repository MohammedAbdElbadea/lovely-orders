"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AutoRefreshOnFocus } from "@/components/shared/AutoRefreshOnFocus";

interface Notification {
  id: string;
  title: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
  link_url: string | null;
}

interface AdminShellProps {
  permissions: string[];
  adminName: string;
  adminEmail: string;
  roleName?: string;
  notifications: Notification[];
  children: React.ReactNode;
}

export function AdminShell({
  permissions,
  adminName,
  adminEmail,
  roleName,
  notifications,
  children,
}: AdminShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-deep-black text-luxury-white">
      <AutoRefreshOnFocus />

      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-xs transition-opacity duration-300 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Responsive Admin Sidebar */}
      <AdminSidebar
        permissions={permissions}
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col transition-all duration-300 lg:pl-64 rtl:lg:pl-0 rtl:lg:pr-64">
        <AdminHeader
          adminName={adminName}
          adminEmail={adminEmail}
          roleName={roleName}
          notifications={notifications}
          onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
          isSidebarOpen={mobileSidebarOpen}
        />
        <main className="w-full min-w-0 max-w-full flex-1 overflow-x-hidden p-3.5 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
