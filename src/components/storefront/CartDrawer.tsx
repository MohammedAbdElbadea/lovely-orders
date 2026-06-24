"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    totalItems,
  } = useCartStore();

  if (!isOpen) return null;

  const total = subtotal();
  const count = totalItems();

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
        aria-hidden="true"
      />

      <aside
        className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-luxury-border/20 bg-deep-black shadow-2xl animate-slide-up"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-luxury-border/20 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-gold" />
            <h2 className="font-display text-lg tracking-wide">
              Your Cart ({count})
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close cart">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-luxury-muted/40" />
            <p className="text-luxury-muted">Your cart is empty</p>
            <Link href="/products" onClick={closeCart}>
              <Button variant="secondary" className="w-full">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId ?? "default"}`}
                  className="flex gap-4 border-b border-luxury-border/10 py-4 last:border-0"
                >
                  <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-luxury bg-surface-elevated">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-luxury-muted/30">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium text-luxury-white hover:text-gold line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-gold">
                      {formatPrice(item.price)}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.variantId
                            )
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.variantId
                            )
                          }
                          disabled={item.quantity >= item.maxQuantity}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-luxury-muted hover:text-red-400"
                        onClick={() =>
                          removeItem(item.productId, item.variantId)
                        }
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-luxury-border/20 px-6 py-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-luxury-muted">Subtotal</span>
                <span className="font-display text-xl text-gold">
                  {formatPrice(total)}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <Link href="/checkout" onClick={closeCart}>
                  <Button className="w-full">Checkout</Button>
                </Link>
                <Link href="/cart" onClick={closeCart}>
                  <Button variant="secondary" className="w-full">
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
