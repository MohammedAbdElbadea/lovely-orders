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
  { value: "pending_payment", label: "في انتظار الدفع (Pending Payment)" },
  { value: "paid", label: "تم الدفع (Paid)" },
  { value: "processing", label: "جاري التجهيز (Processing)" },
  { value: "shipped", label: "تم الشحن (Shipped)" },
  { value: "delivered", label: "تم التوصيل (Delivered)" },
  { value: "completed", label: "مكتمل (Completed)" },
  { value: "cancelled", label: "ملغي (Cancelled)" },
];

export function OrderDetailClient({ order }: OrderDetailClientProps) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-6 lg:grid-cols-3 max-w-full">
      <div className="space-y-6 lg:col-span-2 min-w-0">
        <Card className="border-luxury-border/30 bg-surface-elevated/40">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-base sm:text-lg font-bold text-luxury-white">
                {order.order_number}
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                <StatusBadge status={order.status} type="order" />
                <StatusBadge status={order.payment_status} type="payment" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
            <div className="grid gap-3 sm:grid-cols-2 text-xs sm:text-sm bg-premium-black p-3.5 sm:p-4 rounded-luxury border border-luxury-border/20">
              <div>
                <p className="text-luxury-muted">اسم العميل (Customer)</p>
                <p className="font-semibold text-luxury-white">{order.guest_name}</p>
              </div>
              <div>
                <p className="text-luxury-muted">رقم الهاتف (Phone)</p>
                <p className="font-mono text-luxury-white">{order.guest_phone}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-luxury-muted">العنوان والمحافظة (Address)</p>
                <p className="text-luxury-white">{order.guest_address}</p>
              </div>
              <div>
                <p className="text-luxury-muted">طريقة الدفع (Payment Method)</p>
                <p className="capitalize text-gold font-medium">
                  {order.payment_method.replace("_", " ")}
                </p>
              </div>
              {order.payment_reference && (
                <div>
                  <p className="text-luxury-muted">الرقم المرجعي للتحويل (Reference)</p>
                  <p className="font-mono text-luxury-white">{order.payment_reference}</p>
                </div>
              )}
            </div>

            {/* Responsive Order Items Table */}
            <div className="overflow-x-auto rounded-luxury border border-luxury-border/20">
              <table className="w-full text-xs sm:text-sm text-left rtl:text-right border-collapse">
                <thead>
                  <tr className="border-b border-luxury-border/20 bg-surface-elevated/80">
                    <th className="whitespace-nowrap px-3 sm:px-4 py-2.5 text-luxury-muted">المنتج (Item)</th>
                    <th className="whitespace-nowrap px-3 sm:px-4 py-2.5 text-luxury-muted">الكود (SKU)</th>
                    <th className="whitespace-nowrap px-3 sm:px-4 py-2.5 text-right rtl:text-left text-luxury-muted">الكمية</th>
                    <th className="whitespace-nowrap px-3 sm:px-4 py-2.5 text-right rtl:text-left text-luxury-muted">الإجمالي</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-border/10">
                  {order.items.map((item) => (
                    <tr key={item.id} className="transition-colors hover:bg-surface-elevated/40">
                      <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 font-medium text-luxury-white">
                        {item.product_name}
                      </td>
                      <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 font-mono text-luxury-muted">
                        {item.product_sku}
                      </td>
                      <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 text-right rtl:text-left font-mono">
                        {item.quantity}
                      </td>
                      <td className="whitespace-nowrap px-3 sm:px-4 py-2.5 text-right rtl:text-left font-mono font-medium text-luxury-white">
                        {formatPrice(Number(item.total_price), "EGP", "en-EG")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t border-luxury-border/30 bg-surface-elevated/30">
                  {order.discount_amount > 0 && (
                    <>
                      <tr>
                        <td colSpan={3} className="px-3 sm:px-4 py-2 text-right rtl:text-left text-xs sm:text-sm text-luxury-muted">
                          المجموع الفرعي (Subtotal)
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-right rtl:text-left text-xs sm:text-sm font-medium text-luxury-white font-mono">
                          {formatPrice(Number(order.subtotal ?? order.total_amount), "EGP", "en-EG")}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="px-3 sm:px-4 py-2 text-right rtl:text-left text-xs sm:text-sm font-semibold text-emerald-400">
                          خصم الكوبون (Discount) 🏷️
                        </td>
                        <td className="px-3 sm:px-4 py-2 text-right rtl:text-left text-xs sm:text-sm font-semibold text-emerald-400 font-mono">
                          -{formatPrice(Number(order.discount_amount), "EGP", "en-EG")}
                        </td>
                      </tr>
                    </>
                  )}
                  <tr>
                    <td colSpan={3} className="px-3 sm:px-4 py-2.5 text-right rtl:text-left font-bold text-luxury-white">
                      الإجمالي النهائي (Total)
                    </td>
                    <td className="px-3 sm:px-4 py-2.5 text-right rtl:text-left font-bold text-sm sm:text-base text-gold font-mono">
                      {formatPrice(Number(order.total_amount), "EGP", "en-EG")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Status History */}
        <Card className="border-luxury-border/30 bg-surface-elevated/40">
          <CardHeader className="p-4 sm:p-6"><CardTitle className="text-base sm:text-lg">سجل الحالات (Status History)</CardTitle></CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <OrderTimeline entries={order.statusHistory} />
          </CardContent>
        </Card>
      </div>

      {/* Side Actions Column */}
      <div className="space-y-6">
        <Card className="border-luxury-border/30 bg-surface-elevated/40">
          <CardHeader className="p-4 sm:p-6"><CardTitle className="text-base sm:text-lg">تحديث حالة الطلب (Status)</CardTitle></CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <form
              action={(formData) => {
                startTransition(async () => {
                  await updateOrderStatus(order.id, formData);
                });
              }}
              className="space-y-4"
            >
              <Select
                label="الحالة الجديدة (Status)"
                name="status"
                options={statusOptions}
                defaultValue={order.status}
              />
              <Textarea label="ملاحظات التحديث (اختياري)" name="note" placeholder="أدخل أي ملاحظات..." />
              <Button type="submit" loading={isPending} className="w-full h-11 text-sm font-semibold">
                حفظ الحالة
              </Button>
            </form>
          </CardContent>
        </Card>

        {order.payment_status === "pending" && (
          <Card className="border-gold/30 bg-gold/5">
            <CardHeader className="p-4 sm:p-6"><CardTitle className="text-base sm:text-lg text-gold">تأكيد الدفع 💳</CardTitle></CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <p className="mb-4 text-xs sm:text-sm text-luxury-muted leading-relaxed">
                اضغط هنا لتأكيد استلام الدفعة بعد مراجعة حساب فودافون كاش أو انستاباي.
              </p>
              <Button
                className="w-full h-11 text-sm font-semibold"
                loading={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await verifyPayment(order.id);
                  });
                }}
              >
                تأكيد الدفع الآن (Verify Payment)
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className="border-luxury-border/30 bg-surface-elevated/40">
          <CardHeader className="p-4 sm:p-6"><CardTitle className="text-base sm:text-lg">ملاحظات داخلية (Internal Notes)</CardTitle></CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
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
                placeholder="ملاحظات سرية خاصة بالإدارة..."
              />
              <Button type="submit" variant="secondary" loading={isPending} className="w-full h-10 text-xs sm:text-sm">
                حفظ الملاحظات
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
