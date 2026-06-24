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
        "rounded-luxury border border-luxury-border/30 bg-premium-black p-6 transition-colors hover:border-gold/30",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-luxury-muted">{title}</p>
          <p className="font-display text-3xl text-luxury-white">{value}</p>
          {description && (
            <p className="text-xs text-luxury-muted">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-emerald-400" : "text-red-400"
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        {Icon && (
          <div className="rounded-luxury bg-gold/10 p-2.5">
            <Icon className="h-5 w-5 text-gold" />
          </div>
        )}
      </div>
    </div>
  );
}
