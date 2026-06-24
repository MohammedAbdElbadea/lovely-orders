"use client";

import { useTransition } from "react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { moderateReview } from "@/app/actions/admin/settings";
import type { Review } from "@/types/domain.types";

interface ReviewsListProps {
  reviews: (Review & { product?: { name: string } })[];
}

export function ReviewsList({ reviews }: ReviewsListProps) {
  const [isPending, startTransition] = useTransition();

  const columns: Column<Review & { product?: { name: string } }>[] = [
    { key: "reviewer_name", header: "Reviewer" },
    {
      key: "product",
      header: "Product",
      render: (row) => row.product?.name ?? "—",
    },
    {
      key: "rating",
      header: "Rating",
      render: (row) => "★".repeat(row.rating),
    },
    { key: "title", header: "Title", render: (row) => row.title ?? "—" },
    {
      key: "status",
      header: "Status",
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
          {row.status}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) =>
        row.status === "pending" ? (
          <div className="flex gap-2">
            <Button
              size="sm"
              loading={isPending}
              onClick={() =>
                startTransition(async () => {
                  await moderateReview(row.id, "approved");
                })
              }
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="destructive"
              loading={isPending}
              onClick={() =>
                startTransition(async () => {
                  await moderateReview(row.id, "rejected");
                })
              }
            >
              Reject
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <DataTable
      data={reviews}
      columns={columns}
      searchKeys={["reviewer_name", "title"]}
      searchPlaceholder="Search reviews..."
    />
  );
}
