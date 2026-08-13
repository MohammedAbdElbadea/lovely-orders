import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_BRANDS, DEMO_CATEGORIES, DEMO_CUSTOMERS } from "@/lib/demo-data";
import type { Brand, Category, PaginatedResult, Customer, Order } from "@/types/domain.types";
import type { CustomersRow, OrdersRow, CustomerNotesRow, AdminUsersRow } from "@/types/database.types";

export async function getBrands(): Promise<Brand[]> {
  if (!isSupabaseConfigured()) return DEMO_BRANDS;

  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as Brand[];
}

export async function getBrandById(id: string): Promise<Brand | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_BRANDS.find((b) => b.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase.from("brands").select("*").eq("id", id).single();
  return data as Brand | null;
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return DEMO_CATEGORIES;

  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as Category[];
}

export async function getCustomers(
  search?: string,
  limit = 20,
  offset = 0
): Promise<PaginatedResult<Customer>> {
  if (!isSupabaseConfigured()) {
    let results = [...DEMO_CUSTOMERS];
    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        (c) =>
          c.full_name.toLowerCase().includes(q) ||
          c.phone.includes(q) ||
          (c.email && c.email.toLowerCase().includes(q))
      );
    }
    return {
      data: results.slice(offset, offset + limit),
      total: results.length,
      limit,
      offset,
    };
  }

  const supabase = await createClient();
  let query = supabase.from("customers").select("*", { count: "exact" });

  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,phone.ilike.%${search}%,email.ilike.%${search}%`
    );
  }

  const { data, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  return {
    data: (data ?? []) as Customer[],
    total: count ?? 0,
    limit,
    offset,
  };
}

type CustomerNoteWithAdmin = CustomerNotesRow & {
  admin: Pick<AdminUsersRow, "full_name"> | null;
};

export async function getCustomerById(id: string) {
  if (!isSupabaseConfigured()) {
    return {
      id,
      auth_user_id: "a0000000-0000-0000-0000-000000000001",
      full_name: "سارة أحمد",
      phone: "01012345678",
      email: "sara@example.com",
      segment: "high_value",
      total_orders: 5,
      total_spent: 4200,
      last_order_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      orders: [],
      notes: [],
    };
  }

  const supabase = await createClient();
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (!customer) return null;

  const customerData = customer as CustomersRow;

  const [{ data: orders }, { data: notes }] = await Promise.all([
    supabase
      .from("orders")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("customer_notes")
      .select("*, admin:admin_users(full_name)")
      .eq("customer_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return {
    ...customerData,
    orders: (orders ?? []) as OrdersRow[],
    notes: (notes ?? []) as CustomerNoteWithAdmin[],
  };
}

