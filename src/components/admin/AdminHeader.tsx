"use client";

import { logoutAction } from "@/app/actions/admin/auth";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { Button } from "@/components/ui/button";
import { LogOut, User, Menu } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
  link_url: string | null;
}

interface AdminHeaderProps {
  adminName: string;
  adminEmail: string;
  roleName?: string;
  notifications: Notification[];
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function AdminHeader({
  adminName,
  adminEmail,
  roleName,
  notifications,
  onToggleSidebar,
  isSidebarOpen,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-luxury-border/20 bg-deep-black/95 px-3.5 sm:px-6 backdrop-blur-md">
      {/* Left: Mobile Hamburger & Title */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="text-luxury-white hover:bg-surface-elevated hover:text-gold lg:hidden h-10 w-10 shrink-0"
            aria-label="Toggle navigation menu"
            aria-expanded={isSidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <div className="min-w-0">
          <h1 className="font-display text-sm sm:text-lg font-bold tracking-wide text-luxury-white truncate">
            {adminName.split(" ")[0]} 👋
          </h1>
          {roleName && (
            <p className="text-[10px] sm:text-xs capitalize text-gold font-medium truncate">
              {roleName.replace("_", " ")}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        <NotificationBell notifications={notifications} />

        {/* User Card (Desktop) */}
        <div className="hidden items-center gap-2.5 rounded-luxury border border-luxury-border/20 bg-surface-elevated px-3 py-1.5 md:flex">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gold/20">
            <User className="h-3.5 w-3.5 text-gold" />
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-luxury-white">{adminName}</p>
            <p className="text-[10px] text-luxury-muted truncate max-w-[140px]">{adminEmail}</p>
          </div>
        </div>

        {/* Sign Out Button */}
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="text-luxury-muted hover:text-red-400 hover:bg-red-500/10 h-9 w-9"
            title="تسجيل الخروج (Sign out)"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
