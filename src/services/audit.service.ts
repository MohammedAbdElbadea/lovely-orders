import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/constants";
import { DEMO_AUDIT_LOGS } from "@/lib/demo-data";
import type { AuditLog, LoginHistoryEntry, PaginatedResult } from "@/types/domain.types";

export interface LogAuditInput {
  adminUserId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

export interface LogLoginInput {
  adminUserId?: string;
  email?: string;
  success: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAudit(input: LogAuditInput): Promise<AuditLog> {
  if (!isSupabaseConfigured()) {
    const entry: AuditLog = {
      id: crypto.randomUUID(),
      admin_user_id: input.adminUserId ?? null,
      action: input.action,
      entity_type: input.entityType ?? null,
      entity_id: input.entityId ?? null,
      old_values: input.oldValues ?? null,
      new_values: input.newValues ?? null,
      ip_address: input.ipAddress ?? null,
      user_agent: input.userAgent ?? null,
      created_at: new Date().toISOString(),
    };
    DEMO_AUDIT_LOGS.unshift(entry);
    return entry;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("audit_logs")
    .insert({
      admin_user_id: input.adminUserId ?? null,
      action: input.action,
      entity_type: input.entityType,
      entity_id: input.entityId,
      old_values: input.oldValues,
      new_values: input.newValues,
      ip_address: input.ipAddress,
      user_agent: input.userAgent,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as AuditLog;
}

export async function getAuditLogs(options?: {
  adminUserId?: string;
  entityType?: string;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResult<AuditLog>> {
  const limit = options?.limit ?? 50;
  const offset = options?.offset ?? 0;

  if (!isSupabaseConfigured()) {
    let logs = [...DEMO_AUDIT_LOGS];
    if (options?.adminUserId) {
      logs = logs.filter((l) => l.admin_user_id === options.adminUserId);
    }
    if (options?.entityType) {
      logs = logs.filter((l) => l.entity_type === options.entityType);
    }
    return {
      data: logs.slice(offset, offset + limit),
      total: logs.length,
      limit,
      offset,
    };
  }

  const supabase = await createClient();
  let query = supabase
    .from("audit_logs")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (options?.adminUserId) query = query.eq("admin_user_id", options.adminUserId);
  if (options?.entityType) query = query.eq("entity_type", options.entityType);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: (data ?? []) as AuditLog[],
    total: count ?? 0,
    limit,
    offset,
  };
}

export async function logLogin(input: LogLoginInput): Promise<LoginHistoryEntry> {
  if (!isSupabaseConfigured()) {
    return {
      id: crypto.randomUUID(),
      admin_user_id: input.adminUserId ?? null,
      email: input.email ?? null,
      success: input.success,
      ip_address: input.ipAddress ?? null,
      user_agent: input.userAgent ?? null,
      created_at: new Date().toISOString(),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("login_history")
    .insert({
      admin_user_id: input.adminUserId ?? null,
      email: input.email,
      success: input.success,
      ip_address: input.ipAddress,
      user_agent: input.userAgent,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as LoginHistoryEntry;
}
