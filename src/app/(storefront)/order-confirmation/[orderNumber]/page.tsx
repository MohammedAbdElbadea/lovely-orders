import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderByNumber } from "@/services/orders.service";
import { formatPrice } from "@/lib/utils";
import { PAYMENT_NUMBER, STORE_NAME } from "@/lib/constants";

interface OrderConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: OrderConfirmationPageProps) {
  const { orderNumber } = await params;
  const { token } = await searchParams;

  const order = await getOrderByNumber(orderNumber).catch(() => null);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 lg:px-8">
      <CheckCircle className="mx-auto h-16 w-16 text-emerald-400" />

      <h1 className="mt-6 font-display text-3xl tracking-wide sm:text-4xl">
        Order Confirmed
      </h1>
      <p className="mt-2 text-luxury-muted">
        Thank you for shopping with {STORE_NAME}
      </p>

      <div className="mt-10 rounded-luxury border border-luxury-border/20 bg-premium-black p-8 text-left">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">
              Order Number
            </p>
            <p className="mt-1 font-mono text-xl text-luxury-white">
              {orderNumber}
            </p>
          </div>

          {token && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold">
                Tracking Token
              </p>
              <p className="mt-1 break-all font-mono text-sm text-luxury-muted">
                {token}
              </p>
              <p className="mt-2 text-xs text-luxury-muted">
                Save this token to track your order
              </p>
            </div>
          )}

          {order && (
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gold">
                Total Amount
              </p>
              <p className="mt-1 font-display text-2xl text-gold">
                {formatPrice(Number(order.total_amount))}
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-luxury border border-gold/20 bg-gold/5 p-4">
          <p className="text-sm font-medium text-gold">Next Steps</p>
          <ol className="mt-2 list-decimal space-y-2 pl-4 text-sm text-luxury-muted">
            <li>
              Complete your payment of{" "}
              {order ? formatPrice(Number(order.total_amount)) : "the order total"}{" "}
              to <strong className="text-luxury-white">{PAYMENT_NUMBER}</strong>
            </li>
            <li>
              Use order number <strong className="text-luxury-white">{orderNumber}</strong> as
              payment reference
            </li>
            <li>We will verify your payment and begin processing your order</li>
          </ol>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        {token && (
          <Link
            href={`/track-order?orderNumber=${encodeURIComponent(orderNumber)}&token=${encodeURIComponent(token)}`}
          >
            <Button variant="secondary">Track Order</Button>
          </Link>
        )}
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
