"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Package, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/utils";
import type { Order, OrderItem } from "@/types/domain.types";

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending Payment",
  paid: "Payment Verified",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
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
      setError("Please enter both order number and tracking token");
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
        setError(data.error ?? "Order not found");
        return;
      }

      setOrder(data.order);
    } catch {
      setError("Failed to track order. Please try again.");
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
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <Package className="mx-auto h-12 w-12 text-gold" />
        <h1 className="mt-4 font-display text-3xl tracking-wide sm:text-4xl">
          Track Your Order
        </h1>
        <p className="mt-2 text-luxury-muted">
          Enter your order number and tracking token from your confirmation
        </p>
      </div>

      <form onSubmit={trackOrder} className="mt-10 space-y-4">
        <Input
          label="Order Number"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="LO-YYMMDD-XXXX"
          required
        />
        <Input
          label="Tracking Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Your tracking token"
          required
        />
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" loading={loading}>
          <Search className="h-4 w-4" />
          Track Order
        </Button>
      </form>

      {order && (
        <div className="mt-10 rounded-luxury border border-luxury-border/20 bg-premium-black p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold">
                Order Status
              </p>
              <p className="mt-1 font-display text-xl">
                {STATUS_LABELS[order.status] ?? order.status}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm text-luxury-muted">
                {order.order_number}
              </p>
              <p className="mt-1 font-display text-lg text-gold">
                {formatPrice(Number(order.total_amount))}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-luxury-border/20 pt-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gold mb-3">
              Items
            </p>
            <ul className="space-y-3">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between text-sm"
                >
                  <span className="text-luxury-muted">
                    {item.product_name} × {item.quantity}
                  </span>
                  <span>{formatPrice(Number(item.total_price))}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 grid gap-2 text-sm text-luxury-muted">
            <p>
              <span className="text-luxury-white">Payment:</span>{" "}
              {order.payment_status === "verified"
                ? "Verified"
                : "Pending verification"}
            </p>
            <p>
              <span className="text-luxury-white">Placed:</span>{" "}
              {new Date(order.created_at).toLocaleDateString("en-EG", {
                dateStyle: "long",
              })}
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
          <p className="text-luxury-muted">Loading...</p>
        </div>
      }
    >
      <TrackOrderForm />
    </Suspense>
  );
}
