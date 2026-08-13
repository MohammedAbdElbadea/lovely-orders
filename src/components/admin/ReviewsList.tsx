"use client";

import { useTransition } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { moderateReview } from "@/app/actions/admin/settings";
import type { Review } from "@/types/domain.types";
import { CheckCircle2, XCircle } from "lucide-react";

interface ReviewsListProps {
  reviews: (Review & { product?: { name: string } })[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  const [isPending, startTransition] = useTransition();

  const columns: Column<Review & { product?: { name: string } }>[] = [
    {
      key: "reviewer_name",
      header: "اسم المراجع / العميل",
      render: (row) => (
        <div>
          <p className="font-bold text-luxury-white">{row.reviewer_name}</p>
          {row.created_at && (
            <p className="text-[11px] text-luxury-muted">
              {new Date(row.created_at).toLocaleDateString("ar-EG")}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "product",
      header: "المنتج المراجع",
      render: (row) => (
        <span className="font-medium text-luxury-white">
          {row.product?.name ?? "منتج عام"}
        </span>
      ),
    },
    {
      key: "rating",
      header: "التقييم",
      render: (row) => (
        <span className="text-amber-400 font-bold tracking-widest">
          {"★".repeat(row.rating)}
        </span>
      ),
    },
    {
      key: "title",
      header: "محتوى التقييم",
      render: (row) => (
        <div>
          {row.title && <p className="font-bold text-xs text-luxury-white">{row.title}</p>}
          <p className="text-xs text-luxury-muted line-clamp-2">{row.content}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "الحالة",
      render: (row) => (
        <Badge
          variant={
            row.status === "approved"
              ? "inStock"
              : row.status === "rejected"
                ? "outOfStock"
                : "lowStock"
          }
        >
          {row.status === "approved"
            ? "مقبول (ظاهر بالمتجر)"
            : row.status === "rejected"
              ? "مرفوض"
              : "معلق (بانتظار المراجعة)"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "إجراءات التحكم",
      render: (row) => (
        <div className="flex gap-2">
          {row.status !== "approved" && (
            <Button
              size="sm"
              loading={isPending}
              className="font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
              onClick={() =>
                startTransition(async () => {
                  await moderateReview(row.id, "approved");
                })
              }
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>قبول التقييم</span>
            </Button>
          )}
          {row.status !== "rejected" && (
            <Button
              size="sm"
              variant="destructive"
              loading={isPending}
              className="font-bold flex items-center gap-1"
              onClick={() =>
                startTransition(async () => {
                  await moderateReview(row.id, "rejected");
                })
              }
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>رفض</span>
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <DataTable
      data={reviews}
      columns={columns}
      searchKeys={["reviewer_name", "title", "content"]}
      searchPlaceholder="ابحث في تقييمات ومراجعات العملاء..."
    />
  );
}
