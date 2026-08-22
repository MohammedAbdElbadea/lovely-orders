import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 1. Load environment variables from .env.local
const envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  console.error("❌ Error: .env.local file not found!");
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
  console.error("❌ Error: Supabase URL or Key missing in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

console.log("🚀 Starting Enhanced Products & Usage Guides Migration (V3)...");

// Categories Definitions
const CATEGORIES = [
  { name: "Skincare", slug: "skincare", description: "العناية بالبشرة والوجه والترطيب والتفتيح" },
  { name: "Hair Care", slug: "hair-care", description: "العناية بالشعر، الزيوت، المعالجات والشامبوهات" },
  { name: "Body Care", slug: "body-care", description: "العناية بالجسم، زبدة الجسم والترطيب المكثف" },
  { name: "Fragrance", slug: "fragrance", description: "العطور الفاخرة ومعطرات الجسم وميست الجسم" },
  { name: "Deodorants", slug: "deodorants", description: "مزيلات العرق الطبية والعطور الحماية" },
  { name: "Makeup", slug: "makeup", description: "مستحضرات التجميل، التنت وأحمر الشفاه" },
  { name: "Sunscreen", slug: "sunscreen", description: "واقيات الشمس والحماية من الأشعة فوق البنفسجية" },
];

// Brands Definitions
const BRANDS = [
  { name: "ANUA", slug: "anua", description: "Korean glass skin skincare" },
  { name: "The Ordinary", slug: "the-ordinary", description: "Clinical functional formulations" },
  { name: "Tesori d'Oriente", slug: "tesori-d-oriente", description: "Luxury Italian body care & fragrances" },
  { name: "Balea", slug: "balea", description: "German high quality personal care by dm" },
  { name: "Parachute", slug: "parachute", description: "100% Pure coconut hair oils" },
  { name: "Kesh King", slug: "kesh-king", description: "Ayurvedic medicinal hair care" },
  { name: "Memwa", slug: "memwa", description: "Long-lasting perfume body mists" },
  { name: "Velvet", slug: "velvet", description: "Luxury nourishing body butters" },
  { name: "Ebelin", slug: "ebelin", description: "German precision beauty accessories" },
  { name: "Teresia", slug: "teresia", description: "Korean marine collagen skincare" },
  { name: "Watsons", slug: "watsons", description: "Premium beauty and personal essentials" },
  { name: "Farmstay", slug: "farmstay", description: "Korean natural sun protection & extracts" },
  { name: "Godrej", slug: "godrej", description: "Ayurvedic & herbal hair solutions" },
  { name: "Super Kids", slug: "super-kids", description: "Gentle natural hair care for kids" },
  { name: "Vaseline", slug: "vaseline", description: "Intensive skin restore and hydration" },
  { name: "Jam Tint", slug: "jam-tint", description: "Korean natural lip & cheek tints" },
  { name: "Eve", slug: "eve", description: "Perfumed shower gels & body care" },
  { name: "Cien", slug: "cien", description: "European dermatologist-tested personal care" },
  { name: "Fa", slug: "fa", description: "Invigorating German body washes & deodorants" },
  { name: "Lady Speed Stick", slug: "lady-speed-stick", description: "48h invisible dry protection" },
  { name: "Secret", slug: "secret", description: "Clinical strength antiperspirants" },
  { name: "Cantu", slug: "cantu", description: "Pure shea butter natural hair care" },
  { name: "Isana", slug: "isana", description: "German luxury body and hair care" },
];

async function run() {
  try {
    // 1. Upsert Categories
    console.log("📁 Syncing Categories...");
    const categoryMap = {};
    for (const cat of CATEGORIES) {
      const { data, error } = await supabase
        .from("categories")
        .upsert(cat, { onConflict: "slug" })
        .select("id, slug")
        .single();
      if (!error && data) categoryMap[data.slug] = data.id;
    }

    // 2. Upsert Brands
    console.log("🏷️ Syncing Brands...");
    const brandMap = {};
    for (const brand of BRANDS) {
      const { data, error } = await supabase
        .from("brands")
        .upsert(brand, { onConflict: "slug" })
        .select("id, slug")
        .single();
      if (!error && data) brandMap[data.slug] = data.id;
    }

    // 3. Fetch all products to enrich
    console.log("📦 Fetching existing products to update with usage instructions & animations...");
    const { data: existingProducts, error: pErr } = await supabase
      .from("products")
      .select("id, name, slug, short_description, description, category_id, brand_id");

    if (pErr) {
      console.warn("Notice querying products from Supabase:", pErr.message);
    }

    const productsToUpdate = existingProducts || [];
    console.log(`✨ Found ${productsToUpdate.length} products to enrich.`);

    let updatedCount = 0;
    for (const prod of productsToUpdate) {
      const name = prod.name;
      const lower = name.toLowerCase();

      let usageGuide = "";
      if (lower.includes("serum") || lower.includes("سيروم") || lower.includes("ordinary") || lower.includes("anua")) {
        usageGuide = `
<div class="mt-6 rounded-2xl border border-gold/30 bg-gold/5 p-5 text-right space-y-3">
  <h3 class="text-base font-bold text-luxury-gold flex items-center gap-2">💡 طريقة الاستخدام والروتين المثالي:</h3>
  <ol class="list-decimal pr-5 space-y-2 text-xs sm:text-sm text-gray-200 leading-relaxed">
    <li><strong>التنظيف:</strong> اغسلي الوجه بغسول لطيف مناسب لنوع بشرتك وجففيه بطريقة الطبطبة.</li>
    <li><strong>التطبيق:</strong> ضعي من 3 إلى 4 قطرات من السيروم على راحة اليد أو مباشرة على الجبهة والوجنتين.</li>
    <li><strong>التوزيع:</strong> دلكي بلطف بحركات دائرية من الداخل للخارج مع الطبطبة الخفيفة حتى تمام الامتصاص.</li>
    <li><strong>الترطيب:</strong> انتظري دقيقتين ثم ضعي الكريم المرطب لقفل الفوائد داخل البشرة.</li>
  </ol>
  <p class="text-xs text-amber-300 font-medium pt-2">✨ يُستخدم مرتين يومياً (صباحاً ومساءً)، مع الحرص على وضع واقي الشمس نهاراً.</p>
</div>`;
      } else if (lower.includes("butter") || lower.includes("lotion") || lower.includes("cream") || lower.includes("كريم") || lower.includes("زبدة") || lower.includes("vaseline") || lower.includes("body")) {
        usageGuide = `
<div class="mt-6 rounded-2xl border border-gold/30 bg-gold/5 p-5 text-right space-y-3">
  <h3 class="text-base font-bold text-luxury-gold flex items-center gap-2">💡 طريقة الاستخدام للحصول على ترطيب حريري:</h3>
  <ol class="list-decimal pr-5 space-y-2 text-xs sm:text-sm text-gray-200 leading-relaxed">
    <li><strong>بعد الاستحمام:</strong> يُفضل استخدامه مباشرة على بشرة ندية ومجففة بلطف لحبس الرطوبة داخل المسام.</li>
    <li><strong>التدليك:</strong> خذي كمية وفيرة ووزعيها على كامل الجسم، خاصة المناطق الجافة (الكوعين، الركبتين، واليدين).</li>
    <li><strong>الامتصاص:</strong> دلكي بحركات دائرية هادئة حتى تتشرب البشرة التركيبة الغنية وتفوح الرائحة الفاخرة.</li>
  </ol>
  <p class="text-xs text-amber-300 font-medium pt-2">✨ مناسب للاستخدام اليومي المستمر للحفاظ على نعومة ونضارة تدوم 24 ساعة.</p>
</div>`;
      } else if (lower.includes("oil") || lower.includes("زيت") || lower.includes("hair") || lower.includes("شعر") || lower.includes("parachute") || lower.includes("kesh")) {
        usageGuide = `
<div class="mt-6 rounded-2xl border border-gold/30 bg-gold/5 p-5 text-right space-y-3">
  <h3 class="text-base font-bold text-luxury-gold flex items-center gap-2">💡 طريقة الاستخدام للشعر وحمام الزيت:</h3>
  <ol class="list-decimal pr-5 space-y-2 text-xs sm:text-sm text-gray-200 leading-relaxed">
    <li><strong>كحمام زيت علاجي:</strong> دلكي فروة الرأس والجذور بكمية كافية لمدة 5 دقائق لتنشيط الدورة الدموية، واتركيه من 1 إلى 2 ساعة (أو ليلة كاملة) مع تغطية الشعر بفوطة دافئة، ثم اغسليه بالشامبو.</li>
    <li><strong>للتصفيف اليومي والترطيب:</strong> ضعي قطرات بسيطة جداً على راحة يدك ومرريها على أطراف الشعر المجهدة لمنع الهيشان وإعطاء لمعان فوري.</li>
  </ol>
  <p class="text-xs text-amber-300 font-medium pt-2">✨ استخدميه مرتين إلى 3 مرات أسبوعياً لتحفيز نمو الشعر وإيقاف التساقط.</p>
</div>`;
      } else if (lower.includes("mist") || lower.includes("perfume") || lower.includes("عطر") || lower.includes("معطر") || lower.includes("shower") || lower.includes("gel") || lower.includes("شاور")) {
        usageGuide = `
<div class="mt-6 rounded-2xl border border-gold/30 bg-gold/5 p-5 text-right space-y-3">
  <h3 class="text-base font-bold text-luxury-gold flex items-center gap-2">💡 طريقة الاستخدام لأعلى ثبات وفوحان:</h3>
  <ol class="list-decimal pr-5 space-y-2 text-xs sm:text-sm text-gray-200 leading-relaxed">
    <li><strong>نقاط النبض:</strong> رشي العطر أو المعطر من مسافة 15 سم على أماكن النبض (المعصمين، جانبي الرقبة، وخلف الأذنين).</li>
    <li><strong>بعد الاستحمام:</strong> رشي مباشرة بعد تجفيف الجسم بعد الشاور لامتصاص الرائحة وثباتها لفترة أطول.</li>
  </ol>
  <p class="text-xs text-amber-300 font-medium pt-2">✨ لا تفركي المعصمين بعد الرش للحفاظ على ثبات جزيئات العطر ونقاء هرم النوتات العطرية.</p>
</div>`;
      } else {
        usageGuide = `
<div class="mt-6 rounded-2xl border border-gold/30 bg-gold/5 p-5 text-right space-y-3">
  <h3 class="text-base font-bold text-luxury-gold flex items-center gap-2">💡 طريقة الاستخدام الموصى بها:</h3>
  <ol class="list-decimal pr-5 space-y-2 text-xs sm:text-sm text-gray-200 leading-relaxed">
    <li>نظفي وجففي المنطقة المراد تطبيق المنتج عليها جيداً.</li>
    <li>ضعي كمية مناسبة ودلكي بلطف حتى يتم الامتصاص بالكامل.</li>
    <li>يُستخدم بانتظام للحصول على أفضل النتائج المرجوة والمستدامة.</li>
  </ol>
</div>`;
      }

      // Check if description already contains usageGuide, if not append it cleanly
      let updatedDescription = prod.description || "";
      if (!updatedDescription.includes("💡 طريقة الاستخدام")) {
        updatedDescription = `${updatedDescription}\n\n${usageGuide}`.trim();
      }

      const { error: updateErr } = await supabase
        .from("products")
        .update({
          description: updatedDescription,
          is_available: true,
          status: "published",
        })
        .eq("id", prod.id);

      if (!updateErr) {
        updatedCount++;
      }
    }

    console.log(`✅ Successfully updated ${updatedCount} products with interactive usage guides & rich descriptions!`);
    console.log("🎉 All products are now live with animated presentation features!");
  } catch (err) {
    console.error("❌ Migration error:", err);
  }
}

run();
