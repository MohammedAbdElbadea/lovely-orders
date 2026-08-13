import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/constants";
import type { Customer } from "@/types/domain.types";

export interface CustomerAuthResult {
  success: boolean;
  error?: string;
  customer?: Customer;
}

export async function registerCustomer(input: {
  fullName: string;
  phone: string;
  email: string;
  password?: string;
}): Promise<CustomerAuthResult> {
  if (!isSupabaseConfigured()) {
    const mockCustomer: Customer = {
      id: crypto.randomUUID(),
      auth_user_id: crypto.randomUUID(),
      full_name: input.fullName,
      phone: input.phone,
      email: input.email,
      segment: "new",
      total_orders: 0,
      total_spent: 0,
      last_order_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return { success: true, customer: mockCustomer };
  }

  try {
    const supabase = await createClient();
    const admin = createAdminClient();

    // 1. Check if customer with phone or email already exists to prevent duplicate error
    const { data: existingCustomer } = await admin
      .from("customers")
      .select("*")
      .or(`phone.eq.${input.phone},email.eq.${input.email}`)
      .maybeSingle();

    if (existingCustomer) {
      return {
        success: false,
        error: "حساب العميل المسجل بهذا الهاتف أو البريد الإلكتروني موجود بالفعل",
      };
    }

    let authUserId: string | null = null;

    if (input.password) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
            phone: input.phone,
          },
        },
      });

      if (authError) {
        return { success: false, error: authError.message };
      }
      authUserId = authData.user?.id ?? null;
    }

    // 2. Insert into customer table safely
    const { data: customer, error: customerError } = await admin
      .from("customers")
      .insert({
        auth_user_id: authUserId,
        full_name: input.fullName,
        phone: input.phone,
        email: input.email,
        segment: "new",
      })
      .select("*")
      .single();

    if (customerError) {
      return { success: false, error: customerError.message };
    }

    return { success: true, customer: customer as Customer };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "حدث خطأ أثناء إنشاء الحساب";
    return { success: false, error: msg };
  }
}

export async function loginCustomer(input: {
  email: string;
  password?: string;
}): Promise<CustomerAuthResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: true,
      customer: {
        id: "demo-cust-1",
        auth_user_id: "demo-auth-1",
        full_name: "عميل ممتاز",
        phone: input.email,
        email: input.email,
        segment: "new",
        total_orders: 1,
        total_spent: 250,
        last_order_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
  }

  try {
    const supabase = await createClient();
    const admin = createAdminClient();

    if (input.password) {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: input.email,
          password: input.password,
        });

      if (authError) {
        return { success: false, error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" };
      }

      const { data: customer } = await admin
        .from("customers")
        .select("*")
        .eq("auth_user_id", authData.user.id)
        .maybeSingle();

      return {
        success: true,
        customer: (customer as Customer) ?? undefined,
      };
    }

    // Lookup customer by email/phone directly
    const { data: customer } = await admin
      .from("customers")
      .select("*")
      .or(`email.eq.${input.email},phone.eq.${input.email}`)
      .maybeSingle();

    if (!customer) {
      return { success: false, error: "لم يتم العثور على حساب بهذا البريد أو الهاتف" };
    }

    return { success: true, customer: customer as Customer };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "حدث خطأ أثناء تسجيل الدخول";
    return { success: false, error: msg };
  }
}

export async function getCurrentCustomer(): Promise<Customer | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const admin = createAdminClient();
    const { data: customer } = await admin
      .from("customers")
      .select("*")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    return (customer as Customer) ?? null;
  } catch {
    return null;
  }
}
