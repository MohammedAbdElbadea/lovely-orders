"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { markNotificationRead } from "@/app/actions/admin/settings";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
  link_url: string | null;
}

interface NotificationBellProps {
  notifications: Notification[];
}

export function NotificationBell({ notifications }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      await markNotificationRead(id);
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="relative rounded-luxury p-2 text-luxury-muted transition-colors hover:bg-surface-elevated hover:text-luxury-white"
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-deep-black">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute right-0 z-50 mt-2 w-80 rounded-luxury border border-luxury-border/30 bg-premium-black shadow-xl">
            <div className="border-b border-luxury-border/20 px-4 py-3">
              <p className="text-sm font-medium text-luxury-white">Notifications</p>
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-luxury-muted">
                  No notifications
                </li>
              ) : (
                notifications.map((n) => (
                  <li
                    key={n.id}
                    className={cn(
                      "border-b border-luxury-border/10 px-4 py-3 transition-colors hover:bg-surface-elevated",
                      !n.is_read && "bg-gold/5"
                    )}
                  >
                    {n.link_url ? (
                      <Link
                        href={n.link_url}
                        onClick={() => {
                          if (!n.is_read) handleMarkRead(n.id);
                          setOpen(false);
                        }}
                        className="block"
                      >
                        <NotificationItem notification={n} />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => {
                          if (!n.is_read) handleMarkRead(n.id);
                        }}
                      >
                        <NotificationItem notification={n} />
                      </button>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <>
      <p className="text-sm text-luxury-white">{notification.title}</p>
      {notification.message && (
        <p className="mt-0.5 text-xs text-luxury-muted line-clamp-2">
          {notification.message}
        </p>
      )}
      <time className="mt-1 block text-[10px] text-luxury-muted">
        {new Date(notification.created_at).toLocaleString()}
      </time>
    </>
  );
}
