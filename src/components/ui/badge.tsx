"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-0.5 text-[11px] font-semibold tracking-wider uppercase transition-all shadow-xs",
  {
    variants: {
      variant: {
        default: "bg-surface-elevated text-luxury-white border border-luxury-border/60",
        sale: "bg-rose-ruby text-white border border-rose-ruby/80 glow-rose animate-pulse-subtle",
        new: "bg-gold text-white border border-gold/80 glow-purple",
        featured: "bg-amber-600 text-white border border-amber-700 shadow-xs",
        inStock: "bg-emerald-600 text-white border border-emerald-700",
        lowStock: "bg-amber-600 text-white border border-amber-700",
        outOfStock: "bg-gray-600 text-white border border-gray-700",
        outline: "border border-gold/40 text-gold bg-gold-tint/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
