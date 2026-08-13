"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Package, Search, Truck, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderItem } from "@/types/domain.types";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "في انتظار تأكيد الدفع",
  paid: "تم تأكيد الدفع بنجاح",
  processing: "جاري تجهيز الشحنة والتغليف",
  shipped: "تم الشحن ومع المندوب للتوصيل 🚚",
  delivered: "تم التسليم للعميل بنجاح 📦",
  completed: "طلب مكتمل بالكامل",
  cancelled: "طلب ملغى",
};

function TrackOrderForm() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(
    searchParams.get("orderNumber") ?? ""
  );
  const [token, setToken] = useState(searchParams.get("token") ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<(Order & { items: OrderItem[] }) | null>(
    null
  );

  const trackOrder = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!orderNumber.trim() || !token.trim()) {
      setError("يرجى إدخال كل من رقم الطلب ورمز التتبع السري");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const params = new URLSearchParams({
        orderNumber: orderNumber.trim(),
        token: token.trim(),
      });
      const res = await fetch(`/api/orders/track?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "لم يتم العثور على هذا الطلب، تأكد من البيانات المدخلة");
        return;
      }

      setOrder(data.order);
    } catch {
      setError("فشل الاتصال بسيرفر تتبع الطلبات، يرجى المحاولة مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialOrder = searchParams.get("orderNumber");
    const initialToken = searchParams.get("token");
    if (initialOrder && initialToken) {
      trackOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <Package className="mx-auto h-14 w-14 text-gold animate-bounce" />
        <h1 className="mt-4 font-display text-3xl font-bold tracking-wide sm:text-4xl text-luxury-white">
          تتبع حالة طلبك — Track Order
        </h1>
        <p className="mt-2 text-sm text-luxury-muted">
          أدخل رقم الطلب ورمز التتبع السري لمعرفة مكان ووضعية شحنتك فوراً
        </p>
      </div>

      <form onSubmit={trackOrder} className="mt-8 space-y-4 rounded-luxury border border-luxury-border/30 bg-white p-6 shadow-md">
        <Input
          label="رقم الطلب (Order Number)"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="مثال: LO-260806-1234"
          required
        />
        <Input
          label="رمز التتبع السري (Tracking Token)"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="رمز التتبع من صفحة الفاتورة"
          required
        />
        {error && (
          <p className="text-sm font-semibold text-red-500 bg-red-50 p-3 rounded-luxury border border-red-200" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full font-bold shadow-md glow-purple" loading={loading}>
          <Search className="h-4 w-4" />
          <span>تتبع الشحنة الآن</span>
        </Button>
      </form>

      {order && (
        <div className="mt-10 rounded-luxury border border-luxury-border/30 bg-white p-6 shadow-lg space-y-6 animate-fade-up">
          <div className="flex items-center justify-between border-b border-luxury-border/20 pb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gold">
                حالة الطلب الحالية
              </p>
              <div className="mt-1 flex items-center gap-2">
                <Truck className="h-5 w-5 text-emerald-600" />
                <p className="font-display text-xl font-bold text-luxury-white">
                  {STATUS_LABELS[order.status] ?? order.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-bold text-luxury-muted">
                {order.order_number}
              </p>
              <p className="mt-1 font-display text-xl font-bold text-gold">
                {formatPrice(Number(order.total_amount))}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-gold mb-3">
              محتويات الشحنة
            </p>
            <ul className="space-y-3 bg-surface-elevated p-4 rounded-luxury border border-luxury-border/20">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-luxury-white font-medium">
                    {item.product_name} × {item.quantity}
                  </span>
                  <span className="font-bold text-gold">{formatPrice(Number(item.total_price))}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-2 text-sm text-luxury-muted border-t border-luxury-border/20 pt-4">
            <p className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span><strong>حالة الدفع:</strong> {order.payment_status === "verified" ? "تم التحقق والسداد بنجاح" : "بانتظار التحصيل / التأكيد"}</span>
            </p>
            <p className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" />
              <span><strong>تاريخ إنشاء الطلب:</strong> {new Date(order.created_at).toLocaleDateString("ar-EG", { dateStyle: "full" })}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-luxury-muted">جاري تحميل صفحة تتبع الطلب...</p>
        </div>
      }
    >
      <TrackOrderForm />
    </Suspense>
  );
}
