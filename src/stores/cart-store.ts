"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types/domain.types";
import { MAX_CART_QUANTITY } from "@/lib/constants";

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variantId?: string
  ) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  totalItems: () => number;
  subtotal: () => number;
}

function itemKey(productId: string, variantId?: string): string {
  return variantId ? `${productId}:${variantId}` : productId;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (item) => {
        const quantity = Math.min(item.quantity ?? 1, item.maxQuantity, MAX_CART_QUANTITY);
        set((state) => {
          const key = itemKey(item.productId, item.variantId);
          const existingIndex = state.items.findIndex(
            (i) => itemKey(i.productId, i.variantId) === key
          );

          if (existingIndex >= 0) {
            const updated = [...state.items];
            const existing = updated[existingIndex];
            const newQty = Math.min(
              existing.quantity + quantity,
              existing.maxQuantity,
              MAX_CART_QUANTITY
            );
            updated[existingIndex] = { ...existing, quantity: newQty };
            return { items: updated };
          }

          return {
            items: [...state.items, { ...item, quantity }],
          };
        });
      },

      removeItem: (productId, variantId) => {
        const key = itemKey(productId, variantId);
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.productId, i.variantId) !== key
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        const key = itemKey(productId, variantId);
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }

        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.productId, i.variantId) === key
              ? {
                  ...i,
                  quantity: Math.min(quantity, i.maxQuantity, MAX_CART_QUANTITY),
                }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getItemCount: () =>
        get().items.reduce((total, item) => total + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),

      totalItems: () => get().getItemCount(),
      subtotal: () => get().getSubtotal(),
    }),
    {
      name: "lovely-orders-cart",
    }
  )
);
