export const STORE_NAME = "LOVELY ORDERS";
export const STORE_TAGLINE = "Curated premium cosmetics & skincare";
export const STORE_EMAIL = "hello@lovelyorders.com";
export const STORE_PHONE = "01067258266";
export const PAYMENT_NUMBER = "01067258266";

export const PAYMENT_METHODS = {
  VODAFONE_CASH: "vodafone_cash",
  INSTAPAY: "instapay",
  COD: "cod",
} as const;

export const ORDER_STATUSES = {
  PENDING_PAYMENT: "pending_payment",
  PAID: "paid",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const PAYMENT_STATUSES = {
  PENDING: "pending",
  VERIFIED: "verified",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export const PRODUCT_STATUSES = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const REVIEW_STATUSES = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export const CUSTOMER_SEGMENTS = {
  NEW: "new",
  RETURNING: "returning",
  HIGH_VALUE: "high_value",
  INACTIVE: "inactive",
} as const;

export const DEFAULT_LOW_STOCK_THRESHOLD = 5;
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_CART_QUANTITY = 99;

export const ROUTES = {
  HOME: "/",
  PRODUCTS: "/products",
  CART: "/cart",
  CHECKOUT: "/checkout",
  TRACK_ORDER: "/track-order",
  ADMIN: "/admin",
  ADMIN_LOGIN: "/auth/admin/login",
} as const;

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
