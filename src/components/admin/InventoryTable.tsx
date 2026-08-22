"use client";

import { useTransition } from "react";
import Link from "next/link";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { adjustStock } from "@/app/actions/admin/inventory";
import type { Product } from "@/types/domain.types";

interface InventoryTableProps {
  products: Product[];
  showAdjust?: boolean;
}

export function InventoryTable({ products, showAdjust = true }: InventoryTableProps) {
  const [isPending, startTransition] = useTransition();

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "المنتج (Product)",
      render: (row) => (
        <Link href={`/admin/products/${row.id}/edit`} className="font-semibold text-gold hover:underline block py-1">
          {row.name}
        </Link>
      ),
    },
    {
      key: "sku",
      header: "الكود (SKU)",
      render: (row) => <span className="font-mono text-luxury-muted">{row.sku}</span>,
    },
    {
      key: "stock_quantity",
      header: "الكمية الحالية",
      render: (row) => (
        <span
          className={
            row.stock_quantity === 0
              ? "text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded-md"
              : row.stock_quantity <= row.low_stock_threshold
                ? "text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md"
                : "text-emerald-400 font-semibold font-mono"
          }
        >
          {row.stock_quantity}
        </span>
      ),
    },
    {
      key: "status",
      header: "حالة التوفر",
      render: (row) => (
        <Badge variant={row.is_available ? "inStock" : "outOfStock"}>
          {row.is_available ? "متوفر للطلب" : "غير متوفر"}
        </Badge>
      ),
    },
  ];

  if (showAdjust) {
    columns.push({
      key: "adjust",
      header: "تعديل سريع للمخزون",
      render: (row) => (
        <form
          className="flex items-center gap-1.5 py-1"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.currentTarget;
            const formData = new FormData(form);
            formData.set("productId", row.id);
            startTransition(async () => {
              await adjustStock(formData);
            });
          }}
        >
          <input type="hidden" name="productId" value={row.id} />
          <Input name="quantity" type="number" placeholder="±العدد" className="w-20 h-8 text-xs font-mono text-center" />
          <Select
            name="reason"
            options={[
              { value: "restock", label: "توريد (+)" },
              { value: "adjustment", label: "جرد يدوي" },
              { value: "damage", label: "تالف (-)" },
              { value: "return", label: "مرتجع (+)" },
            ]}
            className="w-24 h-8 text-[11px]"
          />
          <Button type="submit" size="sm" loading={isPending} className="h-8 px-2.5 text-xs">
            تطبيق
          </Button>
        </form>
      ),
    });
  }

  return (
    <DataTable
      data={products}
      columns={columns}
      searchKeys={["name", "sku"]}
      searchPlaceholder="ابحث في المخزون بالاسم أو الكود..."
    />
  );
}
