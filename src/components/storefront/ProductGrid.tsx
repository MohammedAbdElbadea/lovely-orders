"use client";

import { motion } from "framer-motion";
import { ProductCard } from "@/components/storefront/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/domain.types";

interface ProductGridProps {
  products: Product[];
  className?: string;
  emptyMessage?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function ProductGrid({
  products,
  className,
  emptyMessage = "لم يتم العثور على منتجات.",
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-luxury border border-dashed border-luxury-border/30 bg-surface-elevated/40 px-6 py-12 text-center">
        <p className="text-luxury-muted font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4",
        className
      )}
    >
      {products.map((product, index) => (
        <motion.div key={product.id} variants={itemVariants}>
          <ProductCard
            product={product}
            priority={index < 4}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
