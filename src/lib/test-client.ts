import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export const supabase = createClient<Database>("https://test.supabase.co", "test-key");

async function test() {
  const { error } = await supabase.from("brands").insert({
    name: "test",
    slug: "test"
  });
}
