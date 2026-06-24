"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } =
    useCartStore();
  const total = subtotal();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-luxury-muted/30" />
        <h1 className="mt-6 font-display text-3xl tracking-wide">Your Cart</h1>
        <p className="mt-2 text-luxury-muted">Your cart is empty</p>
        <Link href="/products" className="mt-8 inline-block">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl tracking-wide sm:text-4xl">
          Your Cart
        </h1>
        <Button variant="ghost" onClick={clearCart} className="text-sm">
          Clear Cart
        </Button>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ul className="divide-y divide-luxury-border/20 rounded-luxury border border-luxury-border/20 bg-premium-black">
            {items.map((item) => (
              <li
                key={`${item.productId}-${item.variantId ?? "default"}`}
                className="flex gap-4 p-4 sm:p-6"
              >
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-luxury bg-surface-elevated">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-6 w-6 text-luxury-muted/30" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium text-luxury-white hover:text-gold"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-luxury-muted">
                      SKU: {item.sku}
                    </p>
                    <p className="mt-1 text-gold">{formatPrice(item.price)}</p>
                  </div>

                  <div className="mt-4 flex items-center gap-4 sm:mt-0">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity - 1,
                            item.variantId
                          )
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1,
                            item.variantId
                          )
                        }
                        disabled={item.quantity >= item.maxQuantity}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>

                    <p className="w-24 text-right font-display text-lg text-gold">
                      {formatPrice(item.price * item.quantity)}
                    </p>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        removeItem(item.productId, item.variantId)
                      }
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4 text-luxury-muted hover:text-red-400" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <aside className="rounded-luxury border border-luxury-border/20 bg-premium-black p-6 h-fit">
          <h2 className="font-display text-xl tracking-wide">Order Summary</h2>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-luxury-muted">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-luxury-muted">Shipping</span>
              <span className="text-luxury-muted">Calculated at checkout</span>
            </div>
            <div className="border-t border-luxury-border/20 pt-3">
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-display text-xl text-gold">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>
          <Link href="/checkout" className="mt-6 block">
            <Button className="w-full" size="lg">
              Proceed to Checkout
            </Button>
          </Link>
          <Link href="/products" className="mt-3 block">
            <Button variant="secondary" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}
