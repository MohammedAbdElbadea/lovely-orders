"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/stores/cart-store";
import { createOrderAction } from "@/app/actions/orders";
import { formatPrice } from "@/lib/utils";
import { PAYMENT_NUMBER, PAYMENT_METHODS } from "@/lib/constants";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const total = subtotal();
  const [state, formAction, pending] = useActionState(createOrderAction, null);

  useEffect(() => {
    if (state?.success && state.orderNumber && state.trackingToken) {
      clearCart();
      router.push(
        `/order-confirmation/${state.orderNumber}?token=${state.trackingToken}`
      );
    }
  }, [state, clearCart, router]);

  if (items.length === 0 && !state?.success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-luxury-muted/30" />
        <h1 className="mt-6 font-display text-3xl tracking-wide">Checkout</h1>
        <p className="mt-2 text-luxury-muted">Your cart is empty</p>
        <Link href="/products" className="mt-8 inline-block">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl tracking-wide sm:text-4xl">
        Checkout
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <form action={formAction} className="space-y-6">
          <input
            type="hidden"
            name="items"
            value={JSON.stringify(items)}
          />

          <div className="rounded-luxury border border-luxury-border/20 bg-premium-black p-6 space-y-4">
            <h2 className="font-display text-lg tracking-wide">
              Contact & Delivery
            </h2>
            <Input name="guestName" label="Full Name" required />
            <Input
              name="guestPhone"
              label="Phone Number"
              type="tel"
              required
              placeholder="01XXXXXXXXX"
            />
            <Textarea
              name="guestAddress"
              label="Delivery Address"
              required
              rows={3}
              placeholder="Street, building, city..."
            />
          </div>

          <div className="rounded-luxury border border-luxury-border/20 bg-premium-black p-6 space-y-4">
            <h2 className="font-display text-lg tracking-wide">
              Payment Method
            </h2>

            <label className="flex cursor-pointer items-start gap-3 rounded-luxury border border-luxury-border/30 p-4 transition-colors hover:border-gold/40 has-[:checked]:border-gold has-[:checked]:bg-gold/5">
              <input
                type="radio"
                name="paymentMethod"
                value={PAYMENT_METHODS.VODAFONE_CASH}
                defaultChecked
                className="mt-1 accent-gold"
              />
              <div>
                <p className="font-medium">Vodafone Cash</p>
                <p className="mt-1 text-sm text-luxury-muted">
                  Transfer to{" "}
                  <span className="font-mono text-gold">{PAYMENT_NUMBER}</span>
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-luxury border border-luxury-border/30 p-4 transition-colors hover:border-gold/40 has-[:checked]:border-gold has-[:checked]:bg-gold/5">
              <input
                type="radio"
                name="paymentMethod"
                value={PAYMENT_METHODS.INSTAPAY}
                className="mt-1 accent-gold"
              />
              <div>
                <p className="font-medium">InstaPay</p>
                <p className="mt-1 text-sm text-luxury-muted">
                  Send payment to{" "}
                  <span className="font-mono text-gold">{PAYMENT_NUMBER}</span>
                </p>
              </div>
            </label>

            <div className="rounded-luxury border border-gold/20 bg-gold/5 p-4">
              <p className="text-sm font-medium text-gold">Payment Instructions</p>
              <ol className="mt-2 list-decimal space-y-1 pl-4 text-sm text-luxury-muted">
                <li>
                  Send the total amount ({formatPrice(total)}) to{" "}
                  <strong className="text-luxury-white">{PAYMENT_NUMBER}</strong>
                </li>
                <li>Use your order number as the payment reference</li>
                <li>Your order will be processed once payment is verified</li>
              </ol>
            </div>

            <Input
              name="paymentReference"
              label="Payment Reference (optional)"
              placeholder="Transaction ID or sender name"
            />
          </div>

          {state?.error && (
            <p className="text-sm text-red-400" role="alert">
              {state.error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" loading={pending}>
            Place Order — {formatPrice(total)}
          </Button>
        </form>

        <aside className="rounded-luxury border border-luxury-border/20 bg-premium-black p-6 h-fit">
          <h2 className="font-display text-xl tracking-wide">Order Summary</h2>
          <ul className="mt-6 space-y-4">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.variantId ?? "default"}`}
                className="flex justify-between gap-4 text-sm"
              >
                <span className="text-luxury-muted">
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-luxury-border/20 pt-4">
            <div className="flex justify-between">
              <span className="font-medium">Total</span>
              <span className="font-display text-xl text-gold">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
