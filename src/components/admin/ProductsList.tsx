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
      header: "اسم المنتج (Product)",
      render: (row) => (
        <Link
          href={`/admin/products/${row.id}/edit`}
          className="font-semibold text-luxury-white hover:text-gold block py-1"
        >
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
      key: "price",
      header: "السعر",
      render: (row) => (
        <span className="font-bold font-mono text-gold">
          {formatPrice(Number(row.price), "EGP", "en-EG")}
        </span>
      ),
    },
    {
      key: "stock_quantity",
      header: "المخزون",
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
      header: "الحالة",
      render: (row) => (
        <Badge variant={row.status === "published" ? "inStock" : "outline"}>
          {row.status === "published" ? "نشط (معروض)" : "مسودة"}
        </Badge>
      ),
    },
  ];

  const handleBulkDelete = () => {
    if (!selectedIds.length || !confirm("هل أنت متأكد من حذف المنتجات المحددة؟")) return;
    startTransition(async () => {
      await deleteProductsBulk(selectedIds);
      setSelectedIds([]);
    });
  };

  return (
    <div className="space-y-3 sm:space-y-4 max-w-full">
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-luxury border border-luxury-border/30 bg-surface-elevated p-3 sm:px-4 sm:py-2.5 shadow-md animate-fade-in">
          <span className="text-xs sm:text-sm text-luxury-muted">
            تم تحديد <strong className="text-gold font-mono">{selectedIds.length}</strong> منتج
          </span>
          <Button
            variant="destructive"
            size="sm"
            loading={isPending}
            onClick={handleBulkDelete}
            className="h-9 px-3 text-xs"
          >
            <Trash2 className="h-4 w-4" />
            حذف المحدد
          </Button>
        </div>
      )}

      <DataTable
        data={products}
        columns={columns}
        searchKeys={["name", "sku"]}
        searchPlaceholder="ابحث باسم المنتج أو كود SKU..."
        selectable
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
      />
    </div>
  );
}
