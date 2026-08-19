"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminSession } from "@/lib/rbac/server-auth";
import { ROUTES } from "@/lib/constants";
import { actionError, type ActionResult } from "@/lib/actions/types";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function loginAction(
  formData: FormData
): Promise<ActionResult | void> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return actionError(parsed.error.errors[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  const adminClient = createAdminClient();

  if (error || !data.user) {
    try {
      await adminClient.from("login_history").insert({
        email: parsed.data.email,
        success: false,
      });
    } catch {
      // Ignore logging error on failed login
    }
    return actionError(error?.message ?? "Login failed");
  }

  const { data: admin } = await adminClient
    .from("admin_users")
    .select("id")
    .eq("auth_user_id", data.user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!admin) {
    await supabase.auth.signOut();
    return actionError("You do not have admin access. Make sure your user is added to admin_users table with is_active = true.");
  }

  try {
    await adminClient
      .from("admin_users")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", admin.id);

    await adminClient.from("login_history").insert({
      admin_user_id: admin.id,
      email: parsed.data.email,
      success: true,
    });
  } catch (err) {
    console.warn("Login history recording notice:", err);
  }

  redirect(ROUTES.ADMIN + "/dashboard");
}

export async function logoutAction(): Promise<void> {
  const session = await getAdminSession();
  const supabase = await createClient();
  await supabase.auth.signOut();

  if (session) {
    await supabase.from("audit_logs").insert({
      admin_user_id: session.admin.id,
      action: "logout",
      entity_type: "admin_user",
      entity_id: session.admin.id,
    });
  }

  redirect(ROUTES.ADMIN_LOGIN);
}
