"use client";

import Link from "next/link";
import { Percent, ArrowRight } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Discount } from "@/types/domain.types";

interface DiscountsListProps {
  discounts: Discount[];
}

export function DiscountsList({ discounts }: DiscountsListProps) {
  const columns: Column<Discount>[] = [
    {
      key: "name",
      header: "اسم العرض / الخصم",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Percent className="h-4 w-4 text-gold shrink-0" />
          <span className="font-bold text-luxury-white">{row.name}</span>
        </div>
      ),
    },
    {
      key: "type",
      header: "نوع الخصم",
      render: (row) => (row.type === "percentage" ? "نسبة مئوية (%)" : "مبلغ ثابت (EGP)"),
    },
    {
      key: "value",
      header: "قيمة الخصم",
      render: (row) => (
        <span className="font-bold text-gold font-mono">
          {row.type === "percentage" ? `${row.value}%` : `${row.value} EGP`}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "الحالة",
      render: (row) => (
        <Badge variant={row.is_active ? "inStock" : "outOfStock"}>
          {row.is_active ? "نَشِط ومُفَعَّل" : "معطّل"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-luxury border border-gold/30 bg-gold-tint/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-bold text-luxury-white">
            خصومات وتخفيضات المنتجات (Product Discounts) 🏷️
          </h3>
          <p className="text-xs text-luxury-muted mt-1">
            يمكنك تطبيق نسبة الخصم المباشرة على أي منتج من صفحة تحرير المنتج ليظهر للعميل السعر قبل الخصم (مخطوطاً) والسعر بعد الخصم فوراً!
          </p>
        </div>
        <Link href="/admin/products">
          <Button variant="secondary" size="sm" className="font-bold border border-luxury-border/50 shrink-0">
            <span>الانتقال للمنتجات لتطبيق الخصم</span>
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Button>
        </Link>
      </div>

      <DataTable data={discounts} columns={columns} searchKeys={["name"]} />
    </div>
  );
}
