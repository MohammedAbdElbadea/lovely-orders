import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Read .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("Error: .env.local file not found!");
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};
envContent.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    let val = match[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    envVars[key] = val;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Supabase URL or Key missing in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function clearAllData() {
  console.log("🧹 Clearing products, product images, categories, and brands from Supabase...");

  // 1. Delete product images
  await supabase.from("product_images").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  // 2. Delete order items
  await supabase.from("order_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  // 3. Delete products
  const { error: pErr } = await supabase.from("products").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (pErr) console.warn("Note on products deletion:", pErr.message);

  // 4. Delete categories (reset parent_id first to avoid self-reference constraints)
  await supabase.from("categories").update({ parent_id: null }).neq("id", "00000000-0000-0000-0000-000000000000");
  const { error: cErr } = await supabase.from("categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (cErr) console.warn("Note on categories deletion:", cErr.message);

  // 5. Delete brands
  const { error: bErr } = await supabase.from("brands").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  if (bErr) console.warn("Note on brands deletion:", bErr.message);

  console.log("✨ Successfully cleared all products, categories, and brands from Supabase!");
}

clearAllData();
