"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentlyViewedItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  viewedAt: string;
}

interface RecentlyViewedState {
  items: RecentlyViewedItem[];
  addItem: (item: Omit<RecentlyViewedItem, "viewedAt">) => void;
  clearHistory: () => void;
  getRecent: (limit?: number) => RecentlyViewedItem[];
}

const MAX_RECENT_ITEMS = 12;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          const filtered = state.items.filter(
            (i) => i.productId !== item.productId
          );
          const updated = [
            { ...item, viewedAt: new Date().toISOString() },
            ...filtered,
          ].slice(0, MAX_RECENT_ITEMS);
          return { items: updated };
        });
      },

      clearHistory: () => set({ items: [] }),

      getRecent: (limit = MAX_RECENT_ITEMS) =>
        get().items.slice(0, limit),
    }),
    {
      name: "lovely-orders-recently-viewed",
    }
  )
);
