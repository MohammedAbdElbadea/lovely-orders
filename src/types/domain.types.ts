export type ProductStatus = "draft" | "published" | "archived";
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "completed"
  | "cancelled";
export type PaymentStatus = "pending" | "verified" | "failed" | "refunded";
export type PaymentMethod = "vodafone_cash" | "instapay" | "cod";
export type ReviewStatus = "pending" | "approved" | "rejected";
export type DiscountType = "percentage" | "fixed";
export type DiscountScope =
  | "all"
  | "product"
  | "category"
  | "brand"
  | "collection";
export type ContentStatus = "draft" | "scheduled" | "active" | "expired";
export type CustomerSegment =
  | "new"
  | "returning"
  | "high_value"
  | "inactive";
export type InventoryReason =
  | "sale"
  | "restock"
  | "adjustment"
  | "return"
  | "damage";
export type SectionType =
  | "hero"
  | "featured_products"
  | "featured_brands"
  | "collections"
  | "banner"
  | "reviews"
  | "new_arrivals"
  | "best_sellers"
  | "custom";

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  parent_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_featured: boolean;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: number | null;
  compare_at_price: number | null;
  stock_quantity: number;
  attributes: Record<string, string>;
  is_active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  brand_id: string | null;
  category_id: string | null;
  subcategory_id: string | null;
  sku: string;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  is_available: boolean;
  average_rating: number;
  review_count: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string[] | null;
  is_featured: boolean;
  is_best_seller: boolean;
  is_new_arrival: boolean;
  is_on_sale: boolean;
  status: ProductStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  brand?: Brand | null;
  category?: Category | null;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface CartItem {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number | null;
  quantity: number;
  imageUrl?: string;
  maxQuantity: number;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string | null;
  guest_name: string;
  guest_phone: string;
  guest_address: string;
  subtotal: number;
  discount_amount: number;
  total_amount: number;
  coupon_id: string | null;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  payment_reference: string | null;
  status: OrderStatus;
  internal_notes: string | null;
  tracking_token: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface Customer {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  phone: string;
  email: string | null;
  segment: CustomerSegment;
  total_orders: number;
  total_spent: number;
  last_order_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  customer_id: string | null;
  reviewer_name: string;
  rating: number;
  title: string | null;
  content: string | null;
  status: ReviewStatus;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  description: string | null;
}

export interface AdminUser {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  role_id: string;
  is_active: boolean;
  last_login_at: string | null;
  two_factor_enabled: boolean;
  created_at: string;
  updated_at: string;
  role?: Role;
  permissions?: string[];
}

export interface Discount {
  id: string;
  name: string;
  type: DiscountType;
  value: number;
  applies_to: DiscountScope;
  target_id: string | null;
  starts_at: string | null;
  ends_at: string | null;
  is_active: boolean;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_id: string | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  discount?: Discount;
}

export interface PromotionalBanner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string | null;
  link_url: string | null;
  placement: string;
  sort_order: number;
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

export interface HomepageSection {
  id: string;
  section_type: SectionType;
  title: string | null;
  config: Record<string, unknown>;
  sort_order: number;
  is_enabled: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface StoreSetting {
  key: string;
  value: unknown;
  updated_at: string;
  updated_by: string | null;
}

export interface InventoryLog {
  id: string;
  product_id: string;
  variant_id: string | null;
  previous_quantity: number;
  new_quantity: number;
  change_amount: number;
  reason: InventoryReason;
  admin_user_id: string | null;
  note: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  admin_user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface LoginHistoryEntry {
  id: string;
  admin_user_id: string | null;
  email: string | null;
  success: boolean;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface ProductFilters {
  brandId?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  onSale?: boolean;
  status?: ProductStatus;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
