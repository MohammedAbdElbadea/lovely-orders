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
      header: "Product",
      render: (row) => (
        <Link href={`/admin/products/${row.id}/edit`} className="text-gold hover:underline">
          {row.name}
        </Link>
      ),
    },
    { key: "sku", header: "SKU" },
    {
      key: "stock_quantity",
      header: "Stock",
      render: (row) => (
        <span
          className={
            row.stock_quantity === 0
              ? "text-red-400 font-medium"
              : row.stock_quantity <= row.low_stock_threshold
                ? "text-amber-400 font-medium"
                : "text-emerald-400"
          }
        >
          {row.stock_quantity}
        </span>
      ),
    },
    {
      key: "status",
      header: "Availability",
      render: (row) => (
        <Badge variant={row.is_available ? "inStock" : "outOfStock"}>
          {row.is_available ? "Available" : "Unavailable"}
        </Badge>
      ),
    },
  ];

  if (showAdjust) {
    columns.push({
      key: "adjust",
      header: "Adjust",
      render: (row) => (
        <form
          className="flex items-end gap-2"
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
          <Input name="quantity" type="number" placeholder="±qty" className="w-20 h-8" />
          <Select
            name="reason"
            options={[
              { value: "restock", label: "Restock" },
              { value: "adjustment", label: "Adjust" },
              { value: "damage", label: "Damage" },
              { value: "return", label: "Return" },
            ]}
            className="w-28 h-8 text-xs"
          />
          <Button type="submit" size="sm" loading={isPending}>
            Apply
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
      searchPlaceholder="Search inventory..."
    />
  );
}
