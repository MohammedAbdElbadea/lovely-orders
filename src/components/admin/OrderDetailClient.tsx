"use client";

import { useTransition } from "react";
import { OrderTimeline } from "@/components/admin/OrderTimeline";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  updateOrderStatus,
  verifyPayment,
  updateOrderNotes,
} from "@/app/actions/admin/orders";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderItem, OrderStatus } from "@/types/domain.types";

interface OrderDetailClientProps {
  order: Order & {
    items: OrderItem[];
    statusHistory: {
      id: string;
      previous_status: OrderStatus | null;
      new_status: OrderStatus;
      note: string | null;
      created_at: string;
    }[];
  };
}

const statusOptions = [
  { value: "pending_payment", label: "Pending Payment" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function OrderDetailClient({ order }: OrderDetailClientProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>{order.order_number}</CardTitle>
              <div className="flex gap-2">
                <StatusBadge status={order.status} type="order" />
                <StatusBadge status={order.payment_status} type="payment" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-luxury-muted">Customer</p>
                <p className="text-luxury-white">{order.guest_name}</p>
              </div>
              <div>
                <p className="text-luxury-muted">Phone</p>
                <p className="text-luxury-white">{order.guest_phone}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-luxury-muted">Address</p>
                <p className="text-luxury-white">{order.guest_address}</p>
              </div>
              <div>
                <p className="text-luxury-muted">Payment Method</p>
                <p className="capitalize text-luxury-white">
                  {order.payment_method.replace("_", " ")}
                </p>
              </div>
              {order.payment_reference && (
                <div>
                  <p className="text-luxury-muted">Payment Reference</p>
                  <p className="text-luxury-white">{order.payment_reference}</p>
                </div>
              )}
            </div>

            <div className="overflow-x-auto rounded-luxury border border-luxury-border/20">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-luxury-border/20 bg-surface-elevated">
                    <th className="px-4 py-2 text-left text-luxury-muted">Item</th>
                    <th className="px-4 py-2 text-left text-luxury-muted">SKU</th>
                    <th className="px-4 py-2 text-right text-luxury-muted">Qty</th>
                    <th className="px-4 py-2 text-right text-luxury-muted">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-b border-luxury-border/10">
                      <td className="px-4 py-2">{item.product_name}</td>
                      <td className="px-4 py-2 text-luxury-muted">{item.product_sku}</td>
                      <td className="px-4 py-2 text-right">{item.quantity}</td>
                      <td className="px-4 py-2 text-right">
                        {formatPrice(Number(item.total_price), "EGP", "en-EG")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-luxury-border/30">
                  {order.discount_amount > 0 && (
                    <>
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right text-sm text-luxury-muted">المجموع الفرعي (Subtotal)</td>
                        <td className="px-4 py-2 text-right text-sm font-medium text-luxury-white">
                          {formatPrice(Number(order.subtotal ?? order.total_amount), "EGP", "en-EG")}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right text-sm font-semibold text-emerald-600">
                          خصم البروموكود (Discount) 🏷️
                        </td>
                        <td className="px-4 py-2 text-right text-sm font-semibold text-emerald-600">
                          -{formatPrice(Number(order.discount_amount), "EGP", "en-EG")}
                        </td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td colSpan={3} className="px-4 py-2 text-right font-bold text-luxury-white">الإجمالي النهائي (Total)</td>
                    <td className="px-4 py-2 text-right font-bold text-lg text-gold">
                      {formatPrice(Number(order.total_amount), "EGP", "en-EG")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Status History</CardTitle></CardHeader>
          <CardContent>
            <OrderTimeline entries={order.statusHistory} />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Update Status</CardTitle></CardHeader>
          <CardContent>
            <form
              action={(formData) => {
                startTransition(async () => {
                  await updateOrderStatus(order.id, formData);
                });
              }}
              className="space-y-4"
            >
              <Select
                label="Status"
                name="status"
                options={statusOptions}
                defaultValue={order.status}
              />
              <Textarea label="Note (optional)" name="note" />
              <Button type="submit" loading={isPending} className="w-full">
                Update Status
              </Button>
            </form>
          </CardContent>
        </Card>

        {order.payment_status === "pending" && (
          <Card>
            <CardHeader><CardTitle>Payment Verification</CardTitle></CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-luxury-muted">
                Verify payment after confirming transfer to store account.
              </p>
              <Button
                className="w-full"
                loading={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await verifyPayment(order.id);
                  });
                }}
              >
                Verify Payment
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle>Internal Notes</CardTitle></CardHeader>
          <CardContent>
            <form
              action={(formData) => {
                startTransition(async () => {
                  await updateOrderNotes(order.id, formData.get("notes") as string);
                });
              }}
              className="space-y-4"
            >
              <Textarea
                name="notes"
                defaultValue={order.internal_notes ?? ""}
                placeholder="Add internal notes..."
              />
              <Button type="submit" variant="secondary" loading={isPending} className="w-full">
                Save Notes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
