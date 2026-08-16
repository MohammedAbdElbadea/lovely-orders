"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteProductsBulk } from "@/app/actions/admin/products";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/domain.types";

interface ProductsListProps {
  products: Product[];
}

export function ProductsList({ products }: ProductsListProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  const columns: Column<Product>[] = [
    {
      key: "name",
      header: "Product",
      render: (row) => (
        <Link
          href={`/admin/products/${row.id}/edit`}
          className="font-medium text-luxury-white hover:text-gold"
        >
          {row.name}
        </Link>
      ),
    },
    { key: "sku", header: "SKU" },
    {
      key: "price",
      header: "Price",
      render: (row) => formatPrice(Number(row.price), "EGP", "en-EG"),
    },
    {
      key: "stock_quantity",
      header: "Stock",
      render: (row) => (
        <span
          className={
            row.stock_quantity === 0
              ? "text-red-400"
              : row.stock_quantity <= row.low_stock_threshold
                ? "text-amber-400"
                : ""
          }
        >
          {row.stock_quantity}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.status === "published" ? "inStock" : "outline"}>
          {row.status}
        </Badge>
      ),
    },
  ];

  const handleBulkDelete = () => {
    if (!selectedIds.length || !confirm("Delete selected products?")) return;
    startTransition(async () => {
      await deleteProductsBulk(selectedIds);
      setSelectedIds([]);
    });
  };

  return (
    <div className="space-y-4">
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3 rounded-luxury border border-luxury-border/30 bg-surface-elevated px-4 py-2">
          <span className="text-sm text-luxury-muted">
            {selectedIds.length} selected
          </span>
          <Button
            variant="destructive"
            size="sm"
            loading={isPending}
            onClick={handleBulkDelete}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      )}

      <DataTable
        data={products}
        columns={columns}
        searchKeys={["name", "sku"]}
        searchPlaceholder="Search products..."
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  );
}
