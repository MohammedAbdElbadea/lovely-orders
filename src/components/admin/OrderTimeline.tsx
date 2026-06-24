import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";
import type { OrderStatus } from "@/types/domain.types";
import { CheckCircle2, Circle } from "lucide-react";

interface TimelineEntry {
  id: string;
  previous_status: OrderStatus | null;
  new_status: OrderStatus;
  note: string | null;
  created_at: string;
}

interface OrderTimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

export function OrderTimeline({ entries, className }: OrderTimelineProps) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-luxury-muted">No status history yet.</p>
    );
  }

  return (
    <ol className={cn("relative space-y-0", className)}>
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
        return (
          <li key={entry.id} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast && (
              <span
                className="absolute left-[11px] top-6 h-full w-px bg-luxury-border/30"
                aria-hidden
              />
            )}
            <div className="relative z-10 mt-0.5">
              {isLast ? (
                <CheckCircle2 className="h-6 w-6 text-gold" />
              ) : (
                <Circle className="h-6 w-6 fill-surface-elevated text-luxury-border" />
              )}
            </div>
            <div className="flex-1 space-y-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={entry.new_status} type="order" />
                <time className="text-xs text-luxury-muted">
                  {new Date(entry.created_at).toLocaleString()}
                </time>
              </div>
              {entry.note && (
                <p className="text-sm text-luxury-muted">{entry.note}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
