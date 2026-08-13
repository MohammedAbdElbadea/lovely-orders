"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Select } from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types/domain.types";
import { useRealtimeOrders } from "@/hooks/use-realtime-orders";

const statusOptions = [
  { value: "", label: "All statuses" },
  { value: "pending_payment", label: "Pending Payment" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  useRealtimeOrders();
  const searchParams = useSearchParams();

  const statusFilter = searchParams.get("status") ?? "";

  const filtered = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  const columns: Column<Order>[] = [
    {
      key: "order_number",
      header: "Order",
      render: (row) => (
        <Link href={`/admin/orders/${row.id}`} className="font-medium text-gold hover:underline">
          {row.order_number}
        </Link>
      ),
    },
    { key: "guest_name", header: "Customer" },
    { key: "guest_phone", header: "Phone" },
    {
      key: "total_amount",
      header: "Total",
      render: (row) => formatPrice(Number(row.total_amount), "EGP", "en-EG"),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <StatusBadge status={row.status} type="order" />,
    },
    {
      key: "payment_status",
      header: "Payment",
      render: (row) => <StatusBadge status={row.payment_status} type="payment" />,
    },
    {
      key: "created_at",
      header: "Date",
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="max-w-xs">
        <Select
          label="Filter by status"
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => {
            const params = new URLSearchParams(window.location.search);
            if (e.target.value) params.set("status", e.target.value);
            else params.delete("status");
            window.location.search = params.toString();
          }}
        />
      </div>
      <DataTable
        data={filtered}
        columns={columns}
        searchKeys={["order_number", "guest_name", "guest_phone"]}
        searchPlaceholder="Search orders..."
      />
    </div>
  );
}
