export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type GenericRelationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type DefaultRelationships = GenericRelationship[];


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
export type DiscountScope = "all" | "product" | "category" | "brand" | "collection";
export type ContentStatus = "draft" | "scheduled" | "active" | "expired";
export type CustomerSegment = "new" | "returning" | "high_value" | "inactive";
export type InventoryReason = "sale" | "restock" | "adjustment" | "return" | "damage";
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

export type ProductsRow = {
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
};

export type ProductsInsert = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  short_description?: string | null;
  brand_id?: string | null;
  category_id?: string | null;
  subcategory_id?: string | null;
  sku: string;
  price: number;
  compare_at_price?: number | null;
  stock_quantity?: number;
  low_stock_threshold?: number;
  is_available?: boolean;
  average_rating?: number;
  review_count?: number;
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string[] | null;
  is_featured?: boolean;
  is_best_seller?: boolean;
  is_new_arrival?: boolean;
  is_on_sale?: boolean;
  status?: ProductStatus;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ProductsUpdate = Partial<ProductsInsert>;

export type ProductImagesRow = {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
};

export type ProductImagesInsert = {
  id?: string;
  product_id: string;
  url: string;
  alt_text?: string | null;
  sort_order?: number;
  is_primary?: boolean;
  created_at?: string;
};

export type ProductImagesUpdate = Partial<ProductImagesInsert>;

export type ProductVariantsRow = {
  id: string;
  product_id: string;
  name: string;
  sku: string | null;
  price: number | null;
  compare_at_price: number | null;
  stock_quantity: number;
  attributes: Json;
  is_active: boolean;
  created_at: string;
};

export type ProductVariantsInsert = {
  id?: string;
  product_id: string;
  name: string;
  sku?: string | null;
  price?: number | null;
  compare_at_price?: number | null;
  stock_quantity?: number;
  attributes?: Json;
  is_active?: boolean;
  created_at?: string;
};

export type ProductVariantsUpdate = Partial<ProductVariantsInsert>;

export type BrandsRow = {
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
};

export type BrandsInsert = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  logo_url?: string | null;
  banner_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  is_active?: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
};

export type BrandsUpdate = Partial<BrandsInsert>;

export type CategoriesRow = {
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
};

export type CategoriesInsert = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CategoriesUpdate = Partial<CategoriesInsert>;

export type CollectionsRow = {
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
};

export type CollectionsInsert = {
  id?: string;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  is_featured?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
  sort_order?: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type CollectionsUpdate = Partial<CollectionsInsert>;

export type TagsRow = {
  id: string;
  name: string;
  slug: string;
};

export type TagsInsert = {
  id?: string;
  name: string;
  slug: string;
};

export type TagsUpdate = Partial<TagsInsert>;

export type ProductCollectionsRow = {
  product_id: string;
  collection_id: string;
};

export type ProductCollectionsInsert = ProductCollectionsRow;
export type ProductCollectionsUpdate = Partial<ProductCollectionsRow>;

export type ProductTagsRow = {
  product_id: string;
  tag_id: string;
};

export type ProductTagsInsert = ProductTagsRow;
export type ProductTagsUpdate = Partial<ProductTagsRow>;

export type ReviewsRow = {
  id: string;
  product_id: string;
  customer_id: string | null;
  reviewer_name: string;
  rating: number;
  title: string | null;
  content: string | null;
  status: ReviewStatus;
  created_at: string;
};

export type ReviewsInsert = {
  id?: string;
  product_id: string;
  customer_id?: string | null;
  reviewer_name: string;
  rating: number;
  title?: string | null;
  content?: string | null;
  status?: ReviewStatus;
  created_at?: string;
};

export type ReviewsUpdate = Partial<ReviewsInsert>;

export type PagesRow = {
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
};

export type PagesInsert = {
  id?: string;
  title: string;
  slug: string;
  content?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  status?: ContentStatus;
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type PagesUpdate = Partial<PagesInsert>;

export type HomepageSectionsRow = {
  id: string;
  section_type: SectionType;
  title: string | null;
  config: Json;
  sort_order: number;
  is_enabled: boolean;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type HomepageSectionsInsert = {
  id?: string;
  section_type: SectionType;
  title?: string | null;
  config?: Json;
  sort_order?: number;
  is_enabled?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type HomepageSectionsUpdate = Partial<HomepageSectionsInsert>;

export type OrdersRow = {
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
};

export type OrdersInsert = {
  id?: string;
  order_number?: string;
  customer_id?: string | null;
  guest_name: string;
  guest_phone: string;
  guest_address: string;
  subtotal: number;
  discount_amount?: number;
  total_amount: number;
  coupon_id?: string | null;
  payment_method: PaymentMethod;
  payment_status?: PaymentStatus;
  payment_reference?: string | null;
  status?: OrderStatus;
  internal_notes?: string | null;
  tracking_token: string;
  created_at?: string;
  updated_at?: string;
};

export type OrdersUpdate = Partial<OrdersInsert>;

export type OrderItemsRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type OrderItemsInsert = {
  id?: string;
  order_id: string;
  product_id?: string | null;
  variant_id?: string | null;
  product_name: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  total_price: number;
};

export type OrderItemsUpdate = Partial<OrderItemsInsert>;

export type OrderStatusHistoryRow = {
  id: string;
  order_id: string;
  previous_status: OrderStatus | null;
  new_status: OrderStatus;
  changed_by: string | null;
  note: string | null;
  created_at: string;
};

export type OrderStatusHistoryInsert = {
  id?: string;
  order_id: string;
  previous_status?: OrderStatus | null;
  new_status: OrderStatus;
  changed_by?: string | null;
  note?: string | null;
  created_at?: string;
};

export type OrderStatusHistoryUpdate = Partial<OrderStatusHistoryInsert>;

export type AdminUsersRow = {
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
};

export type AdminUsersInsert = {
  id?: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  role_id: string;
  is_active?: boolean;
  last_login_at?: string | null;
  two_factor_enabled?: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AdminUsersUpdate = Partial<AdminUsersInsert>;

export type RolesRow = {
  id: string;
  name: string;
  description: string | null;
  is_system: boolean;
  created_at: string;
};

export type RolesInsert = {
  id?: string;
  name: string;
  description?: string | null;
  is_system?: boolean;
  created_at?: string;
};

export type RolesUpdate = Partial<RolesInsert>;

export type PermissionsRow = {
  id: string;
  name: string;
  module: string;
  description: string | null;
};

export type PermissionsInsert = {
  id?: string;
  name: string;
  module: string;
  description?: string | null;
};

export type PermissionsUpdate = Partial<PermissionsInsert>;

export type RolePermissionsRow = {
  role_id: string;
  permission_id: string;
};

export type RolePermissionsInsert = RolePermissionsRow;
export type RolePermissionsUpdate = Partial<RolePermissionsRow>;

export type CustomersRow = {
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
};

export type CustomersInsert = {
  id?: string;
  auth_user_id?: string | null;
  full_name: string;
  phone: string;
  email?: string | null;
  segment?: CustomerSegment;
  total_orders?: number;
  total_spent?: number;
  last_order_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CustomersUpdate = Partial<CustomersInsert>;

export type CustomerAddressesRow = {
  id: string;
  customer_id: string;
  full_name: string | null;
  phone: string | null;
  address_line: string;
  city: string | null;
  is_default: boolean;
  created_at: string;
};

export type CustomerAddressesInsert = {
  id?: string;
  customer_id: string;
  full_name?: string | null;
  phone?: string | null;
  address_line: string;
  city?: string | null;
  is_default?: boolean;
  created_at?: string;
};

export type CustomerAddressesUpdate = Partial<CustomerAddressesInsert>;

export type CustomerNotesRow = {
  id: string;
  customer_id: string;
  admin_user_id: string | null;
  note: string;
  created_at: string;
};

export type CustomerNotesInsert = {
  id?: string;
  customer_id: string;
  admin_user_id?: string | null;
  note: string;
  created_at?: string;
};

export type CustomerNotesUpdate = Partial<CustomerNotesInsert>;

export type DiscountsRow = {
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
};

export type DiscountsInsert = {
  id?: string;
  name: string;
  type: DiscountType;
  value: number;
  applies_to?: DiscountScope;
  target_id?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  is_active?: boolean;
  status?: ContentStatus;
  created_at?: string;
  updated_at?: string;
};

export type DiscountsUpdate = Partial<DiscountsInsert>;

export type CouponsRow = {
  id: string;
  code: string;
  discount_id: string | null;
  usage_limit: number | null;
  usage_count: number;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
};

export type CouponsInsert = {
  id?: string;
  code: string;
  discount_id?: string | null;
  usage_limit?: number | null;
  usage_count?: number;
  is_active?: boolean;
  expires_at?: string | null;
  created_at?: string;
};

export type CouponsUpdate = Partial<CouponsInsert>;

export type CampaignsRow = {
  id: string;
  name: string;
  message: string | null;
  banner_image_url: string | null;
  link_url: string | null;
  starts_at: string | null;
  ends_at: string | null;
  status: ContentStatus;
  created_at: string;
};

export type CampaignsInsert = {
  id?: string;
  name: string;
  message?: string | null;
  banner_image_url?: string | null;
  link_url?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  status?: ContentStatus;
  created_at?: string;
};

export type CampaignsUpdate = Partial<CampaignsInsert>;

export type PromotionalBannersRow = {
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
};

export type PromotionalBannersInsert = {
  id?: string;
  title: string;
  subtitle?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  placement?: string;
  sort_order?: number;
  is_active?: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  created_at?: string;
};

export type PromotionalBannersUpdate = Partial<PromotionalBannersInsert>;

export type InventoryLogsRow = {
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
};

export type InventoryLogsInsert = {
  id?: string;
  product_id: string;
  variant_id?: string | null;
  previous_quantity: number;
  new_quantity: number;
  change_amount: number;
  reason: InventoryReason;
  admin_user_id?: string | null;
  note?: string | null;
  created_at?: string;
};

export type InventoryLogsUpdate = Partial<InventoryLogsInsert>;

export type StoreSettingsRow = {
  key: string;
  value: Json;
  updated_at: string;
  updated_by: string | null;
};

export type StoreSettingsInsert = {
  key: string;
  value?: Json;
  updated_at?: string;
  updated_by?: string | null;
};

export type StoreSettingsUpdate = Partial<StoreSettingsInsert>;

export type AuditLogsRow = {
  id: string;
  admin_user_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  old_values: Json | null;
  new_values: Json | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export type AuditLogsInsert = {
  id?: string;
  admin_user_id?: string | null;
  action: string;
  entity_type?: string | null;
  entity_id?: string | null;
  old_values?: Json | null;
  new_values?: Json | null;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
};

export type AuditLogsUpdate = Partial<AuditLogsInsert>;

export type LoginHistoryRow = {
  id: string;
  admin_user_id: string | null;
  email: string | null;
  success: boolean;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export type LoginHistoryInsert = {
  id?: string;
  admin_user_id?: string | null;
  email?: string | null;
  success: boolean;
  ip_address?: string | null;
  user_agent?: string | null;
  created_at?: string;
};

export type LoginHistoryUpdate = Partial<LoginHistoryInsert>;

export type SecurityEventsRow = {
  id: string;
  event_type: string;
  severity: string;
  details: Json;
  ip_address: string | null;
  created_at: string;
};

export type SecurityEventsInsert = {
  id?: string;
  event_type: string;
  severity?: string;
  details?: Json;
  ip_address?: string | null;
  created_at?: string;
};

export type SecurityEventsUpdate = Partial<SecurityEventsInsert>;

export type NotificationsRow = {
  id: string;
  admin_user_id: string;
  title: string;
  message: string | null;
  type: string;
  is_read: boolean;
  link_url: string | null;
  created_at: string;
};

export type NotificationsInsert = {
  id?: string;
  admin_user_id: string;
  title: string;
  message?: string | null;
  type?: string;
  is_read?: boolean;
  link_url?: string | null;
  created_at?: string;
};

export type NotificationsUpdate = Partial<NotificationsInsert>;

export type Database = {
  public: {
    Tables: {
      products: {
        Row: ProductsRow;
        Insert: ProductsInsert;
        Update: ProductsUpdate;
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey";
            columns: ["brand_id"];
            isOneToOne: false;
            referencedRelation: "brands";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      product_images: {
        Row: ProductImagesRow;
        Insert: ProductImagesInsert;
        Update: ProductImagesUpdate;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      product_variants: {
        Row: ProductVariantsRow;
        Insert: ProductVariantsInsert;
        Update: ProductVariantsUpdate;
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      brands: {
        Row: BrandsRow;
        Insert: BrandsInsert;
        Update: BrandsUpdate;
        Relationships: DefaultRelationships;
      };
      categories: {
        Row: CategoriesRow;
        Insert: CategoriesInsert;
        Update: CategoriesUpdate;
        Relationships: DefaultRelationships;
      };
      collections: {
        Row: CollectionsRow;
        Insert: CollectionsInsert;
        Update: CollectionsUpdate;
        Relationships: DefaultRelationships;
      };
      tags: {
        Row: TagsRow;
        Insert: TagsInsert;
        Update: TagsUpdate;
        Relationships: DefaultRelationships;
      };
      product_collections: {
        Row: ProductCollectionsRow;
        Insert: ProductCollectionsInsert;
        Update: ProductCollectionsUpdate;
        Relationships: DefaultRelationships;
      };
      product_tags: {
        Row: ProductTagsRow;
        Insert: ProductTagsInsert;
        Update: ProductTagsUpdate;
        Relationships: DefaultRelationships;
      };
      reviews: {
        Row: ReviewsRow;
        Insert: ReviewsInsert;
        Update: ReviewsUpdate;
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      pages: {
        Row: PagesRow;
        Insert: PagesInsert;
        Update: PagesUpdate;
        Relationships: DefaultRelationships;
      };
      homepage_sections: {
        Row: HomepageSectionsRow;
        Insert: HomepageSectionsInsert;
        Update: HomepageSectionsUpdate;
        Relationships: DefaultRelationships;
      };
      orders: {
        Row: OrdersRow;
        Insert: OrdersInsert;
        Update: OrdersUpdate;
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          }
        ];
      };
      order_items: {
        Row: OrderItemsRow;
        Insert: OrderItemsInsert;
        Update: OrderItemsUpdate;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      order_status_history: {
        Row: OrderStatusHistoryRow;
        Insert: OrderStatusHistoryInsert;
        Update: OrderStatusHistoryUpdate;
        Relationships: DefaultRelationships;
      };
      admin_users: {
        Row: AdminUsersRow;
        Insert: AdminUsersInsert;
        Update: AdminUsersUpdate;
        Relationships: [
          {
            foreignKeyName: "admin_users_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "roles";
            referencedColumns: ["id"];
          }
        ];
      };
      roles: {
        Row: RolesRow;
        Insert: RolesInsert;
        Update: RolesUpdate;
        Relationships: DefaultRelationships;
      };
      permissions: {
        Row: PermissionsRow;
        Insert: PermissionsInsert;
        Update: PermissionsUpdate;
        Relationships: DefaultRelationships;
      };
      role_permissions: {
        Row: RolePermissionsRow;
        Insert: RolePermissionsInsert;
        Update: RolePermissionsUpdate;
        Relationships: DefaultRelationships;
      };
      customers: {
        Row: CustomersRow;
        Insert: CustomersInsert;
        Update: CustomersUpdate;
        Relationships: DefaultRelationships;
      };
      customer_addresses: {
        Row: CustomerAddressesRow;
        Insert: CustomerAddressesInsert;
        Update: CustomerAddressesUpdate;
        Relationships: DefaultRelationships;
      };
      customer_notes: {
        Row: CustomerNotesRow;
        Insert: CustomerNotesInsert;
        Update: CustomerNotesUpdate;
        Relationships: [
          {
            foreignKeyName: "customer_notes_admin_user_id_fkey";
            columns: ["admin_user_id"];
            isOneToOne: false;
            referencedRelation: "admin_users";
            referencedColumns: ["id"];
          }
        ];
      };
      discounts: {
        Row: DiscountsRow;
        Insert: DiscountsInsert;
        Update: DiscountsUpdate;
        Relationships: DefaultRelationships;
      };
      coupons: {
        Row: CouponsRow;
        Insert: CouponsInsert;
        Update: CouponsUpdate;
        Relationships: [
          {
            foreignKeyName: "coupons_discount_id_fkey";
            columns: ["discount_id"];
            isOneToOne: false;
            referencedRelation: "discounts";
            referencedColumns: ["id"];
          }
        ];
      };
      campaigns: {
        Row: CampaignsRow;
        Insert: CampaignsInsert;
        Update: CampaignsUpdate;
        Relationships: DefaultRelationships;
      };
      promotional_banners: {
        Row: PromotionalBannersRow;
        Insert: PromotionalBannersInsert;
        Update: PromotionalBannersUpdate;
        Relationships: DefaultRelationships;
      };
      inventory_logs: {
        Row: InventoryLogsRow;
        Insert: InventoryLogsInsert;
        Update: InventoryLogsUpdate;
        Relationships: DefaultRelationships;
      };
      store_settings: {
        Row: StoreSettingsRow;
        Insert: StoreSettingsInsert;
        Update: StoreSettingsUpdate;
        Relationships: DefaultRelationships;
      };
      audit_logs: {
        Row: AuditLogsRow;
        Insert: AuditLogsInsert;
        Update: AuditLogsUpdate;
        Relationships: [
          {
            foreignKeyName: "audit_logs_admin_user_id_fkey";
            columns: ["admin_user_id"];
            isOneToOne: false;
            referencedRelation: "admin_users";
            referencedColumns: ["id"];
          }
        ];
      };
      login_history: {
        Row: LoginHistoryRow;
        Insert: LoginHistoryInsert;
        Update: LoginHistoryUpdate;
        Relationships: [
          {
            foreignKeyName: "login_history_admin_user_id_fkey";
            columns: ["admin_user_id"];
            isOneToOne: false;
            referencedRelation: "admin_users";
            referencedColumns: ["id"];
          }
        ];
      };
      security_events: {
        Row: SecurityEventsRow;
        Insert: SecurityEventsInsert;
        Update: SecurityEventsUpdate;
        Relationships: DefaultRelationships;
      };
      notifications: {
        Row: NotificationsRow;
        Insert: NotificationsInsert;
        Update: NotificationsUpdate;
        Relationships: DefaultRelationships;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: { Args: { user_id: string }; Returns: boolean };
      has_permission: {
        Args: { user_id: string; perm_name: string };
        Returns: boolean;
      };
      generate_order_number: { Args: Record<string, never>; Returns: string };
    };
    Enums: {
      product_status: ProductStatus;
      order_status: OrderStatus;
      payment_status: PaymentStatus;
      payment_method: PaymentMethod;
      review_status: ReviewStatus;
      discount_type: DiscountType;
      discount_scope: DiscountScope;
      content_status: ContentStatus;
      customer_segment: CustomerSegment;
      inventory_reason: InventoryReason;
      section_type: SectionType;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
