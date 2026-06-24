import { createClient } from "@/lib/supabase/server";
import { getAdminUser } from "@/lib/auth/rbac";
import type { AdminUser } from "@/types/domain.types";
import type { Session, User } from "@supabase/supabase-js";

export interface SessionResult {
  session: Session | null;
  user: User | null;
}

export interface AdminSessionResult extends SessionResult {
  adminUser: AdminUser | null;
}

export async function getSession(): Promise<SessionResult> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return {
    session,
    user: session?.user ?? null,
  };
}

export async function getAdminSession(): Promise<AdminSessionResult> {
  const { session, user } = await getSession();

  if (!user) {
    return { session: null, user: null, adminUser: null };
  }

  const adminUser = await getAdminUser(user.id);

  return { session, user, adminUser };
}

export async function signOutAdmin(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
