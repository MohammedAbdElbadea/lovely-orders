import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

let adminClient: ReturnType<typeof createClient<Database>> | null = null;

function getAdminEnv() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";

  return { url, serviceRoleKey };
}

export function createAdminClient() {
  if (adminClient) {
    return adminClient;
  }

  const { url, serviceRoleKey } = getAdminEnv();

  adminClient = createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
