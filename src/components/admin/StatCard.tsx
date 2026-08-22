import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: { value: string; positive?: boolean };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-luxury border border-luxury-border/30 bg-premium-black p-4 sm:p-5 transition-all hover:border-gold/40 shadow-xs",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-luxury-muted font-medium truncate">
            {title}
          </p>
          <p className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-luxury-white break-words">
            {value}
          </p>
          {description && (
            <p className="text-[11px] sm:text-xs text-luxury-muted truncate">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs font-semibold pt-0.5",
                trend.positive ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="rounded-luxury bg-gold/10 p-2 sm:p-2.5 shrink-0">
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
          </div>
        )}
      </div>
    </div>
  );
}
