"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X, ArrowRight } from "lucide-react";
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

  const total = subtotal();
  const count = totalItems();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Slide-in Drawer */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-luxury-border/30 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-luxury-border/30 bg-surface-elevated/40 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-tint text-gold">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <h2 className="font-display text-lg font-bold text-luxury-white">
                  سلة الشراء ({count})
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close cart" className="rounded-full hover:bg-luxury-border/30">
                <X className="h-5 w-5 text-luxury-muted" />
              </Button>
            </div>

            {/* Drawer Body */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gold-tint text-gold">
                  <ShoppingBag className="h-10 w-10" />
                </div>
                <h3 className="font-display text-lg font-bold text-luxury-white">سلتك فارغة حالياً</h3>
                <p className="text-sm text-luxury-muted max-w-xs">استكشفي أحدث منتجات التجميل والعطور الفاخرة وأضيفيها لسلتك.</p>
                <Link href="/products" onClick={closeCart} className="mt-2 w-full">
                  <Button variant="primary" className="w-full font-semibold shadow-md glow-purple">
                    تصفح المنتجات الآن
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {items.map((item) => (
                    <motion.li
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      key={`${item.productId}-${item.variantId ?? "default"}`}
                      className="flex gap-4 rounded-luxury border border-luxury-border/30 bg-surface-elevated/30 p-3 shadow-xs transition-all hover:border-gold/40"
                    >
                      <div className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md bg-white">
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

                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link
                            href={`/products/${item.slug}`}
                            onClick={closeCart}
                            className="text-xs font-semibold text-luxury-white hover:text-gold line-clamp-2 leading-snug"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-sm font-bold text-gold">
                            {formatPrice(item.price)}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-md border border-luxury-border/40 bg-white">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-none text-luxury-muted hover:text-luxury-white"
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
                            <span className="w-7 text-center text-xs font-bold text-luxury-white">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-none text-luxury-muted hover:text-luxury-white"
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
                            className="h-7 w-7 text-luxury-muted hover:bg-rose-soft hover:text-rose-ruby"
                            onClick={() =>
                              removeItem(item.productId, item.variantId)
                            }
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>

                {/* Footer Checkout Summary */}
                <div className="border-t border-luxury-border/30 bg-surface-elevated/50 px-6 py-6 shadow-lg">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm font-medium text-luxury-muted">المجموع الكلي (Subtotal):</span>
                    <span className="font-display text-2xl font-bold text-gold">
                      {formatPrice(total)}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <Link href="/checkout" onClick={closeCart}>
                      <Button variant="primary" className="w-full font-bold py-6 text-base shadow-md hover-lift glow-purple flex items-center justify-center gap-2">
                        <span>متابعة إتمام الطلب</span>
                        <ArrowRight className="h-4 w-4 rotate-180" />
                      </Button>
                    </Link>
                    <Link href="/cart" onClick={closeCart}>
                      <Button variant="secondary" className="w-full font-semibold border border-luxury-border/50">
                        عرض السلة كاملة
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
