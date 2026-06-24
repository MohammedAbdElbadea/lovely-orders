import { createClient } from "@/lib/supabase/server";
import type { Brand, Category, PaginatedResult, Customer } from "@/types/domain.types";

export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data ?? []) as Brand[];
}

export async function getBrandById(id: string): Promise<Brand | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("brands").select("*").eq("id", id).single();
  return data as Brand | null;
}

export async function getCategories(): Promise<Category[]> {
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

export async function getCustomerById(id: string) {
  const supabase = await createClient();
  const { data: customer } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (!customer) return null;

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

  return { ...customer, orders: orders ?? [], notes: notes ?? [] };
}
