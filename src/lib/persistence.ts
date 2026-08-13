/**
 * persistence.ts
 * ──────────────
 * Saves ALL mutable demo-store data to a single JSON file on disk
 * (`demo-store.json` in the project root) so changes survive server restarts
 * and computer shutdowns.
 *
 * Usage:
 *   import { persistStore } from "@/lib/persistence";
 *   // call after every mutation in a Server Action:
 *   persistStore();
 */

import fs from "fs";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "demo-store.json");

/** Read the persisted JSON file and return its content, or null on any error. */
export function loadPersistedStore(): Record<string, unknown> | null {
  try {
    if (fs.existsSync(STORE_PATH)) {
      const raw = fs.readFileSync(STORE_PATH, "utf-8");
      return JSON.parse(raw) as Record<string, unknown>;
    }
  } catch (err) {
    console.warn("[persistence] Could not load demo-store.json:", err);
  }
  return null;
}

/** Snapshot every globalThis demo array to disk. Call after any mutation. */
export function persistStore(): void {
  try {
    const snapshot = {
      brands: globalThis.__DEMO_BRANDS ?? [],
      categories: globalThis.__DEMO_CATEGORIES ?? [],
      productImages: globalThis.__DEMO_PRODUCT_IMAGES ?? [],
      products: globalThis.__DEMO_PRODUCTS ?? [],
      reviews: globalThis.__DEMO_REVIEWS ?? [],
      homepageSections: globalThis.__DEMO_HOMEPAGE_SECTIONS ?? [],
      pages: globalThis.__DEMO_PAGES ?? [],
      discounts: globalThis.__DEMO_DISCOUNTS ?? [],
      coupons: globalThis.__DEMO_COUPONS ?? [],
      banners: globalThis.__DEMO_BANNERS ?? [],
      customers: globalThis.__DEMO_CUSTOMERS ?? [],
      orders: globalThis.__DEMO_ORDERS ?? [],
      storeSettings: globalThis.__DEMO_STORE_SETTINGS ?? [],
    };
    fs.writeFileSync(STORE_PATH, JSON.stringify(snapshot, null, 2), "utf-8");
  } catch (err) {
    console.error("[persistence] Could not save demo-store.json:", err);
  }
}
