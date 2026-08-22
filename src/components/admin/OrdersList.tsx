"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Select } from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types/domain.types";
import { useRealtimeOrders } from "@/hooks/use-realtime-orders";

const statusOptions = [
  { value: "", label: "جميع الحالات (All statuses)" },
  { value: "pending_payment", label: "في انتظار الدفع (Pending Payment)" },
  { value: "paid", label: "تم الدفع (Paid)" },
  { value: "processing", label: "جاري التجهيز (Processing)" },
  { value: "shipped", label: "مع المندوب للشحن (Shipped)" },
  { value: "delivered", label: "تم التوصيل (Delivered)" },
  { value: "completed", label: "مكتمل (Completed)" },
  { value: "cancelled", label: "ملغي (Cancelled)" },
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
      header: "رقم الطلب (Order)",
      render: (row) => (
        <Link
          href={`/admin/orders/${row.id}`}
          className="font-bold text-gold hover:underline font-mono inline-block py-1"
        >
          {row.order_number}
        </Link>
      ),
    },
    { key: "guest_name", header: "اسم العميل" },
    {
      key: "guest_phone",
      header: "رقم الهاتف",
      render: (row) => <span className="font-mono text-luxury-muted">{row.guest_phone}</span>,
    },
    {
      key: "total_amount",
      header: "المبلغ الإجمالي",
      render: (row) => (
        <span className="font-bold font-mono text-luxury-white">
          {formatPrice(Number(row.total_amount), "EGP", "en-EG")}
        </span>
      ),
    },
    {
      key: "status",
      header: "حالة الطلب",
      render: (row) => <StatusBadge status={row.status} type="order" />,
    },
    {
      key: "payment_status",
      header: "حالة الدفع",
      render: (row) => <StatusBadge status={row.payment_status} type="payment" />,
    },
    {
      key: "created_at",
      header: "التاريخ",
      render: (row) => (
        <span className="text-xs text-luxury-muted font-mono">
          {new Date(row.created_at).toLocaleDateString("ar-EG")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-3 sm:space-y-4 max-w-full">
      <div className="w-full sm:max-w-xs">
        <Select
          label="تصفية بحسب الحالة"
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
        searchPlaceholder="ابحث برقم الطلب، اسم العميل، أو الهاتف..."
      />
    </div>
  );
}
