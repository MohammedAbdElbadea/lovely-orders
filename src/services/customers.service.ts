import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_CUSTOMERS } from "@/lib/demo-data";
import type { Customer, CustomerSegment, PaginatedResult } from "@/types/domain.types";

export async function getCustomers(options?: {
  segment?: CustomerSegment;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResult<Customer>> {
  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;

  if (!isSupabaseConfigured()) {
    let customers = [...DEMO_CUSTOMERS];
    if (options?.segment) {
      customers = customers.filter((c) => c.segment === options.segment);
    }
    return {
      data: customers.slice(offset, offset + limit),
      total: customers.length,
      limit,
      offset,
    };
  }

  const supabase = await createClient();
  let query = supabase
    .from("customers")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (options?.segment) query = query.eq("segment", options.segment);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: (data ?? []) as Customer[],
    total: count ?? 0,
    limit,
    offset,
  };
}

export async function getCustomerById(id: string): Promise<Customer | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_CUSTOMERS.find((c) => c.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Customer;
}

export async function updateSegment(
  id: string,
  segment: CustomerSegment
): Promise<Customer> {
  if (!isSupabaseConfigured()) {
    const customer = DEMO_CUSTOMERS.find((c) => c.id === id);
    if (!customer) throw new Error("Customer not found");
    customer.segment = segment;
    customer.updated_at = new Date().toISOString();
    return customer;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("customers")
    .update({ segment })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Customer;
}
