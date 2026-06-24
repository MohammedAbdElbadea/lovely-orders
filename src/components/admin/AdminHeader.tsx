"use client";

import { logoutAction } from "@/app/actions/admin/auth";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

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
}

export function AdminHeader({
  adminName,
  adminEmail,
  roleName,
  notifications,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-luxury-border/20 bg-deep-black/95 px-6 backdrop-blur-sm">
      <div>
        <h1 className="font-display text-lg tracking-wide text-luxury-white">
          Welcome back, {adminName.split(" ")[0]}
        </h1>
        {roleName && (
          <p className="text-xs capitalize text-luxury-muted">{roleName.replace("_", " ")}</p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell notifications={notifications} />

        <div className="hidden items-center gap-3 rounded-luxury border border-luxury-border/20 bg-surface-elevated px-3 py-1.5 sm:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20">
            <User className="h-4 w-4 text-gold" />
          </div>
          <div className="text-right">
            <p className="text-sm text-luxury-white">{adminName}</p>
            <p className="text-xs text-luxury-muted">{adminEmail}</p>
          </div>
        </div>

        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="icon" title="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
