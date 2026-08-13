import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/rbac";
import type { AdminUser } from "@/types/domain.types";
import type { User } from "@supabase/supabase-js";

export interface SessionResult {
  user: User | null;
}

export interface AdminSessionResult extends SessionResult {
  adminUser: AdminUser | null;
}

export async function getSession(): Promise<SessionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return {
    user: user ?? null,
  };
}

export async function getAdminSession(): Promise<AdminSessionResult> {
  const { user } = await getSession();

  if (!user) {
    return { user: null, adminUser: null };
  }

  const adminUser = await getAdminUser(user.id);

  return { user, adminUser };
}

export async function signOutAdmin(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
