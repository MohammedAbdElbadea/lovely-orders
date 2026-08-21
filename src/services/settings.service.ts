import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured, PAYMENT_NUMBER } from "@/lib/constants";
import { DEMO_STORE_SETTINGS } from "@/lib/demo-data";
import type { StoreSetting } from "@/types/domain.types";

export interface PaymentSettings {
  vodafoneNumber: string;
  instapayNumber: string;
}

export async function getSetting(key: string): Promise<unknown | null> {
  if (!isSupabaseConfigured()) {
    const setting = DEMO_STORE_SETTINGS.find((s) => s.key === key);
    return setting?.value ?? null;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("store_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error || !data) return null;
  return data?.value ?? null;
}

export async function updateSetting(
  key: string,
  value: unknown,
  updatedBy?: string
): Promise<StoreSetting> {
  if (!isSupabaseConfigured()) {
    const existing = DEMO_STORE_SETTINGS.find((s) => s.key === key);
    if (existing) {
      existing.value = value;
      existing.updated_at = new Date().toISOString();
      existing.updated_by = updatedBy ?? null;
      return existing;
    }
    const setting: StoreSetting = {
      key,
      value,
      updated_at: new Date().toISOString(),
      updated_by: updatedBy ?? null,
    };
    DEMO_STORE_SETTINGS.push(setting);
    return setting;
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("store_settings")
    .upsert({ key, value: value as import("@/types/database.types").Json, updated_by: updatedBy ?? null })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as StoreSetting;
}

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const [vodafone, instapay] = await Promise.all([
    getSetting("payment_vodafone_cash_number"),
    getSetting("payment_instapay_number"),
  ]);

  return {
    vodafoneNumber: (vodafone as string) || PAYMENT_NUMBER,
    instapayNumber: (instapay as string) || PAYMENT_NUMBER,
  };
}

export async function getAllSettings(): Promise<StoreSetting[]> {
  if (!isSupabaseConfigured()) {
    return [...DEMO_STORE_SETTINGS];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("store_settings").select("*");

  if (error) throw new Error(error.message);
  return (data ?? []) as StoreSetting[];
}
