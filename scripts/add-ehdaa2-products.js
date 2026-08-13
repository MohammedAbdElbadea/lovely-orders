import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// 1. Read .env.local
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

const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ehdaa2Dir = "C:\\Users\\RAMY\\Desktop\\ehdaa2";

// Mapping of 44 Hashed UUID Filenames in ehdaa2 to New Clean Product Definitions
const EHDAA2_PRODUCTS = [
  {
    origFile: "00328871-3b1d-4f37-9761-aef278c5ee3b.jpg",
    cleanFile: "tesori-d-oriente-body-butter-lotus-flower-450ml.jpg",
    name: "Tesori d'Oriente Body Butter Lotus Flower 450ml",
    slug: "tesori-d-oriente-body-butter-lotus-flower-450ml",
    sku: "TESORI-LOTUS-450ML",
    brandSlug: "tesori-d-oriente",
    brandName: "Tesori d'Oriente",
    catSlug: "body-care",
    shortDescription: "زبدة جسم إيطالية فاخرة بزهرة اللوتس لترطيب عميق وعطر شرقي ساحر يدوم طويلاً.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>زبدة الجسم الإيطالية تيزوري دي أورينت بزهرة اللوتس (Tesori d'Oriente 450ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">زبدة جسم غنية ومخملية مستوردة من إيطاليا، تعتمد على خلاصات زهرة اللوتس العطرية المغذية لتمنح بشرتك ترطيباً مكثفاً وإشراقة حريرية ورائحة ملكية تفوح طوال اليوم.</p>
  <h3 class="font-bold text-luxury-gold text-lg mt-4">✨ المميزات والفوائد:</h3>
  <ul class="list-disc pr-5 space-y-2 text-sm text-gray-300">
    <li>ترطيب عميق وحماية فائقة للبشرة الجافة شديدة الجفاف.</li>
    <li>عطر زهرة اللوتس الشرقية المستديم والثابت على الجسم والملابس.</li>
    <li>تركيبة كريمية غير دهنية تمتصها البشرة بسرعة.</li>
  </ul>
  <h3 class="font-bold text-luxury-gold text-lg mt-4">💡 طريقة الاستخدام:</h3>
  <p class="text-sm text-gray-300">وزعي كمية مناسبة على كامل الجسم بعد الاستحمام مباشرة، ودلكي بلطف حتى تذوب بالكامل في البشرة.</p>
</div>
    `.trim(),
  },
  {
    origFile: "0a6ca673-50ee-4c03-b616-a68cba815d98.jpg",
    cleanFile: "balea-plex-care-serum-50ml.jpg",
    name: "Balea Professional Plex Care Serum 50ml",
    slug: "balea-plex-care-serum-50ml",
    sku: "BALEA-PLEX-SERUM-50ML",
    brandSlug: "balea",
    brandName: "Balea",
    catSlug: "hair-care",
    shortDescription: "سيروم بليكس كير الألماني المعالج للشعر المجهد والمعالج كيميائياً وحماية الحرارة حتى 220 درجة.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>سيروم بليكس كير الألماني لحماية وترميم الشعر (Balea Plex Care Serum 50ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">سيروم محترف معزز بتكنولوجيا Intense Repair المركبة لحماية وترميم روابط الشعر التالفة كيميائياً أو بالحرارة، ويوفر حماية فائقة ضد الحرارة حتى 220°C.</p>
  <h3 class="font-bold text-luxury-gold text-lg mt-4">✨ المميزات والفوائد:</h3>
  <ul class="list-disc pr-5 space-y-2 text-sm text-gray-300">
    <li>حماية من حرارة السشوار والمكواة حتى 220 درجة مئوية.</li>
    <li>يعيد بناء ألياف الشعر المكسورة ويمنع الهيشان والتقصف.</li>
    <li>يمنح الشعر لمعاناً ونعومة حريرية دون ملمس زيتي ثقيل.</li>
  </ul>
  <h3 class="font-bold text-luxury-gold text-lg mt-4">💡 طريقة الاستخدام:</h3>
  <p class="text-sm text-gray-300">ضعي كمية بسيطة على أطراف الشعر الرطب أو الجاف قبل استخدام أدوات الحرارة أو يومياً للتصفيف.</p>
</div>
    `.trim(),
  },
  {
    origFile: "0b9e83d2-6d8c-4198-9542-f1a869301b11.jpg",
    cleanFile: "eve-midnight-perfumed-shower-gel-500ml.jpg",
    name: "Eve Midnight Perfumed Shower Gel 500ml",
    slug: "eve-midnight-perfumed-shower-gel-500ml",
    sku: "EVE-MIDNIGHT-500ML",
    brandSlug: "eve",
    brandName: "Eve",
    catSlug: "body-care",
    shortDescription: "شاور جيل معطر ومغذٍ بلمسات فيتامين E والجلسرين ورائحة ميدنايت الأنثوية الساحرة.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>جل الاستحمام المعطر إيف ميدنايت بفيتامين E وجلسرين (Eve Midnight 500ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">جل استحمام فاخر ينظف البشرة بلطف دون تجفيفها، معزز بفيتامين E والجلسرين النقي لترطيب ينبض بالحيوية ورائحة جذابة تفوح وتنعش حواسك.</p>
  <h3 class="font-bold text-luxury-gold text-lg mt-4">✨ الفوائد والمميزات:</h3>
  <ul class="list-disc pr-5 space-y-2 text-sm text-gray-300">
    <li>غني بفيتامين E والجلسرين لحماية الجلد من الجفاف.</li>
    <li>رائحة Midnight الأنثوية الدافئة التي تثبت على البشرة.</li>
    <li>عبوة اقتصادية بحجم 500 مل للاستخدام اليومي.</li>
  </ul>
</div>
    `.trim(),
  },
  {
    origFile: "11284652-5a6d-4e81-8be4-10ed6749118f.jpg",
    cleanFile: "moatar-kiswat-al-kaaba-400ml.jpg",
    name: "Moatar Kiswat Al Kaaba Fabric & Home Freshener 400ml",
    slug: "moatar-kiswat-al-kaaba-400ml",
    sku: "MOATAR-KAABA-400ML",
    brandSlug: "nafahat-al-haram",
    brandName: "نفحات الحرم",
    catSlug: "fragrance",
    shortDescription: "معطر المفارش والمنزل الفاخر كسوة الكعبة من نفحات الحرم برائحة العود والمسك الروحاني الأصيل.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>معطر كسوة الكعبة - نفحات الحرم (Kiswat Al Kaaba Freshener 400ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">معطر جو ومفارش فاخر مستوحى من عبق وعطر كسوة الكعبة المشرفة ومسجد الحرم المكي. يمنح المنزل والمفارش والسجاد هيبة ورائحة روحانية تعبق بالثبات والأصالة.</p>
</div>
    `.trim(),
  },
  {
    origFile: "17188202-d478-4486-9143-484899fd10fa.jpg",
    cleanFile: "nascita-wet-dry-spiral-hair-brush.jpg",
    name: "Nascita Wet & Dry Spiral Hair Brush",
    slug: "nascita-wet-dry-spiral-hair-brush",
    sku: "NASCITA-SPIRAL-BRUSH",
    brandSlug: "nascita",
    brandName: "Nascita",
    catSlug: "hair-care",
    shortDescription: "فرشاة شعر ناسشيتا الحلزونية للشعر الكثيف والطويل لفك التشابك بدون ألم أو تساقط.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>فرشاة شعر ناسشيتا الحلزونية المرنة (Nascita Wet & Dry Brush)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">الفرشاة الحلزونية الأشهر لفك تشابك الشعر الرطب والجاف بكل سهولة. تصميم مرن وفتحات تهوية تسمح بتدفق الهواء أثناء استخدام السشوار دون شد أو تكسير الشعر.</p>
</div>
    `.trim(),
  },
  {
    origFile: "183d2a39-d741-43a2-96a3-1573d29488b3.jpg",
    cleanFile: "ameert-arab-ex-parfum-30ml.jpg",
    name: "Ameert Arab EX Eau de Parfum 30ml",
    slug: "ameert-arab-ex-parfum-30ml",
    sku: "AMEERT-ARAB-30ML",
    brandSlug: "ex-parfum",
    brandName: "EX Parfum",
    catSlug: "fragrance",
    shortDescription: "عطر أميرة العرب ميني 30 مل بعطر شرقي أنثوي فاخر وثبات ممتاز للحقيبة والتنقل.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>عطر أميرة العرب EX ميني (Ameert Arab Parfum 30ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">زجاجة عطر أنيقة بحجم 30 مل تجمع بين الفخامة والعملية. رائحة أنثوية ساحرة تدوم لعدة ساعات وتناسب الحقيبة اليومية والسفر.</p>
</div>
    `.trim(),
  },
  {
    origFile: "22ad6b0f-afb9-4f73-807c-a91461d9b838.jpg",
    cleanFile: "balea-men-golden-intense-bodyspray-24h.jpg",
    name: "Balea Men Golden Intense Deodorant & Bodyspray 24h",
    slug: "balea-men-golden-intense-bodyspray-24h",
    sku: "BALEA-MEN-GOLDEN-24H",
    brandSlug: "balea",
    brandName: "Balea",
    catSlug: "deodorants",
    shortDescription: "مزيل عرق ومعطر جسم باليا مين جولدن إنتنس للرجال برائحة الجريب فروت وجوز الطيب 0% ألومنيوم.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>مزيل عرق باليا مين جولدن إنتنس (Balea Men Golden Intense 24h)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">مزيل عرق ورشاش جسم ألماني رجالي بعطر الجريب فروت وجوز الطيب الجذاب، خالي 100% من الألومنيوم بحماية تدوم 24 ساعة.</p>
</div>
    `.trim(),
  },
  {
    origFile: "295bebf7-28c4-4cc7-84b1-ba18fb1b68d3.jpg",
    cleanFile: "solo-water-parfum-musk-powder-100ml.jpg",
    name: "Solo Collection Water Parfum - Musk Powder 100ml",
    slug: "solo-water-parfum-musk-powder-100ml",
    sku: "SOLO-MUSK-POWDER-100ML",
    brandSlug: "solo-collection",
    brandName: "Solo Collection",
    catSlug: "fragrance",
    shortDescription: "عطر مائي خالي من الكحول مسك بودر من سولو كوليكشن لنظافة وثبات فائق للبشرة الحساسة.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>عطر مائي مسك بودر سولو كوليكشن (Solo Musk Powder 100ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">عطر مائي نقي بدون كحول يدمج بين المسك الصافي وعبق البودرة الناعمة، أمن تماماً على البشرة والطفل ويرش مباشرة بعد الحمام.</p>
</div>
    `.trim(),
  },
  {
    origFile: "2b2a83a5-c4ea-4c27-80b9-8c8467645608.jpg",
    cleanFile: "lebelage-dr-cica-cure-cream-70ml.jpg",
    name: "Lebelage Dr. CICA Cure Cream 70ml",
    slug: "lebelage-dr-cica-cure-cream-70ml",
    sku: "LEBELAGE-CICA-70ML",
    brandSlug: "lebelage",
    brandName: "Lebelage",
    catSlug: "skincare",
    shortDescription: "كريم سيكا المعالج الكوري لتهدئة احمرار البشرة وتقوية حاجز الجلد ومكافحة التجاعيد.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>كريم دكتور سيكا الكوري المعالج من ليبيدليج (Lebelage Dr. CICA Cure Cream 70ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">كريم كوري طبي غني بخلاصة السنتيلا (Centella Asiatica) لتهدئة الحساسية، علاج التهابات واحمرار الجلد، وتقوية حاجز البشرة المتضرر.</p>
</div>
    `.trim(),
  },
  {
    origFile: "3258d801-a35c-4383-9080-d817e0bf01e5.jpg",
    cleanFile: "biodegradable-dermaplaning-razors-6pcs.jpg",
    name: "Biodegradable Dermaplaning Razors 6 Pcs",
    slug: "biodegradable-dermaplaning-razors-6pcs",
    sku: "DERMAPLANING-6PCS",
    brandSlug: "eco-beauty",
    brandName: "Eco Beauty",
    catSlug: "skincare",
    shortDescription: "شفرات ديرما بلانينج صديقة للبيئة 6 قطع لإزالة شعر الوجه والجلد الميت بكل أمان وسلاسة.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>شفرات الوجه والديرما بلانينج صديقة للبيئة (Biodegradable Razors 6 Pcs)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">شفرات تقشير الوجه الدقيقة المصنوعة من القش والمواد القابلة للتحلل، تزيل الشعر الوبري والجلد الميت لمنح البشرة ملمساً زجاجياً أملس.</p>
</div>
    `.trim(),
  },
  {
    origFile: "42547ad1-1978-49e5-a683-b5e77ba7baa2.jpg",
    cleanFile: "arencia-vitamin-c-booster-shot-20ml.jpg",
    name: "Arencia Vitamin C Booster Shot Cream & Eye Moisturizer 20ml",
    slug: "arencia-vitamin-c-booster-shot-20ml",
    sku: "ARENCIA-VITC-20ML",
    brandSlug: "arencia",
    brandName: "Arencia",
    catSlug: "skincare",
    shortDescription: "سيروم وكريم أرينشيا الكوري فيتامين سي وجلوتاثيون للتفتيح والتخلص من بقع وآثار الحبوب.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>سيروم وكريم أرينشيا الكوري بجرعة فيتامين سي والجلوتاثيون (Arencia Vitamin C Shot 20ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">جرعة مركزة من فيتامين سي النقي والجلوتاثيون والبانثينول المخصصة للوجه ومحيط العينين، لتقليل الآثار والبقع وإعطاء نضارة Glowing فورية.</p>
</div>
    `.trim(),
  },
  {
    origFile: "444f7178-d91f-4709-8387-ab4a735cb592.jpg",
    cleanFile: "grace-day-grapefruit-peeling-gel-100ml.jpg",
    name: "Grace Day Multi-Vitamin Grape Fruit Peeling Gel 100ml",
    slug: "grace-day-grapefruit-peeling-gel-100ml",
    sku: "GRACEDAY-GRAPEFRUIT-100ML",
    brandSlug: "grace-day",
    brandName: "Grace Day",
    catSlug: "skincare",
    shortDescription: "جل تقشير كوري بالفيتامينات والجريب فروت لإذابة الجلد الميت وتنظيف البشرة بدون حبيبات.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>جل التقشير اللطيف الكوري بالفواكه من جريس داي (Grace Day Grape Fruit Gel 100ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">جل كوري مقشر بمجرد وضعه ودلكه ينزلق ويذوب الجلد الميت والشوائب، ينظف المسام ويفتح البشرة بفضل مضادات الأكسدة في الجريب فروت.</p>
</div>
    `.trim(),
  },
  {
    origFile: "60656db2-8f53-473c-b28d-7dd3aa8f0ace.jpg",
    cleanFile: "ronza-body-butter-warm-night.jpg",
    name: "Ronza Body Butter - Warm Night",
    slug: "ronza-body-butter-warm-night",
    sku: "RONZA-WARMNIGHT-BB",
    brandSlug: "ronza",
    brandName: "Ronza",
    catSlug: "body-care",
    shortDescription: "زبدة الجسم وورم نايت من رونزا برائحة الكريز الفواحة والدافئة المثيرة للعرايس.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>زبدة الجسم رونزا وورم نايت بعطر الكريز الدافئ (Ronza Body Butter Warm Night)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">زبدة جسم مثالية للعرايس بعطر الكريز والفرومونات الأنثوية الدافئة، تمنح الجسم ملمساً مخملياً ناعماً ورائحة فواحة تأثر الحواس.</p>
</div>
    `.trim(),
  },
  {
    origFile: "6590a83b-13be-4922-a8d3-784af17e5754.jpg",
    cleanFile: "bio-soft-avocado-deep-conditioner-1000ml.jpg",
    name: "Bio Soft Avocado Natural Deep Conditioner 1000ml",
    slug: "bio-soft-avocado-deep-conditioner-1000ml",
    sku: "BIOSOFT-AVOCADO-1000ML",
    brandSlug: "bio-soft",
    brandName: "Bio Soft",
    catSlug: "hair-care",
    shortDescription: "حمام كريم بيو سوفت بالأفوكادو الطبيعي 98% لترطيب وتغذية الشعر التالف والجاف 1000 مل.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>حمام كريم الأفوكادو العميق من بيو سوفت (Bio Soft Avocado 1000ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">حمام كريم ضخم بحجم 1000 مل بمكونات طبيعية 98% وخالي من السيليكون والبارابين، يغذي الشعر الجاف والتالف بالأفوكادو ويمنحه نعومة فائقة.</p>
</div>
    `.trim(),
  },
  {
    origFile: "7f45182c-bd9f-4f3e-8c5c-477ecb06a6f0.jpg",
    cleanFile: "rose-gold-lip-oil.jpg",
    name: "Rose Gold Hydrating Nourishing Lip Oil",
    slug: "rose-gold-lip-oil",
    sku: "ROSEGOLD-LIP-OIL",
    brandSlug: "rose-gold",
    brandName: "Rose Gold",
    catSlug: "makeup",
    shortDescription: "زيت مرطب وملمع الشفاه روز جولد لإعطاء امتلاء ونعومة ووردي طبيعي للشفاه.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>زيت ترطيب وتلميع الشفاه روز جولد (Rose Gold Lip Oil)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">زيت شفاه مغذٍ خفيف يعالج التشققات ويمنح الشفاه مظهر المظلة اللامعة والوردي الشفاف دون أي لزوجة مزعجة.</p>
</div>
    `.trim(),
  },
  {
    origFile: "89126877-e30e-4f6e-9973-395f2d3569cd.jpg",
    cleanFile: "isana-deocreme-mit-natron-50ml.jpg",
    name: "ISANA Deocreme mit Natron 50ml",
    slug: "isana-deocreme-mit-natron-50ml",
    sku: "ISANA-NATRON-DEO-50ML",
    brandSlug: "isana",
    brandName: "ISANA",
    catSlug: "deodorants",
    shortDescription: "كريم مزيل عرق إيزانا الألماني بالنترون وصودا الخبز وشيا بتر بدون ألومنيوم.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>كريم مزيل العرق إيزانا بالنترون الطبيعي (ISANA Deocreme Natron 50ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">كريم مزيل عرق ألماني عالي الفاعلية يعتمد على النترون وزبدة الشيا لتحييد رائحة العرق بشكل طبيعي وآمن 100%.</p>
</div>
    `.trim(),
  },
  {
    origFile: "93b8a3da-9bef-47b2-8a3a-de04ec037150.jpg",
    cleanFile: "balea-keratin-repair-overnight-fluid.jpg",
    name: "Balea Professional Keratin Repair Overnight Fluid",
    slug: "balea-keratin-repair-overnight-fluid",
    sku: "BALEA-KERATIN-FLUID",
    brandSlug: "balea",
    brandName: "Balea",
    catSlug: "hair-care",
    shortDescription: "فلود سيروم الكيراتين والببتيدات الليلي من باليا لإصلاح الشعر المقصف أثناء النوم بدون سيليكون.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>علاج وسيروم الكيراتين الليلي للشعر من باليا (Balea Keratin Repair Overnight Fluid)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">فلود ألماني خفيف يحتوي على الكيراتين والببتيدات يعمل أثناء الاحتكاك في النوم لإصلاح أطراف الشعر المكسورة بدون غسيل.</p>
</div>
    `.trim(),
  },
  {
    origFile: "9808f9ea-d10e-43d7-b9fa-e934c6186fc8.jpg",
    cleanFile: "balea-2-klingen-einweg-rasierer-10stk.jpg",
    name: "Balea 2-Klingen Einweg Rasierer 10 Pcs",
    slug: "balea-2-klingen-einweg-rasierer-10stk",
    sku: "BALEA-RAZORS-10STK",
    brandSlug: "balea",
    brandName: "Balea",
    catSlug: "body-care",
    shortDescription: "شفرات إزالة الشعر باليا الألمانية 10 قطع بشفرتين ومستخلص الصبار وفيتامين E.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>شفرات باليا الألمانية لإزالة الشعر (Balea 2-Klingen Rasierer 10 Stk)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">شفرات ألمانية مرنة بشفرتين حادتين وشريط انزلاق مدعم بالألوفيرا وفيتامين E لإزالة شعر الجسم بسلاسة وبدون تهيج.</p>
</div>
    `.trim(),
  },
  {
    origFile: "9d46d820-773a-419d-9bc5-4010da193d5d.jpg",
    cleanFile: "balea-men-extra-dry-stick-72h.jpg",
    name: "Balea Men Extra Dry Anti-Transpirant Stick 72h",
    slug: "balea-men-extra-dry-stick-72h",
    sku: "BALEA-MEN-STICK-72H",
    brandSlug: "balea",
    brandName: "Balea",
    catSlug: "deodorants",
    shortDescription: "مزيل عرق ستيك للرجال باليا إكسترا دراي الأقوى بحماية 72 ساعة وخالي من الكحول.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>ستيك مزيل عرق باليا مين إكسترا دراي (Balea Men Extra Dry Stick 72h)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">ستيك صلب للرجال يوفر أقصى جفاف وحماية من التعرق الشديد حتى 72 ساعة، خالي تماماً من الكحول ومناسب للرياضة واليوم الطويل.</p>
</div>
    `.trim(),
  },
  {
    origFile: "a982173e-23ed-4a5a-bbe5-f664ce81799c.jpg",
    cleanFile: "moatar-al-rawda-400ml.jpg",
    name: "Moatar Al Rawda Fabric & Home Freshener 400ml",
    slug: "moatar-al-rawda-400ml",
    sku: "MOATAR-RAWDA-400ML",
    brandSlug: "nafahat-al-haram",
    brandName: "نفحات الحرم",
    catSlug: "fragrance",
    shortDescription: "معطر المفارش والمنزل معطر الروضة الشريفة من نفحات الحرم برائحة الورد والمسك النبوي.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>معطر الروضة الشريفة - نفحات الحرم (Moatar Al Rawda 400ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">معطر جو ومفارش ساحر مستوحى من الروضة الشريفة بالمسجد النبوي. عطر يفيض بالطمأنينة والنقاء ويثبت طويلاً على السجاد والأثاث.</p>
</div>
    `.trim(),
  },
  {
    origFile: "b3324421-f0cd-4882-96c4-6a3c6c37e5e0.jpg",
    cleanFile: "muge-leen-12pcs-lip-set.jpg",
    name: "Muge Leen Thanks For The Love Lip Set 12 Pcs",
    slug: "muge-leen-12pcs-lip-set",
    sku: "MUGELEEN-LIPSET-12PCS",
    brandSlug: "muge-leen",
    brandName: "Muge Leen",
    catSlug: "makeup",
    shortDescription: "مجموعة روج وتنت موج لين الفاخرة 12 قطعة بألوان مخملية مط ودرجات نود ووردي وأحمر ثابته.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>مجموعة روج وتنت الشفاه موج لين 12 قطعة (Muge Leen Lip Set)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">علبة هدايا فاخرة تضم 12 درجة مختلفة من التنت والروج المات والمخملي، تغطية غنية وثبات طويل يناسب كافة المناسبات والأذواق.</p>
</div>
    `.trim(),
  },
  {
    origFile: "b6453a89-c260-45bc-bdb8-d75170f8e132.jpg",
    cleanFile: "solo-water-parfum-musk-al-tahara-100ml.jpg",
    name: "Solo Collection Water Parfum - Musk Al Tahara 100ml",
    slug: "solo-water-parfum-musk-al-tahara-100ml",
    sku: "SOLO-MUSK-TAHARA-100ML",
    brandSlug: "solo-collection",
    brandName: "Solo Collection",
    catSlug: "fragrance",
    shortDescription: "عطر مائي خالي من الكحول مسك الطهارة الأبيض من سولو كوليكشن لنظافة وانتعاش دائم.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>عطر مائي مسك الطهارة سولو كوليكشن (Solo Musk Al Tahara 100ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">عطر مائي أبيض خالي من الكحول برائحة مسك الطهارة الفاخرة. مخصص لرشه على البشرة والجسم الحساس بعد الاستحمام مباشرة لفوحان ونظافة تدوم.</p>
</div>
    `.trim(),
  },
  {
    origFile: "be5b0777-943f-49b8-887d-975dbcdb74b6.jpg",
    cleanFile: "billie-eilish-parfum-100ml.jpg",
    name: "Eilish by Billie Eilish Eau de Parfum 100ml",
    slug: "billie-eilish-parfum-100ml",
    sku: "EILISH-PARFUM-100ML",
    brandSlug: "billie-eilish",
    brandName: "Billie Eilish",
    catSlug: "fragrance",
    shortDescription: "عطر آيليش باي بيلي آيليش الأصلي بعطر الفانيليا الكاكاو والتوابل الدافئة الفاخرة 100 مل.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>عطر بيلي آيليش الأصلي اآيليش (Eilish by Billie Eilish 100ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">العطر الساحر الأكثر شهرة بتصميمه الذهبي المميز، يجمع بين الفانيليا الدافئة، الكاكاو، والمظلة السكرية الثابتة جداً.</p>
</div>
    `.trim(),
  },
  {
    origFile: "c37695a3-78ed-4539-b583-29fdb24f4512.jpg",
    cleanFile: "vaseline-cocoa-radiant-body-oil-200ml.jpg",
    name: "Vaseline Intensive Care Cocoa Radiant Body Oil 200ml",
    slug: "vaseline-cocoa-radiant-body-oil-200ml",
    sku: "VASELINE-COCOA-OIL-200ML",
    brandSlug: "vaseline",
    brandName: "Vaseline",
    catSlug: "body-care",
    shortDescription: "زيت فازلين بالكاكاو النقي 100% للجسم لترطيب عميق ولمعان وتوهج جولد صحي برائحة الكوكوت والكاكاو.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>زيت فازلين بالكاكاو النقي للجسم (Vaseline Cocoa Radiant Body Oil 200ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">زيت الجسم الفاخر المغذٍ بـ زبدة الكاكاو النقية 100% وزيوت الترطيب، يغذي الجلد الجاف ويمنح الجسم توهجاً وامتلاءً ورائحة كاكاو ساحرة.</p>
</div>
    `.trim(),
  },
  {
    origFile: "c4a34cc1-59f7-4f8a-b083-f7d5749f0e7b.jpg",
    cleanFile: "moroccan-black-soap-blue-nila.jpg",
    name: "Moroccan Black Soap with Blue Nila & Olive Oil",
    slug: "moroccan-black-soap-blue-nila",
    sku: "MOROCCAN-SOAP-NILA",
    brandSlug: "moroccan-natural",
    brandName: "Moroccan Natural",
    catSlug: "body-care",
    shortDescription: "صابون مغربي بلدي بالنيلة المغربية الزرقاء الأصيلة وزيت الزيتون للتفتيح وإزالة الجلد الميت.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>الصابون المغربي البلدي بالنيلة الزرقاء وزيت الزيتون (Moroccan Nila Soap)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">الصابون المغربي الأصلي المعزز بالنيلة المغربية الزرقاء المعروفة بتفتيح وتوحيد لون البشرة وإزالة الجلد الميت والتصبغات أثناء الحمام المغربي.</p>
</div>
    `.trim(),
  },
  {
    origFile: "c6e09af3-8364-4cf3-9643-5395982bfef2.jpg",
    cleanFile: "mivolis-haar-vital-biotin-60caps.jpg",
    name: "Mivolis Haar Vital Komplex + Biotin 60 Capsules",
    slug: "mivolis-haar-vital-biotin-60caps",
    sku: "MIVOLIS-HAAR-60CAPS",
    brandSlug: "mivolis",
    brandName: "Mivolis",
    catSlug: "hair-care",
    shortDescription: "كبسولات ميفوليس الألمانية بالبيوتين والزنك والسيلينيوم 60 كبسولة لتقوية الشعر وتكثيفه.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>كبسولات فيتامينات الشعر ميفوليس بالبيوتين من dm (Mivolis Haar Vital 60 Caps)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">مكمل غذائي ألماني يحتوي على 1000 ميكروجرام بيوتين، زنيك، سيلينيوم، ونحاس لتغذية الشعر ومنع التساقط ودعم صحة الأظافر.</p>
</div>
    `.trim(),
  },
  {
    origFile: "c8c5794c-0ded-4af8-bd38-56bcbee967a3.jpg",
    cleanFile: "sesa-ayurvedic-hair-oil-100ml.jpg",
    name: "Sesa Ayurvedic Hair Oil 100ml",
    slug: "sesa-ayurvedic-hair-oil-100ml",
    sku: "SESA-OIL-100ML",
    brandSlug: "sesa",
    brandName: "Sesa",
    catSlug: "hair-care",
    shortDescription: "زيت سيسا الهندي الأيورفيدي الأصلي المدعم بـ 18 عشبة و5 زيوت نادرة لإطالة وتكثيف الشعر.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>زيت سيسا الهندي الأصلي المعالج للشعر (Sesa Ayurvedic Hair Oil 100ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">الزيت الهندي العلاجي الشهير المكون من 18 عشبة أيورفيدية مغلي في الحليب الطبيعي لإنبات الشعر وإطالته ومنع التساقط والقشرة.</p>
</div>
    `.trim(),
  },
  {
    origFile: "cb874b85-9a2f-4ddf-85d5-58a6802c816f.jpg",
    cleanFile: "balea-hyaluron-handserum-100ml.jpg",
    name: "Balea Hyaluron Handserum Anti-Aging 100ml",
    slug: "balea-hyaluron-handserum-100ml",
    sku: "BALEA-HANDSERUM-100ML",
    brandSlug: "balea",
    brandName: "Balea",
    catSlug: "skincare",
    shortDescription: "سيروم اليدين الألمانية بالهيالورونيك اسيد ومكافحة شيخوخة اليدين والتجاعيد 100 مل.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>سيروم اليدين بالهيالورونيك اسيد من باليا (Balea Handserum 100ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">سيروم الماني متطور مخصص لليدين الجافة والمجعدة، يملأ الخطوط بالهيالورونيك ويمتصه الجلد بسرعة لإعادة الشباب لليدين.</p>
</div>
    `.trim(),
  },
  {
    origFile: "cb941b26-bd98-49f6-8718-6fb322938a96.jpg",
    cleanFile: "solo-water-parfum-musk-vanilla-100ml.jpg",
    name: "Solo Collection Water Parfum - Musk Vanilla 100ml",
    slug: "solo-water-parfum-musk-vanilla-100ml",
    sku: "SOLO-MUSK-VANILLA-100ML",
    brandSlug: "solo-collection",
    brandName: "Solo Collection",
    catSlug: "fragrance",
    shortDescription: "عطر مائي خالي من الكحول مسك فانيليا من سولو كوليكشن لنظافة وعطر دافئ ثابت.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>عطر مائي مسك فانيليا سولو كوليكشن (Solo Musk Vanilla 100ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">عطر مائي فاخر يجمع بين المسك الأبيض وحلاوة الفانيليا الدفيئة، ناعم جداً على البشرة بدون كحول لثبات ورائحة لطيفة.</p>
</div>
    `.trim(),
  },
  {
    origFile: "cc0c1f7a-50f4-4ab3-a943-240acb1452b4.jpg",
    cleanFile: "rose-berry-body-essence-oil-180g.jpg",
    name: "Rose Berry Body Essence Oil 180g",
    slug: "rose-berry-body-essence-oil-180g",
    sku: "ROSEBERRY-OIL-180G",
    brandSlug: "rose-berry",
    brandName: "Rose Berry",
    catSlug: "body-care",
    shortDescription: "زيت سيروم روز بيري للجسم بعطر الورد والتوت لترطيب وإعطاء لمعان ونعومة حريرية.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>زيت وسيروم الجسم روز بيري (Rose Berry Body Essence Oil 180g)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">زيت جسم خفيف شفاف بعطر الورد والتوت الجذاب، يغذي البشرة ويمنحها لمعاناً وردياً ومرونة فائقة.</p>
</div>
    `.trim(),
  },
  {
    origFile: "ceda1c14-ffbf-46d6-8559-e9ac42da9276.jpg",
    cleanFile: "langhaar-madchen-haarol-intense-repair-100ml.jpg",
    name: "Langhaar Mädchen Haaröl Intense Repair 100ml",
    slug: "langhaar-madchen-haarol-intense-repair-100ml",
    sku: "LANGHAAR-OIL-100ML",
    brandSlug: "langhaar-madchen",
    brandName: "Langhaar Mädchen",
    catSlug: "hair-care",
    shortDescription: "زيت وسيروم لانجهار مدشن الألماني بجوز الهند وزيت البوريتي لإصلاح الشعر المجهد والتالف.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>زيت وسيروم الشعر الألماني لانجهار مدشن (Langhaar Mädchen Haaröl 100ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">سيروم الشعر الألماني الشهير المعزز بزيت جوز الهند وزيت البوريتي الفاخر، يعالج جفاف الشعر ويقضي على الهيشان لمنحك شعراً طويلاً وصحياً.</p>
</div>
    `.trim(),
  },
  {
    origFile: "d012e225-9c76-4597-b584-f1104001a375.jpg",
    cleanFile: "moisture-soothing-cica-gel-300ml.jpg",
    name: "Tenzero Moisture Soothing Cica Gel 300ml",
    slug: "moisture-soothing-cica-gel-300ml",
    sku: "TENZERO-CICA-GEL-300ML",
    brandSlug: "tenzero",
    brandName: "Tenzero",
    catSlug: "skincare",
    shortDescription: "جل السيكا الكوري المهدئ والمبرد للبشرة 300 مل لتهدئة الاحمرار واضطرابات الشمس والحلاقة.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>جل السيكا الكوري المهدئ للبشرة والجسم (Tenzero Soothing Cica Gel 300ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">جل كوري مرطب ومهدئ بعشبة السيكا (Centella) بحجم ضخم 300 مل، ينعش البشرة المحمرة بعد التعرض للشمس أو إزالة الشعر ويرطب دون ملمس دهني.</p>
</div>
    `.trim(),
  },
  {
    origFile: "d02d5fa2-d306-411c-b7c9-b6a617fff767.jpg",
    cleanFile: "tenzero-turn-on-body-brightening-cream-180ml.jpg",
    name: "Tenzero Turn On Body Brightening Cream 180ml",
    slug: "tenzero-turn-on-body-brightening-cream-180ml",
    sku: "TENZERO-BODY-BRIGHT-180ML",
    brandSlug: "tenzero",
    brandName: "Tenzero",
    catSlug: "body-care",
    shortDescription: "كريم تينزيرو الكوري للتفتيح الفوري للجسم والمناطق الحساسة والمقاوم للتعرق 180 مل.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>كريم تينزيرو الكوري لتفتيح الجسم الفوري (Tenzero Turn On Body Cream 180ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">كريم كوري لتفتيح الجسم الفوري والمستمر بروتين الحليب والأرز، يمتص بسرعة ومقاوم للتعرق والماء دون ترك أي أثر جيري.</p>
</div>
    `.trim(),
  },
  {
    origFile: "d03c42ca-3a5b-4319-b146-042e4b95230e.jpg",
    cleanFile: "ronza-foot-stick-keratolytic-cream.jpg",
    name: "Ronza Foot Stick Keratolytic Moisturizing Cream",
    slug: "ronza-foot-stick-keratolytic-cream",
    sku: "RONZA-FOOT-STICK",
    brandSlug: "ronza",
    brandName: "Ronza",
    catSlug: "body-care",
    shortDescription: "ستيك رونزا المعالج لتشققات الكعبين والقدمين بحمض الساليسليك واليوريا ومقشرات الاحماض.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>ستيك بلسم رونزا لعلاج تشققات القدمين الكثيفة (Ronza Foot Stick)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">ستيك ذكي ومقشر لعلاج التشققات الشديدة في الكعبين، يحتوي على اليوريا وحمض الساليسليك وحمض اللاكتيك لتنعيم القدمين وتقشير الجلد الميت بسهولة.</p>
</div>
    `.trim(),
  },
  {
    origFile: "d5173d1e-4055-495c-9d69-39b71668c472.jpg",
    cleanFile: "aloe-vera-99-soothing-magic-lip-balm.jpg",
    name: "Aloe Vera 99% Soothing Magic Lip Balm",
    slug: "aloe-vera-99-soothing-magic-lip-balm",
    sku: "ALOEVERA-LIP-BALM",
    brandSlug: "general",
    brandName: "General",
    catSlug: "makeup",
    shortDescription: "مرطب وتنت الشفاه السحري بالصبار 99% لإعطاء لون وردي طبيعي وترطيب التشققات.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>مرطب الشفاه السحري بجل الصبار 99% (Aloe Vera Magic Lip Balm)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">بلسم مرطب يتحول لونه الأخضر إلى درجة وردية طبيعية ساحرة بحسب درجة حرارة الشفاه، يغذي ويرطب التشققات طوال اليوم.</p>
</div>
    `.trim(),
  },
  {
    origFile: "e43f4f0a-ccba-4531-8ca1-28cd18222718.jpg",
    cleanFile: "isana-deocreme-mit-frischem-duft-50ml.jpg",
    name: "ISANA Deocreme mit frischem Duft 50ml",
    slug: "isana-deocreme-mit-frischem-duft-50ml",
    sku: "ISANA-FRESH-DEO-50ML",
    brandSlug: "isana",
    brandName: "ISANA",
    catSlug: "deodorants",
    shortDescription: "كريم مزيل عرق إيزانا الألماني برائحة الانتعاش والنظافة 0% ألومنيوم.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>كريم مزيل العرق إيزانا الألماني برائحة النظافة (ISANA Deocreme Fresh 50ml)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">كريم مزيل عرق الماني خالي من الألومنيوم يمنحك شعوراً فورياً بالنظافة والانتعاش ويمنع رائحة العرق طوال اليوم بكفاءة وآمان.</p>
</div>
    `.trim(),
  },
  {
    origFile: "e6402256-0689-4cd0-af9c-49f9efcb0649.jpg",
    cleanFile: "kesh-king-anti-hairfall-shampoo-aloe-vera.jpg",
    name: "Kesh King Anti-Hairfall Shampoo with Aloe Vera & 21 Herbs",
    slug: "kesh-king-anti-hairfall-shampoo-aloe-vera",
    sku: "KESH-ALOE-SHAMPOO",
    brandSlug: "kesh-king",
    brandName: "Kesh King",
    catSlug: "hair-care",
    shortDescription: "شامبو كيش كينج الهندي بالصبار والـ 21 عشبة أيورفيدية لتقليل التساقط 80% وتنعيم الشعر.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>شامبو كيش كينج الهندي بالصبار والأعشاب (Kesh King Aloe Vera Shampoo)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">شامبو كيش كينج الأخضر المدعم بنبات الصبار (Aloe Vera) و21 عشبة هندية لتقليل تساقط الشعر حتى 80% وإكساب الشعر النعومة واللمعان.</p>
</div>
    `.trim(),
  },
  {
    origFile: "ef245358-e9ba-47b1-8181-8f5797dcc19b.jpg",
    cleanFile: "tenzero-perfect-cover-bb-cream-50g.jpg",
    name: "Tenzero Perfect Cover BB Cream 50g",
    slug: "tenzero-perfect-cover-bb-cream-50g",
    sku: "TENZERO-BB-CREAM-50G",
    brandSlug: "tenzero",
    brandName: "Tenzero",
    catSlug: "makeup",
    shortDescription: "بي بي كريم تينزيرو الكوري للتغطية المثالية وحماية البشرة وإخفاء العيوب 50 جم.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>بي بي كريم تينزيرو الكوري الأصلي (Tenzero Perfect Cover BB Cream 50g)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">كريم BB كوري بتغطية فائقة وطبيعية ينساب على البشرة لإخفاء العيوب والاحمرار وتوحيد لون الوجه مع ترطيب وتغذية خفيفة.</p>
</div>
    `.trim(),
  },
  {
    origFile: "efb42250-5ba2-4096-b4a2-ed8895a26a7f.jpg",
    cleanFile: "kenta-bebe-creme-de-soin-50g.jpg",
    name: "Kenta Bébé Crème de Soin n°1 50g",
    slug: "kenta-bebe-creme-de-soin-50g",
    sku: "KENTA-CREME-50G",
    brandSlug: "kenta",
    brandName: "Kenta",
    catSlug: "skincare",
    shortDescription: "كريم كينتا المغربي الأصلي لتفتيح المناطق الحساسة والإبط وعلاج الالتهابات.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>كريم كينتا المغربي الشهير للتفتيح (Kenta Bébé Crème de Soin 50g)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">كريم العناية المغربي الأصلي الخالي من الكورتيزون، المخصص لتفتيح وعلاج التسلخات واسمرار المناطق الحساسة والإبطين بأمان تام.</p>
</div>
    `.trim(),
  },
  {
    origFile: "efce2e0e-8295-40e5-8753-e02d916c3649.jpg",
    cleanFile: "balea-aqua-hyaluron-3in1-haarmaske.jpg",
    name: "Balea Professional Aqua Hyaluron 3in1 Haarmaske 400% Aloe Vera",
    slug: "balea-aqua-hyaluron-3in1-haarmaske",
    sku: "BALEA-AQUA-HYALURON-MASK",
    brandSlug: "balea",
    brandName: "Balea",
    catSlug: "hair-care",
    shortDescription: "ماسك ومغذي الشعر الأكوا هيالورونيك 3في1 من باليا للشعر الجاف والعطشان 0% سيليكون.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>ماسك الشعر أكوا هيالورون 3في1 من باليا (Balea Aqua Hyaluron 3in1 Mask)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">ماسك سيروم هيدروليك معزز بـ 40% صبار وهيبالورونيك اسيد، يروي الشعر الجاف والعطشان ويمنحه طراوة وحيوية بدون أي سيليكون.</p>
</div>
    `.trim(),
  },
  {
    origFile: "f1382dba-f197-476f-b055-4b0929c17ec3.jpg",
    cleanFile: "rozy-honey-women-bikini-butter.jpg",
    name: "Rozy Honey Women Bikini Butter",
    slug: "rozy-honey-women-bikini-butter",
    sku: "ROZY-BIKINI-BUTTER",
    brandSlug: "rozy-honey",
    brandName: "Rozy Honey",
    catSlug: "body-care",
    shortDescription: "زبدة البيكيني روزي هاني لترطيب وتفتيح وعمل بروتكشن للمناطق الحساسة برائحة العسل والورد.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>زبدة البيكيني لترطيب وتفتيح المناطق الحساسة (Rozy Honey Bikini Butter)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">زبدة قوامها مخملي مخصصة لمنطقة البيكيني والمناطق الحساسة، تمنع الاحتكاك والتسلخات وتساعد في ترطيب وتنعيم وتفتيح الجلد.</p>
</div>
    `.trim(),
  },
  {
    origFile: "f1ed930a-b0ab-4780-82e5-3406d05ccecd.jpg",
    cleanFile: "moroccan-beldi-soap-aker-fassi.jpg",
    name: "Moroccan Beldi Soap with Aker Fassi",
    slug: "moroccan-beldi-soap-aker-fassi",
    sku: "MOROCCAN-SOAP-AKERFASSI",
    brandSlug: "moroccan-natural",
    brandName: "Moroccan Natural",
    catSlug: "body-care",
    shortDescription: "صابون بلدي مغربي بعكر فاسي أصلي لتوريد وتفتيح وإعطاء نضارة فورية للجسم.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>الصابون المغربي البلدي بالعكر الفاسي (Moroccan Beldi Aker Fassi Soap)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">صابون مغربي بلدي عالي الجودة ممزوج بالعكر الفاسي (دم الغزال الأصلي) لتقشير الخلايا الميتة وإكساب الجسم مظهر التوريد والنضارة الحريرية.</p>
</div>
    `.trim(),
  },
  {
    origFile: "f400b489-ae57-4659-9812-36cc4a16b42d.jpg",
    cleanFile: "sheglam-tubing-tech-mascara.jpg",
    name: "SHEGLAM Tubing Tech Flake-Off Tubing Mascara",
    slug: "sheglam-tubing-tech-mascara",
    sku: "SHEGLAM-TUBING-MASCARA",
    brandSlug: "sheglam",
    brandName: "SHEGLAM",
    catSlug: "makeup",
    shortDescription: "ماسكارا شيجلان توبينج تيك لتكثيف وتطويل الرموش ومقاومة التكتل والتطلخ.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>ماسكارا شيجلام توبينج تيك (SHEGLAM Tubing Mascara)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">الماسكارا الثورية بتكنولوجيا الأنابيب التي تغلف كل رمش لتطويل وتكثيف لا مثيل له، وتزيل بسهولة بالماء الدافئ دون تلطيخ العين.</p>
</div>
    `.trim(),
  },
  {
    origFile: "fe794c5a-f80a-405c-8009-ae93674c2bff.jpg",
    cleanFile: "tenzero-perfect-brightening-tone-up-cream-50g.jpg",
    name: "Tenzero Perfect Brightening Tone-Up Cream 50g",
    slug: "tenzero-perfect-brightening-tone-up-cream-50g",
    sku: "TENZERO-TONEUP-CREAM-50G",
    brandSlug: "tenzero",
    brandName: "Tenzero",
    catSlug: "skincare",
    shortDescription: "كريم تينزيرو الكوري لإشراق وتفتيح البشرة وتخفيف الخطوط الدقيقة 50 جم.",
    description: `
<div class="space-y-4 text-right">
  <p class="text-base font-semibold text-luxury-gold"><strong>كريم تينزيرو الكوري لتفتيح الوجه (Tenzero Perfect Tone-Up Cream 50g)</strong></p>
  <p class="text-sm text-gray-300 leading-relaxed">كريم كوري مزدوج الفاعلية يمنح البشرة إشراقة وتفتيحاً ناعماً وفورياً مع تنعيم الخطوط التعبيرية والحفاظ على رطوبة الجلد.</p>
</div>
    `.trim(),
  },
];

async function addEhdaa2Products() {
  console.log("🚀 Step 1: Processing Images and Copying to public/uploads/...");
  for (const item of EHDAA2_PRODUCTS) {
    const src = path.join(ehdaa2Dir, item.origFile);
    const dest = path.join(uploadsDir, item.cleanFile);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      console.log(`🖼️ Copied: ${item.cleanFile}`);
    } else {
      console.warn(`⚠️ Warning: Source image missing: ${item.origFile}`);
    }
  }

  console.log("\n🚀 Step 2: Ensuring Brands exist in Supabase...");
  const brandMap = {};
  for (const item of EHDAA2_PRODUCTS) {
    if (!item.brandSlug) continue;
    let { data: brand } = await supabase.from("brands").select("id").eq("slug", item.brandSlug).maybeSingle();
    if (!brand) {
      const { data: newBrand, error } = await supabase
        .from("brands")
        .insert({ name: item.brandName, slug: item.brandSlug, is_active: true })
        .select("id")
        .single();
      if (error) {
        console.warn(`Failed creating brand ${item.brandName}:`, error.message);
        continue;
      }
      brand = newBrand;
    }
    brandMap[item.brandSlug] = brand.id;
  }

  console.log("\n🚀 Step 3: Ensuring Categories exist in Supabase...");
  const catMap = {};
  const CATEGORIES = [
    { name: "Skincare", slug: "skincare" },
    { name: "Makeup", slug: "makeup" },
    { name: "Fragrance", slug: "fragrance" },
    { name: "Deodorants", slug: "deodorants" },
    { name: "Body Care", slug: "body-care" },
    { name: "Hair Care", slug: "hair-care" },
  ];
  for (const c of CATEGORIES) {
    let { data: cat } = await supabase.from("categories").select("id").eq("slug", c.slug).maybeSingle();
    if (!cat) {
      const { data: newCat } = await supabase
        .from("categories")
        .insert({ name: c.name, slug: c.slug, is_active: true })
        .select("id")
        .single();
      cat = newCat;
    }
    if (cat) catMap[c.slug] = cat.id;
  }

  console.log("\n🚀 Step 4: Adding/Updating 44 Products in Supabase...");
  let successCount = 0;

  for (const item of EHDAA2_PRODUCTS) {
    const brandId = item.brandSlug ? brandMap[item.brandSlug] : null;
    const categoryId = catMap[item.catSlug] || null;
    const imageUrl = `/uploads/${item.cleanFile}`;

    const payload = {
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      price: 0,
      compare_at_price: null,
      stock_quantity: 25,
      low_stock_threshold: 5,
      brand_id: brandId,
      category_id: categoryId,
      short_description: item.shortDescription,
      description: item.description,
      status: "published",
      is_available: true,
      is_featured: true,
      is_best_seller: true,
      is_new_arrival: true,
      is_on_sale: false,
    };

    let { data: existingP } = await supabase.from("products").select("id").eq("slug", item.slug).maybeSingle();
    let productId;

    if (!existingP) {
      const { data: createdP, error: pErr } = await supabase
        .from("products")
        .insert(payload)
        .select("id")
        .single();
      if (pErr) {
        console.error(`❌ Failed product ${item.name}:`, pErr.message);
        continue;
      }
      productId = createdP.id;
    } else {
      productId = existingP.id;
      await supabase.from("products").update(payload).eq("id", productId);
    }

    // Product Image
    await supabase.from("product_images").delete().eq("product_id", productId);
    await supabase.from("product_images").insert({
      product_id: productId,
      url: imageUrl,
      alt_text: item.name,
      is_primary: true,
      sort_order: 0,
    });

    console.log(`✅ Product Ready: ${item.name}`);
    successCount++;
  }

  console.log(`\n🎉 SUCCESS! All ${successCount} products from ehdaa2 added to Supabase!\n`);
}

addEhdaa2Products().catch((err) => {
  console.error("❌ Error:", err.message);
});
