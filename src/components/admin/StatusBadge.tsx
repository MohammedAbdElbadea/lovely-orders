import { cn } from "@/lib/utils";
import type { OrderStatus, PaymentStatus } from "@/types/domain.types";

const orderStatusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  pending_payment: {
    label: "Pending Payment",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  paid: {
    label: "Paid",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  processing: {
    label: "Processing",
    className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
  shipped: {
    label: "Shipped",
    className: "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
  },
  delivered: {
    label: "Delivered",
    className: "bg-teal-500/20 text-teal-400 border-teal-500/30",
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
};

const paymentStatusConfig: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  },
  verified: {
    label: "Verified",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  failed: {
    label: "Failed",
    className: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  refunded: {
    label: "Refunded",
    className: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
};

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus | string;
  type?: "order" | "payment" | "generic";
  className?: string;
}

export function StatusBadge({
  status,
  type = "order",
  className,
}: StatusBadgeProps) {
  const config =
    type === "payment"
      ? paymentStatusConfig[status as PaymentStatus]
      : type === "order"
        ? orderStatusConfig[status as OrderStatus]
        : null;

  const label = config?.label ?? status.replace(/_/g, " ");
  const styles =
    config?.className ??
    "bg-surface-elevated text-luxury-muted border-luxury-border/30";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-luxury border px-2 py-0.5 text-xs font-medium capitalize",
        styles,
        className
      )}
    >
      {label}
    </span>
  );
}
