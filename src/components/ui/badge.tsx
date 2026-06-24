"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-luxury px-2 py-0.5 text-xs font-medium tracking-wide uppercase transition-colors",
  {
    variants: {
      variant: {
        default: "bg-surface-elevated text-luxury-white border border-luxury-border/30",
        sale: "bg-red-600/20 text-red-400 border border-red-600/30",
        new: "bg-gold/20 text-gold border border-gold/30",
        featured: "bg-gold text-deep-black border border-gold",
        inStock: "bg-emerald-600/20 text-emerald-400 border border-emerald-600/30",
        lowStock: "bg-amber-600/20 text-amber-400 border border-amber-600/30",
        outOfStock: "bg-red-600/20 text-red-400 border border-red-600/30",
        outline: "border border-luxury-border/40 text-luxury-muted bg-transparent",
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
