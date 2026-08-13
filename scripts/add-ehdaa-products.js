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

// All Brands
const BRANDS_LIST = [
  { name: "ANUA", slug: "anua", description: "Korean skincare brand" },
  { name: "Memwa", slug: "memwa", description: "Body mist and fragrance brand" },
  { name: "Parachute", slug: "parachute", description: "India's No.1 coconut oil brand" },
  { name: "Balea", slug: "balea", description: "German personal care brand by dm" },
  { name: "Velvet", slug: "velvet", description: "Luxury body butter brand" },
  { name: "Ebelin", slug: "ebelin", description: "German beauty accessories by dm" },
  { name: "Kesh King", slug: "kesh-king", description: "Ayurvedic hair care by Emami" },
  { name: "The Ordinary", slug: "the-ordinary", description: "Clinical skincare by DECIEM" },
  { name: "Teresia", slug: "teresia", description: "Korean collagen skincare" },
  { name: "Watsons", slug: "watsons", description: "Personal care and beauty brand" },
  { name: "Farmstay", slug: "farmstay", description: "Korean sun care and skincare" },
  { name: "Godrej", slug: "godrej", description: "Indian FMCG and beauty brand" },
  { name: "Super Kids", slug: "super-kids", description: "Kids hair care brand" },
  { name: "Vaseline", slug: "vaseline", description: "Intensive care body brand by Unilever" },
  { name: "Jam Tint", slug: "jam-tint", description: "Korean lip tint brand" },
];

// All Categories
const CATEGORIES_LIST = [
  { name: "Skincare", slug: "skincare", description: "منتجات العناية بالبشرة والوجه" },
  { name: "Makeup", slug: "makeup", description: "مستحضرات التجميل والمكياج" },
  { name: "Fragrance", slug: "fragrance", description: "العطور ومعطرات الجسم الفاخرة" },
  { name: "Deodorants", slug: "deodorants", description: "مزيلات العرق الكلاسيكية والطبية" },
  { name: "Body Care", slug: "body-care", description: "منتجات العناية والجسم" },
  { name: "Hair Care", slug: "hair-care", description: "مستحضرات وشامبوهات العناية بالشعر" },
  { name: "Sunscreen", slug: "sunscreen", description: "واقيات الشمس والحماية من الأشعة الضارة" },
];

const SUB_CATEGORIES_LIST = [
  { name: "Serums", slug: "serums", parentSlug: "skincare", description: "سيرومات مركزة" },
  { name: "Moisturizers", slug: "moisturizers", parentSlug: "skincare", description: "كريمات ترطيب" },
  { name: "Lipstick", slug: "lipstick", parentSlug: "makeup", description: "أحمر الشفاه والتنت" },
];

// Products List with High-Conversion HTML Descriptions & SEO Meta Tags
const PRODUCTS_DATA = [
  {
    name: "ANUA Niacinamide 10% + TXA 4% Dark Spot Correcting Serum 30ml",
    slug: "anua-niacinamide-10-txa-4-serum-30ml",
    sku: "ANUA-SERUM-001",
    brandSlug: "anua",
    catSlug: "skincare",
    subCatSlug: "serums",
    shortDescription: "سيروم كوري أصلي لتفتيح وتوحيد لون البشرة والتخلص من التصبغات العميقة والبقع الداكنة وآثار الحبوب.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">سيروم أنوا الكوري الفعال للتصبغات والبقع (ANUA Niacinamide 10% + TXA 4%)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">السيروم الكوري الأكثر طلباً عالمياً ومحلياً لإعادة النقاء والشفافية الزجاجية للبشرة (Glass Skin)، مصمم خصيصاً لمكافحة التصبغات العنيدة وآثار الحبوب واسمرار الشمس بدون أي جفاف أو تهيج.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد الفائقة والمكونات النشطة:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>10% Niacinamide (نياسيناميد)</strong>: يقلل إفراز الدهون الزائدة، يشد المسام الواسعة، ويمنح البشرة ملمساً ناعماً متجانساً.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>4% Tranexamic Acid (حمض الترانيكساميك - TXA)</strong>: المكون الذهبي الحديث لمنع تكون الميلانين وتفتيح البقع الداكنة الناتجة عن الشمس والتغيرات الهرمونية.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>2% Alpha Arbutin (ألفا أربوتين)</strong>: يضاعف قوة التفتيح الآمن ويعالج الآثار القديمة للحبوب.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>Hyaluronic Acid & Centella (هيالورونيك وسينتيلا)</strong>: ترطيب عميق ممتد وتهدئة فورية للبشرة الحساسة المعرضة للاحمرار.</span></li>
    </ul>
  </div>

  <div class="bg-zinc-900/60 p-4 rounded-xl border border-gold-500/20">
    <h3 class="font-bold text-luxury-gold text-lg mb-2 flex items-center gap-2">🌸 البشرة المناسبة:</h3>
    <p class="text-sm text-gray-300">مناسب لجميع أنواع البشرة (الدهنية، المختلطة، الجافة، والحساسة) المعرضة للتصبغات وآثار الحبوب والبهتان.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام المثالية:</h3>
    <ol class="list-decimal pr-5 space-y-2 text-sm text-gray-300 leading-relaxed">
      <li>نظفي بشرتك جيداً بغسول مناسب وجفيفها بلطف.</li>
      <li>ضعي 3 إلى 4 قطرات من السيروم على الوجه والرقبة.</li>
      <li>دلكي بحركات دائرية خفيفة حتى الامتصاص الكامل.</li>
      <li>استخدميه مرتين يومياً (صباحاً ومساءً)، وتأكدي من استخدام واقي الشمس صباحاً.</li>
    </ol>
  </div>
</div>
    `.trim(),
    metaTitle: "سيروم أنوا الكوري الأصلي للتصبغات والبقع ANUA Niacinamide 10% + TXA 4%",
    metaDescription: "اشتري سيروم أنوا الكوري الأصلي لعلاج التصبغات، البقع الداكنة، وآثار الحبوب بتركيبة النياسيناميد والترانيكساميك. حماية وترطيب للبشرة الزجاجية.",
    metaKeywords: ["سيروم أنوا الأصلي", "سيروم أنوا التصبغات", "ANUA Niacinamide 10", "سيروم كوري للبقع", "علاج آثار الحبوب", "K-Beauty Egypt", "سيروم نياسيناميد ترانيكساميك"],
    imageRelPath: "anua-niacinamide-10-txa-4-serum-30ml.jpeg",
  },
  {
    name: "Memwa Body Mist - Musk Al Tahara Cotton Candy",
    slug: "memwa-body-mist-musk-al-tahara",
    sku: "MEMWA-MIST-001",
    brandSlug: "memwa",
    catSlug: "fragrance",
    shortDescription: "معطر جسم فاخر يجمع بين أصالة مسك الطهارة وحلاوة عطر غزل البنات الانتعاش والأناقة.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">معطر الجسم مسك الطهارة غزل البنات من ميموا (Memwa Body Mist)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">تركيبة عطرية ساحرة تدمج النقاء الأسطوري لمسك الطهارة مع لمسات السكر الناعمة لعطر الكوتون كاندي، لمنحك إحساساً بالنظافة والأنوثة يدوم طوال اليوم.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد والمميزات الاستثنائية:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>ثبات وفوحان ممتاز</strong>: يثبت على البشرة والملابس لعدة ساعات متواصلة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>تركيبة آمنة لطيفة</strong>: خالية من المواد الضارة ولا تسبب أي تحسس للبشرة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>إحساس بالانتعاش</strong>: يعطيك شعور النظافة والاسترخاء بعد كل استحمام.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">رشيه بغزارة على الجسم بعد الاستحمام مباشرة على بشرة رطبة، وركزي على مناطق النبض (الرقبة، المعصمين، وخلف الأذن) لأقصى ثبات وفوحان.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "معطر جسم ميموا مسك الطهارة غزل البنات Memwa Body Mist Musk Cotton Candy",
    metaDescription: "تسوقي معطر الجسم الفاخر ميموا مسك الطهارة برائحة غزل البنات القطنية. ثبات عالٍ ورائحة أنثوية ناعمة ومستمرة.",
    metaKeywords: ["معطر ميموا", "بودي ميست مسك الطهارة", "معطر غزل البنات", "Memwa Body Mist", "معطر جسم ثابث", "مسك الطهارة كوتون كاندي"],
    imageRelPath: "memwa-body-mist-musk-al-tahara.jpg",
  },
  {
    name: "Parachute 100% Pure & Natural Coconut Oil 200ml",
    slug: "parachute-coconut-oil-200ml",
    sku: "PARA-OIL-001",
    brandSlug: "parachute",
    catSlug: "hair-care",
    shortDescription: "زيت جوز الهند الهندي الطبيعي 100% لتغذية وتقوية الشعر والبشرة من الجذور للأطراف.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">زيت جوز الهند الهندي النقي 100% باراشوت (Parachute Coconut Oil 200ml)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">زيت جوز الهند الهندي الأصلي رقم 1 عالمياً. مستخرج 100% من أجود ثمار جوز الهند العضوية بدون أي إضافات كيميائية أو زيوت معدنية، ليوفر عناية فائقة بالشعر والبشرة.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد الفائقة للشعر والبشرة:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>يخترق 10 طبقات من الشعر</strong>: يغذي بصيلات الشعر من الداخل ويقلل التساقط والتقصف.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>ترطيب وحماية من الهيشان</strong>: يمنح الشعر جفافاً أقل ولمعاناً حريرياً رائعاً.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>مرطب عميق للبشرة والجسم</strong>: يعالج الجفاف الشديد ويمنح الجلد ملمساً طرياً ونعومة فائقة.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طرق الاستخدام المتعددة:</h3>
    <ul class="list-disc pr-5 space-y-2 text-sm text-gray-300 leading-relaxed">
      <li><strong>حمام زيت دافئ للشعر:</strong> سخني كمية مناسبة ودلكي فروة الرأس والشعر، اتركيه ساعتين ثم اغسليه بالشامبو.</li>
      <li><strong>سيروم دهان يومي:</strong> مسحة خفيفة جداً على الأطراف لمنع الهيشان والتقصف.</li>
      <li><strong>ترطيب الجسم:</strong> ضعي قطرات بعد الحمام مباشرة لترطيب الأماكن الجافة كالركب والأكواع.</li>
    </ul>
  </div>
</div>
    `.trim(),
    metaTitle: "زيت جوز الهند باراشوت الهندي الأصلي 100% Parachute Coconut Oil 200ml",
    metaDescription: "اشتري زيت جوز الهند الهندي الأصلي باراشوت 200 مل النقي 100%. التغذية المثالية لعلاج هيشان وتساقط الشعر وترطيب البشرة.",
    metaKeywords: ["زيت باراشوت الأصلي", "زيت جوز الهند الهندي", "Parachute Coconut Oil", "حمام زيت باراشوت", "علاج هيشان الشعر", "ترطيب الشعر الجاف"],
    imageRelPath: "parachute-coconut-oil-200ml.jpg",
  },
  {
    name: "Balea Parfum Deodorant - Glamorous Moment",
    slug: "balea-parfum-deodorant-glamorous-moment",
    sku: "BALEA-DEO-001",
    brandSlug: "balea",
    catSlug: "fragrance",
    shortDescription: "مزيل عرق ومعطر بارفوم باليا الألماني بعطر شرقي زهري فاخر بديل العطور العالمية.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">مزيل عرق ومعطر بارفوم باليا جلاموروس مومنت (Balea Glamorous Moment)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">مزيل عرق ومعطر جسم ألماني أصلي من dm يجمع بين الحماية القوية من العرق والعطر الشرقي الزهري الساحر الذي يدوم طوال اليوم.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ المميزات الفريدة:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>0% ألومنيوم (ACH)</strong>: آمن تماماً وصحي لا يسد مسام البشرة ولا يسبب اسمرار.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>حماية 24 ساعة</strong>: يحميك من رائحة العرق الكريهة ويحافظ على الانتعاش.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>عطر شرقي زهري</strong>: رائحة أنثوية راقية تناسب الاستخدام اليومي والمناسبات.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>نباتي 100% وخالٍ من الميكروبلاستيك والمواد الضارة.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">يُرَج الإسبراي جيداً ثم يرش على مسافة 15 سم من بشرة تحت الإبط والجسم الجافة والنظيفة.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "مزيل عرق باليا بارفوم جلاموروس مومنت Balea Parfum Deodorant Glamorous Moment",
    metaDescription: "تسوقي مزيل عرق باليا الألماني الأصلي بدون ألومنيوم بعطر شرقي زهري فاخر. حماية 24 ساعة وانتعاش دائم بدون اسمرار.",
    metaKeywords: ["مزيل عرق باليا", "Balea Deodorant", "باليا بدون ألومنيوم", "Balea Glamorous Moment", "مزيل عرق ألماني", "معطر جسم باليا"],
    imageRelPath: "balea-parfum-deodorant-glamorous-moment.jpg",
  },
  {
    name: "Balea Sensitive Deocreme 48h",
    slug: "balea-sensitive-deocreme-48h",
    sku: "BALEA-DEO-002",
    brandSlug: "balea",
    catSlug: "deodorants",
    shortDescription: "كريم مزيل عرق ألماني للبشرة الحساسة بدون ألومنيوم أو كحول بحماية 48 ساعة.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">كريم مزيل العرق باليا للبشرة الحساسة (Balea Sensitive Deocreme 48h)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">الخيار الطبي الأكثر أماناً وراحة للبشرة الحساسة وبعد إزالة الشعر. يوفر حماية فائقة من رائحة العرق تدوم حتى 48 ساعة دون أي التهاب أو احمرار.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ المميزات الطبية والعناية:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>0% ألومنيوم و 0% كحول</strong>: آمن 100% للبشرة الحساسة ولا يسبب التصبغات.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>حماية مضاعفة 48 ساعة</strong>: يمنع تكون رائحة العرق مع الحفاظ على تنفس البشرة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>تركيبة كريمية مغذية</strong>: تترك ملمساً ناعماً وهادئاً للغاية.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">ضعي كمية بحجم حبة البازلاء على منطقة تحت الإبط الجافة والنظيفة، ودلكيها بلطف حتى تمتص تماماً.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "كريم مزيل عرق باليا للبشرة الحساسة Balea Sensitive Deocreme 48h",
    metaDescription: "اشتري كريم مزيل عرق باليا الألماني للبشرة الحساسة بدون ألومنيوم ولا كحول. حماية 48 ساعة وترطيب فائق للبشرة.",
    metaKeywords: ["كريم مزيل عرق باليا", "Balea Sensitive Deocreme", "مزيل عرق للبشرة الحساسة", "مزيل عرق بدون ألومنيوم", "باليا سنسيتيف"],
    imageRelPath: "balea-sensitive-deocreme.jpg",
  },
  {
    name: "Jam Tint Soft Lipstick No.06",
    slug: "jam-tint-soft-lipstick-06",
    sku: "JAMTINT-LIP-006",
    brandSlug: "jam-tint",
    catSlug: "makeup",
    subCatSlug: "lipstick",
    shortDescription: "تنت وأحمر شفاه كوري ناعم درجة 06 وردي طبيعي لمظهر مخملي مرطب ثابت.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">تنت وأحمر شفاه جام تنت ناعم درجة 06 (Jam Tint Soft Lipstick No.06)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">تنت الشفاه الكوري المفضل لإطلالة الشفاه الطبيعية والمفعمة بالحيوية، يجمع بين ثبات التنت ونعومة وأناقة أحمر الشفاه المرطب.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد والمميزات:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>درجة 06 وردي طبيعي جذاب</strong>: يمنح الشفاه لوناً حيوياً ومشرقاً.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>ثبات عالي بدون جفاف</strong>: يغذي الشفاه ويمنع التشققات.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>ملمس مخملي خفيف لا يشعر بالثقل على الشفاه.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">مرريه على الشفاه مباشرة للحصول على تغطية كاملة غنية، أو وزعي قطرات بسيطة بدمج الأصابع للحصول على إطلالة التنت الطبيعية (Gradient Lip Look).</p>
  </div>
</div>
    `.trim(),
    metaTitle: "تنت وأحمر شفاه جام تنت كوري درجة 06 Jam Tint Soft Lipstick No.06",
    metaDescription: "احصلي على تنت الشفاه الكوري الأصلي جام تنت درجة 06 لون وردي طبيعي ثابت ومرطب للشفاه طوال اليوم.",
    metaKeywords: ["تنت جام تنت", "Jam Tint 06", "تنت كوري أصلي", "أحمر شفاه كوري", "تنت وردي طبيعي", "K-Beauty Tint"],
    imageRelPath: "jam-tint-soft-lipstick-06.jpg",
  },
  {
    name: "Blush Compact No.2 Red",
    slug: "blush-compact-red-02",
    sku: "BLUSH-RED-002",
    brandSlug: null,
    catSlug: "makeup",
    shortDescription: "بلاشر مضغوط وتنت خدود درجة 2 أحمر طبيعي لإشراقة ومظهر مورد ساحر.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">بلاشر مضغوط وتنت الخدود درجة 2 أحمر (Blush Compact No.2 Red)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">بلاشر كريمي ومضغوط بسحر خاص يورد الخدود والوجه بلون أحمر طبيعي مفعم بالحيوية والنضارة الفورية.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ المميزات والخصائص:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>مظهر مورد طبيعي (Natural Flush)</strong>: يندمج بسلاسة فائقة مع البشرة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>ثبات طويل مقاوم للتعرق</strong>: يدوم لعدة ساعات دون أن يتغير لونه.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>علبة مضغوطة وفاخرة مزودة بمرآة لسهولة التعديل في أي مكان.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">استخدمي فرشة البلاشر أو أطراف أصابعك لتوزيع كمية مناسبة على عظام الخدود ودمجها لأعلى للحصول على مظهر مكسو بالحيوية والنضارة.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "بلاشر مضغوط وتنت الخدود درجة 2 أحمر Blush Compact No.2 Red",
    metaDescription: "تسوقي بلاشر وتنت الخدود المضغوط درجة 2 أحمر طبيعي مع مرآة مدمجة لتوريد الخدود وإعطاء نضارة حيوية للبشرة.",
    metaKeywords: ["بلاشر أحمر", "تنت خدود مضغوط", "Blush Compact 2 Red", "بلاشر مع مرآة", "توريد الخدود", "مكياج خدود ثابت"],
    imageRelPath: "blush-compact-red-02.jpg",
  },
  {
    name: "Velvet Body Butter - Strawberry Cheesecake",
    slug: "velvet-body-butter-strawberry-cheesecake",
    sku: "VELVET-BB-001",
    brandSlug: "velvet",
    catSlug: "body-care",
    shortDescription: "زبدة الجسم الفاخرة بخلاصة الكمأة بعطر ستروبيري تشيز كيك الفراولة والفانيليا.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">زبدة الجسم فيلفيت ستروبيري تشيز كيك (Velvet Body Butter Strawberry Cheesecake)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">تجربة العناية الأكثر رفاهية وإغراءً لجسمك! زبدة جسم غنية وفاخرة معززة بخلاصة الكمأة ورائحة تشيز كيك الفراولة مع الفانيليا التي تجنن وتدوم طويلاً.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد والمكونات الفاخرة:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>خلاصة الكمأة (Truffle Extract)</strong>: تغذية مضاعفة وحماية للبشرة من الجفاف والتجاعيد.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>عطر الشوجري الجذاب</strong>: مزيج ساحر من الفراولة الطازجة والفانيليا الثابتة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>ترطيب مكثف وعميق يمنح الجلد ملمساً مخملياً طرياً.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">دلكي كمية سخية على كامل الجسم بعد الاستحمام مباشرة والبشرة رطبة لضمان أقصى امتصاص وثبات للعطر.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "زبدة الجسم فيلفيت ستروبيري تشيز كيك Velvet Body Butter Strawberry Cheesecake",
    metaDescription: "تسوقي زبدة الجسم الفاخرة فيلفيت بخلاصة الكمأة بعطر ستروبيري تشيز كيك الفراولة والفانيليا. ترطيب عميق ورائحة ثابته.",
    metaKeywords: ["زبدة جسم فيلفيت", "Velvet Body Butter", "زبدة جسم فراولة", "ستروبيري تشيز كيك body butter", "ترطيب الجسم الشديد"],
    imageRelPath: "velvet-body-butter-strawberry-cheesecake.jpg",
  },
  {
    name: "Ebelin Styling Kamm Bio",
    slug: "ebelin-styling-kamm-bio",
    sku: "EBELIN-KAMM-001",
    brandSlug: "ebelin",
    catSlug: "hair-care",
    shortDescription: "مشط تصفيف ألماني طبيعي من ألياف الخشب مضاد للكهرباء الساكنة لفك التشابك.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">مشط تصفيف الشعر البيو الطبيعي من إيبلين (Ebelin Bio Styling Kamm)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">مشط ألماني عالي الجودة من ماركة إيبلين (dm)، مصنوع من خامات طبيعية وألياف الخشب المستدامة للعناية بالشعر وفك التشابك بدون أي تقصف.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد والخصائص الصحية:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>مضاد للكهرباء الساكنة (Antistatic)</strong>: يمنع تطاير الشعر وهيشان الأطراف أثناء التصفيف.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>أسنان مصقولة بعناية تحمي فروة الرأس وتمنع تكسر وتكسير الشعر.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>صديق للبيئة 100% ومصنع من مواد حيوية مستدامة.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">استخدميه لتسريح الشعر الرطب أو الجاف بدءاً من الأطراف وصعوداً إلى الجذور لفك التكلكل والتشابك بأمان وسهولة.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "مشط تصفيف الشعر الألماني إيبلين الخشبي Ebelin Bio Styling Kamm",
    metaDescription: "اشتري مشط تصفيف الشعر الألماني الأصلي من إيبلين المصنوع من ألياف الخشب الطبيعي المضاد للكهرباء الساكنة لمنع التقصف والتطاير.",
    metaKeywords: ["مشط إيبلين", "Ebelin Kamm", "مشط خشبي للشعر", "مشط فك التشابك", "مشط مضاد للكهرباء الساكنة", "أدوات شعر ألمانية"],
    imageRelPath: "ebelin-styling-kamm.jpg",
  },
  {
    name: "Kesh King Organic Onion Shampoo",
    slug: "kesh-king-organic-onion-shampoo",
    sku: "KESH-SHAM-001",
    brandSlug: "kesh-king",
    catSlug: "hair-care",
    shortDescription: "شامبو البصل العضوي الهندي كيش كينج بـ 21 عشبة أيورفيدية لتقليل التساقط 98%.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">شامبو البصل العضوي من كيش كينج (Kesh King Organic Onion Shampoo)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">الشامبو الهندي الأصلي المعالج لتساقط الشعر الشديد! مدعم بأوراق الكاري و21 عشبة أيورفيدية قيمة لتغذية البصيلات وتحفيز إنبات الشعر من الجذور.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد العلاجية الاستثنائية:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>تقليل تساقط الشعر بنسبة 98%</strong>: يقوي الجذور الباهتة ويحفز نمو الشعر الجديد.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>21 عشبة أيورفيدية نادرة</strong>: تنظف فروة الرأس بفاعلية وتمنح الشعر لمعاناً ونعومة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>خالٍ من البارابين، الفثالات، والصباغ الاصطناعية، ويساعد في حماية الشعر من الشيب المبكر.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">ضعي كمية مناسبة على فروة الرأس والشعر المبلل، دلكي بلطف بأطراف الأصابع لمدة دقيقتين حتى تظهر الرغوة الغنية، ثم اشطفيه جيدا بالماء.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "شامبو كيش كينج بالبصل العضوي الهندي الأصلي Kesh King Organic Onion Shampoo",
    metaDescription: "احصلي على شامبو البصل العضوي الهندي كيش كينج لعلاج تساقط الشعر وتقوية الجذور بـ 21 عشبة أيورفيدية حصرية.",
    metaKeywords: ["شامبو كيش كينج", "Kesh King Onion Shampoo", "شامبو البصل الهندي", "علاج تساقط الشعر", "شامبو أيورفيدي", "شامبو كيش كينج الأصلي"],
    imageRelPath: "kesh-king-organic-onion-shampoo.jpg",
  },
  {
    name: "Velvet Body Butter - Musc Poudrée",
    slug: "velvet-body-butter-musc-poudree",
    sku: "VELVET-BB-002",
    brandSlug: "velvet",
    catSlug: "body-care",
    shortDescription: "زبدة الجسم الفاخرة بخلاصة الكمأة بعطر مسك بودريه الناعم والهادئ.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">زبدة الجسم فيلفيت مسك بودريه (Velvet Body Butter Musc Poudrée)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">زبدة جسم برائحة المسك البودري الرقيق والراقي، تمنح بشرتك ترطيباً ممتداً وشعوراً بالنظافة والحريرية المستمرة طوال اليوم.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد والمكونات الفاخرة:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>عطر مسك بودري ناعم</strong>: رائحة النظافة والأناقة الهادئة الثابتة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>خلاصة الكمأة (Truffle Extract)</strong>: ترطيب عميق وإعادة مرونة الجلد الباهت.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>ملمس مخملي يمتص بسرعة ولا يترك أي بقايا دهنية.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">وزعي كمية مناسبة على الجلد الجاف أو بعد الحمام مباشرة لتعديل ملمس البشرة وإكسابها عطلاً هادئاً وناعماً.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "زبدة الجسم فيلفيت مسك بودريه Velvet Body Butter Musc Poudrée",
    metaDescription: "اشتري زبدة الجسم فيلفيت بعطر المسك البودري الناعم وخلاصة الكمأة. ترطيب عميق ورائحة نظافة هادئة تثبت طوال اليوم.",
    metaKeywords: ["زبدة جسم مسك", "Velvet Musc Poudree", "زبدة جسم بودر", "ترطيب البشرة الجافة", "زبدة الكمأة للبشرة"],
    imageRelPath: "velvet-body-butter-musc-poudree.jpg",
  },
  {
    name: "The Ordinary Glycolic Acid 7% Toning Solution",
    slug: "the-ordinary-glycolic-acid-7-toning-solution",
    sku: "TO-GLYC-001",
    brandSlug: "the-ordinary",
    catSlug: "skincare",
    shortDescription: "تونر التقشير العالمي بحمض الجليكوليك 7% لتنقية البشرة والجسم وتوحيد الملمس.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">تونر حمض الجليكوليك 7% من ذا أورديناري (The Ordinary Glycolic Acid 7%)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">التونر المقشر الأكثر شهرة عالمياً! يعمل على تقشير البشرة بلطف وتجديد الخلايا لتنقية المسام وتوحيد لون الجلد وتنعيم الملمس الخشن في الوجه والجسم.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد والنتائج المذهلة:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>7% Glycolic Acid (حمض الجليكوليك)</strong>: يزيل طبقات الجلد الميتة وينعم ملمس البشرة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>تفتيح المناطق الداكنة</strong>: ممتاز لتفتيح الركبتين، الأكواع، والإبطين وتنقية الجلد.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>محتوى على الفلفل التسماني والصبار لتهدئة الجلد ومنع التهيج.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام الصحيحة:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">استخدميه مرة واحدة مساءً فقط. يمسح به الوجه والرقبة أو مناطق الجسم بواسطة قطنة نظيفة. تجنبي منطقة العينين، واحرصي على استخدام واقي الشمس نهاراً.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "تونر ذا أورديناري حمض الجليكوليك 7% الأصلي The Ordinary Glycolic Acid 7%",
    metaDescription: "تسوقي تونر التقشير الأصلي من ذا أورديناري بحمض الجليكوليك 7%. لتقشير البشرة وتفتيح الجسم وتصغير المسام المفتوحة.",
    metaKeywords: ["تونر ذا أورديناري", "The Ordinary Glycolic Acid", "تونر الجليكوليك الأصلي", "تقشير البشرة والجسم", "تفتيح الإبط والركب", "The Ordinary Egypt"],
    imageRelPath: "the-ordinary-glycolic-acid-7-toning-solution.jpg",
  },
  {
    name: "Teresia Marine Collagen Brightening Tone Up Cream 50ml",
    slug: "teresia-marine-collagen-brightening-cream",
    sku: "TERESIA-CREAM-001",
    brandSlug: "teresia",
    catSlug: "skincare",
    subCatSlug: "moisturizers",
    shortDescription: "كريم تفتيح كوري بالكولاجين البحري لإشراقة طبيعية وتوحيد لون البشرة.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">كريم تيريسيا الكوري بالكولاجين البحري للتفتيح (Teresia Marine Collagen Cream)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">كريم كوري فاخر يمنحك تفتيحاً وإشراقة فورية للبشرة مع ترطيب واستعادة مرونة الجلد بفضل قوة الكولاجين البحري النقي.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد والمكونات:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>الكولاجين البحري (Marine Collagen)</strong>: يعيد الشباب والمرونة للبشرة ويحارب الخطوط الدقيقة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>تفتيح فوري وطبيعي (Tone-Up Effect)</strong>: يوحد لون البشرة بدون أي تكتل.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>حماية وترطيب ممتد يحمي من الجفاف.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">في نهاية روتين العناية بالبشرة، وزعي كمية بحجم البندقة على الوجه والرقبة واضغطي بكف اليد بلطف حتى يتم امتصاصه كاملاً.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "كريم تيريسيا الكوري للتفتيح بالكولاجين البحري Teresia Marine Collagen Cream",
    metaDescription: "اشتري كريم تيريسيا الكوري الأصلي بالكولاجين البحري للتفتيح الفوري وتوحيد لون البشرة واستعادة مرونتها الشبابية.",
    metaKeywords: ["كريم تيريسيا الكوري", "Teresia Collagen Cream", "كريم تفتيح كوري", "كولاجين بحري للبشرة", "Tone Up Cream Korea"],
    imageRelPath: "teresia-marine-collagen-brightening-cream.jpg",
  },
  {
    name: "Balea Parfum Deodorant - Golden Moon",
    slug: "balea-parfum-deodorant-golden-moon",
    sku: "BALEA-DEO-003",
    brandSlug: "balea",
    catSlug: "fragrance",
    shortDescription: "مزيل عرق ومعطر بارفوم باليا بعطر شرقي حسي فاخر بديل عطر Mugler Alien.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">مزيل عرق ومعطر بارفوم باليا جولدن مون (Balea Golden Moon)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">معطر ومزيل عرق بعطر شرقي حسي غامض وساحر يشبه العطر العالمي الشهير Mugler ALIEN، يوفر إحساساً بالفخامة والأناقة المسائية.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد والمميزات:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>0% ألومنيوم</strong>: أمان تام وحماية 24 ساعة بدون انغلاق للمسام.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>رائحة شرقية دافئة غنية تثبت وتفوح طوال اليوم.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>تركيبة ألمانية نباتية 100%.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">يرج جيداً ويرش على بشرة الإبط والجسم الجافة من مسافة 15 سم.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "مزيل عرق باليا جولدن مون الأصلي Balea Parfum Deodorant Golden Moon",
    metaDescription: "تسوقي مزيل عرق باليا جولدن مون بعطر شرقي فاخر بديل Mugler Alien. حماية 24 ساعة بدون ألومنيوم ولا تسبب تصبغات.",
    metaKeywords: ["باليا جولدن مون", "Balea Golden Moon", "بديل عطر اليان", "مزيل عرق باليا بدون ألومنيوم", "Balea Alien Dupes"],
    imageRelPath: "balea-parfum-deodorant-golden-moon.jpg",
  },
  {
    name: "Godrej Nupur Henna 100% Pure",
    slug: "godrej-nupur-henna-100-pure",
    sku: "GODREJ-HENNA-001",
    brandSlug: "godrej",
    catSlug: "hair-care",
    shortDescription: "حناء نوبور الهندية النقية 100% لتغليف وتقوية وتلوين الشعر طبيعياً.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">حناء جودريج نوبور الهندية النقية 100% (Godrej Nupur Henna)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">الحناء الهندية الأكثر شهرة وجودة لعلاج ومداواة الشعر، تمنح الشعر لوناً غنياً وللمعاناً قاوياً وتغليفاً يمنع التساقط والقشرة.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد الطبيعية الممتازة:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>100% حناء هندية نقية</strong>: خالية من المواد الكيميائية والأصباغ.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>تقوي الجذور وتغلف الشعر لمنع التقصف والقشرة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>تضفي لوناً حيوياً ومظهراً براقاً وصحياً.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">اعجني الحناء بالماء الدافئ واتركيها تخمر لـ 2 إلى 3 ساعات، وزعيها على كامل الشعر وفروة الرأس، اتركيها من 3 إلى 4 ساعات ثم اشطفيها بالماء فقط أول يوم.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "حناء نوبور الهندية النقية 100% للشعر Godrej Nupur Henna 100% Pure",
    metaDescription: "اشتري حناء نوبور الهندية الأصيلة 100% لتلوين وتقوية الشعر وتنعيمه طبيعياً بدون أي إضافات كيميائية.",
    metaKeywords: ["حناء نوبور الأصلي", "Godrej Nupur Henna", "حناء هندية للشعر", "تلوين الشعر بالحناء", "علاج قشرة الشعر"],
    imageRelPath: "godrej-nupur-henna.jpg",
  },
  {
    name: "Farmstay Oil-Free UV Defence Sun Cream SPF50+ PA+++",
    slug: "farmstay-oil-free-sun-cream-spf50",
    sku: "FARM-SUN-001",
    brandSlug: "farmstay",
    catSlug: "sunscreen",
    shortDescription: "واقي شمس كوري خالي من الزيوت SPF50+ PA+++ للبشرة الدهنية والمختلطة.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">واقي شمس فارم ستاي الكوري الخالي من الزيوت (Farmstay Sun Cream SPF50+)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">واقي الشمس الكوري الخفيف والمثالي للبشرة الدهنية والمختلطة، يوفر أعلى درجات الحماية دون التسبب في لمعه أو انسداد المسام.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ المميزات وحماية الأشعة:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>SPF50+ PA+++</strong>: حماية كاملة من أشعة UVA و UVB الضارة والتصبغات.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>Oil-Free</strong>: خفيف جداً لا يترك ملمساً دهنياً أو طبقة بيضاء.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>يمتص سريعاً ومناسب جداً كقاعدة قبل المكياج.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">ضعي كمية كافية على الوجه والرقبة قبل التعرض للشمس بـ 20 دقيقة، ويكرر كل ساعتين عند التواجد في الشمس.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "واقي شمس فارم ستاي خالي من الزيوت Farmstay Oil-Free Sun Cream SPF50+",
    metaDescription: "تسوقي واقي شمس فارم ستاي الكوري الخالي من الزيوت SPF50+. حماية فائقة للبشرة الدهنية والمختلطة بدون طبقة بيضاء ولا لمعان.",
    metaKeywords: ["واقي شمس فارم ستاي", "Farmstay Sun Cream", "واقي شمس خالي من الزيوت", "صن بلوك كوري", "واقي شمس للبشرة الدهنية"],
    imageRelPath: "farmstay-oil-free-sun-cream.jpg",
  },
  {
    name: "Balea Parfum Deodorant - Pure Elegance",
    slug: "balea-parfum-deodorant-pure-elegance",
    sku: "BALEA-DEO-004",
    brandSlug: "balea",
    catSlug: "fragrance",
    shortDescription: "مزيل عرق ومعطر بارفوم باليا بعطر زهري أنيق ورقيق بديل عطر Chloé.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">مزيل عرق ومعطر باليا بيور إيليجانس (Balea Pure Elegance)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">معطر ومزيل عرق بعطر زهري رقيق وأنيق يشبه العطر العالمي الفاخر Chloé، ينبض بالأنوثة والنظافة التي تثبت طوال اليوم.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد والمميزات:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>0% ألومنيوم</strong>: حماية ناعمة 24 ساعة بدون أي آثار جانبية.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>عطر الورد والأزهار الناعمة الراقية.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>تركيبة ألمانية نباتية عالية الجودة.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">يرج جيداً ثم يرش على بشرة الإبط والجسم الجافة والنظيفة من مسافة 15 سم.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "مزيل عرق باليا بيور إيليجانس الأصلي Balea Parfum Deodorant Pure Elegance",
    metaDescription: "اشتري مزيل عرق باليا بيور إيليجانس الألماني بدون ألومنيوم بعطر الزهور الأنيق بديل عطر Chloé. حماية 24 ساعة.",
    metaKeywords: ["باليا بيور ايليجانس", "Balea Pure Elegance", "بديل عطر كلوي", "Balea Chloe Dupes", "مزيل عرق باليا الورد"],
    imageRelPath: "balea-parfum-deodorant-pure-elegance.jpg",
  },
  {
    name: "Watsons So Sexy Deodorant 150ml",
    slug: "watsons-so-sexy-deodorant-150ml",
    sku: "WATSONS-DEO-001",
    brandSlug: "watsons",
    catSlug: "deodorants",
    shortDescription: "مزيل عرق أنثوي من واتسونز بدون بودرة ولا ألومنيوم لحماية 24 ساعة.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">مزيل عرق واتسونز سو سيكسي (Watsons So Sexy Deodorant 150ml)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">مزيل عرق أنثوي جذاب برائحة غنية ينعش بشرتك ويحميك من رائحة العرق بدون أي بقايا بودرة بيضاء.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد والمميزات:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>0% ألومنيوم و 0% بارابين</strong>: حماية آمنة وخفيفة على الجلد.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>حماية 24 ساعة بدون علامات بيضاء على الملابس.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>عطر أنثوي منعش يدوم طويلاً.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">يرش على منطقة تحت الإبط والجسم من مسافة 15 سم على بشرة نظيفة وجافة.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "مزيل عرق واتسونز سو سيكسي 150 مل Watsons So Sexy Deodorant",
    metaDescription: "تسوقي مزيل عرق واتسونز سو سيكسي الأصلي 150 مل بدون ألومنيوم ولا بارابين لحماية 24 ساعة من رائحة العرق.",
    metaKeywords: ["مزيل عرق واتسونز", "Watsons Deodorant", "واتسونز سو سيكسي", "Watsons So Sexy", "مزيل عرق بدون بودرة"],
    imageRelPath: "watsons-so-sexy-deodorant.jpg",
  },
  {
    name: "Balea Deocreme - Himbeer & Magnolien 24h",
    slug: "balea-deocreme-himbeer-magnolien",
    sku: "BALEA-DEO-005",
    brandSlug: "balea",
    catSlug: "deodorants",
    shortDescription: "كريم مزيل عرق بالنترون وصودا الخبز بعطر التوت والماغنوليا من باليا.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">كريم مزيل العرق بالنترون والتوت من باليا (Balea Deocreme Natron)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">كريم مزيل عرق طبيعي معزز بقوة صودا الخبز (النترون) للتخلص المحتوم من رائحة العرق بعطر التوت والماغنوليا المنعش.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد والمميزات:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>0% ألومنيوم و 0% ميكروبلاستيك</strong>: يعتمد على حماية النترون الطبيعي.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>عطر التوت والزهور المنعش بحماية 24 ساعة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>عبوة من بلاستيك معاد تدويره 100%.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">دلكي كمية صغيرة بحجم حبة الحمص على منطقة تحت الإبط الجافة والنظيفة حتى تمتص تماماً.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "كريم مزيل عرق باليا بالنترون والتوت Balea Deocreme Himbeer & Magnolien",
    metaDescription: "اشتري كريم مزيل عرق باليا بالنترون وصودا الخبز بعطر التوت والماغنوليا. حماية طبيعية 24 ساعة بدون ألومنيوم.",
    metaKeywords: ["كريم باليا بالنترون", "Balea Deocreme Natron", "كريم مزيل عرق التوت", "مزيل عرق طبيعي بدون ألومنيوم"],
    imageRelPath: "balea-deocreme-himbeer-magnolien.jpg",
  },
  {
    name: "Super Kids Hair Cream",
    slug: "super-kids-hair-cream",
    sku: "SUPERKIDS-CREAM-001",
    brandSlug: "super-kids",
    catSlug: "hair-care",
    shortDescription: "كريم شعر للأطفال آمن من عمر سنة لتصفيف سهل وفك التشابك بدون هيشان.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">كريم الشعر للأطفال سوبر كيدز (Super Kids Hair Cream 200ml)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">كريم شعر مخصص للأطفال بتصنيف آمن جداً لتسهيل التصفيف، فك التشابك، وترطيب الشعر الكيرلي والعادي دون أي دموع أو هيشان.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد والأمان:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>آمن من عمر 1 سنة فأكثر</strong>: خالي من السيليكون، البارابين، والزيوت المعدنية.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>يرطب الشعر ويهدئ الهيشان ويمنح لمعاناً ونعومة فائقة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>يجعل عملية التصفيف سهلة وممتعة للأطفال.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">يوضع كمية مناسبة على شعر الطفل الندى أو الجاف، ويمشط بالفرشاة أو المشط من الأسفل للأعلى لفك التشابك بسهولة.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "كريم شعر للأطفال سوبر كيدز Super Kids Hair Cream 200ml",
    metaDescription: "تسوقي كريم شعر للأطفال سوبر كيدز الآمن من عمر 1 سنة لفك التشابك وترطيب الشعر ومنع الهيشان بدون سيليكون ولا بارابين.",
    metaKeywords: ["كريم سوبر كيدز", "Super Kids Hair Cream", "كريم شعر للأطفال", "علاج هيشان شعر الأطفال", "كريم كيرلي للأطفال"],
    imageRelPath: "super-kids-hair-cream.jpg",
  },
  {
    name: "Balea Parfum Deodorant - Blossom",
    slug: "balea-parfum-deodorant-blossom",
    sku: "BALEA-DEO-006",
    brandSlug: "balea",
    catSlug: "fragrance",
    shortDescription: "مزيل عرق ومعطر بارفوم باليا بعطر زهري منعش بديل عطر Lancôme La Vie Est Belle.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">مزيل عرق ومعطر باليا بلوسوم (Balea Blossom)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">معطر ومزيل عرق بعطر زهري منعش ومبهج يشبه العطر العالمي الشهير Lancôme La Vie Est Belle، ليمحنك رائحة أنثوية مبهرة طوال اليوم.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد والمميزات:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>0% ألومنيوم</strong>: أمان التغطية والعطر الجذاب لمدة 24 ساعة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>رائحة زهور وجاذبية أنثوية مبهرة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>تركيبة ألمانية نباتية 100%.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">رشيه على بشرة نظيفة وجافة من مسافة 15 سم لشعور بالانتعاش والجاذبية طوال اليوم.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "مزيل عرق باليا بلوسوم الأصلي Balea Parfum Deodorant Blossom",
    metaDescription: "اشتري مزيل عرق باليا بلوسوم بعطر زهري مبهج بديل Lancôme La Vie Est Belle. حماية 24 ساعة بدون ألومنيوم.",
    metaKeywords: ["باليا بلوسوم", "Balea Blossom", "بديل عطر لانكوم", "Balea Lancome Dupes", "مزيل عرق باليا الورد"],
    imageRelPath: "balea-parfum-deodorant-blossom.jpg",
  },
  {
    name: "Vaseline Intensive Care Vitamin B3 Body Oil 200ml",
    slug: "vaseline-vitamin-b3-body-oil-200ml",
    sku: "VASELINE-OIL-001",
    brandSlug: "vaseline",
    catSlug: "body-care",
    shortDescription: "زيت للجسم بفيتامين B3 من فازلين لبشرة موحدة اللون ومتوهجة ذات مظهر صحي.",
    description: `
<div class="space-y-6 text-right">
  <div class="bg-luxury-gold/10 border-r-4 border-luxury-gold p-4 rounded-lg">
    <h2 class="text-xl font-bold text-luxury-gold mb-1">زيت الجسم بفيتامين B3 من فازلين (Vaseline Body Oil 200ml)</h2>
    <p class="text-sm text-gray-300 leading-relaxed">زيت فاخر للجسم مغذٍ وموحد للون البشرة معزز بـ النياسيناميد (فيتامين B3)، يعيد النضارة واللمعان الصحي للبشرة والجسم طوال اليوم.</p>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">✨ الفوائد واللمعان الصحي:</h3>
    <ul class="space-y-3 text-sm text-gray-300 pr-2">
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span><strong>فيتامين B3 (Niacinamide)</strong>: يساعد في توحيد لون الجلد ومنحه نظرة متوهجة (Glowing Skin).</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>مكونات طبيعية 100% تعيد الرطوبة للبشرة الجافة والباهتة.</span></li>
      <li class="flex items-start gap-2"><span class="text-luxury-gold">🔹</span> <span>قوام خفيف سريع الامتصاص يترك لمعة صحية ورائحة ممتازة.</span></li>
    </ul>
  </div>

  <div>
    <h3 class="font-bold text-luxury-gold text-lg mb-3 flex items-center gap-2">💡 طريقة الاستخدام:</h3>
    <p class="text-sm text-gray-300 leading-relaxed pr-2">ضعي قطرات مناسبة على الجسم واليدين والساقين بعد الحمام مباشرة ودلكي بحركات دائرية للمعان رائع.</p>
  </div>
</div>
    `.trim(),
    metaTitle: "زيت الجسم فازلين بفيتامين B3 الأصلي Vaseline Body Oil 200ml",
    metaDescription: "تسوقي زيت الجسم فازلين بالفيتامين B3 والنياسيناميد النقي لتوحيد لون البشرة وإعطاء لمعان وتوهج صحي للجسم 200 مل.",
    metaKeywords: ["زيت فازلين للجسم", "Vaseline Body Oil", "زيت فازلين بفيتامين B3", "توهج البشرة", "ترطيب الجسم فازلين", "Vaseline Vitamin B3"],
    imageRelPath: "vaseline-vitamin-b3-body-oil-200ml.jpg",
  },
];

async function addAllProducts() {
  console.log("🚀 Processing Brands...");
  const brandMap = {};
  for (const b of BRANDS_LIST) {
    let { data: brand } = await supabase.from("brands").select("id").eq("slug", b.slug).maybeSingle();
    if (!brand) {
      const { data: newBrand, error } = await supabase
        .from("brands")
        .insert({ name: b.name, slug: b.slug, description: b.description, is_active: true })
        .select("id")
        .single();
      if (error) {
        console.warn(`Failed to create brand ${b.name}:`, error.message);
        continue;
      }
      brand = newBrand;
    }
    brandMap[b.slug] = brand.id;
  }

  console.log("🚀 Processing Main Categories...");
  const catMap = {};
  for (const c of CATEGORIES_LIST) {
    let { data: cat } = await supabase.from("categories").select("id").eq("slug", c.slug).maybeSingle();
    if (!cat) {
      const { data: newCat, error } = await supabase
        .from("categories")
        .insert({ name: c.name, slug: c.slug, description: c.description, is_active: true })
        .select("id")
        .single();
      if (error) {
        console.warn(`Failed to create category ${c.name}:`, error.message);
        continue;
      }
      cat = newCat;
    }
    catMap[c.slug] = cat.id;
  }

  console.log("🚀 Processing Subcategories...");
  const subCatMap = {};
  for (const sc of SUB_CATEGORIES_LIST) {
    const parentId = catMap[sc.parentSlug];
    if (!parentId) continue;
    let { data: sub } = await supabase.from("categories").select("id").eq("slug", sc.slug).maybeSingle();
    if (!sub) {
      const { data: newSub, error } = await supabase
        .from("categories")
        .insert({ name: sc.name, slug: sc.slug, description: sc.description, parent_id: parentId, is_active: true })
        .select("id")
        .single();
      if (error) {
        console.warn(`Failed to create subcategory ${sc.name}:`, error.message);
        continue;
      }
      sub = newSub;
    }
    subCatMap[sc.slug] = sub.id;
  }

  console.log("🚀 Processing 22 Products with Advanced SEO Meta Tags & Luxury Descriptions...");
  let successCount = 0;

  for (const item of PRODUCTS_DATA) {
    const brandId = item.brandSlug ? brandMap[item.brandSlug] : null;
    const categoryId = catMap[item.catSlug] || null;
    const subcategoryId = item.subCatSlug ? subCatMap[item.subCatSlug] : null;
    const imageUrl = `/uploads/${item.imageRelPath}`;

    const productPayload = {
      name: item.name,
      slug: item.slug,
      sku: item.sku,
      price: 0,
      compare_at_price: null,
      stock_quantity: 25,
      low_stock_threshold: 5,
      brand_id: brandId,
      category_id: categoryId,
      subcategory_id: subcategoryId,
      short_description: item.shortDescription,
      description: item.description,
      meta_title: item.metaTitle,
      meta_description: item.metaDescription,
      meta_keywords: item.metaKeywords,
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
      const { data: createdP, error: insertErr } = await supabase
        .from("products")
        .insert(productPayload)
        .select("id")
        .single();
      if (insertErr) {
        console.error(`❌ Error inserting product ${item.name}:`, insertErr.message);
        continue;
      }
      productId = createdP.id;
    } else {
      productId = existingP.id;
      await supabase.from("products").update(productPayload).eq("id", productId);
    }

    // Insert Product Image
    await supabase.from("product_images").delete().eq("product_id", productId);
    await supabase.from("product_images").insert({
      product_id: productId,
      url: imageUrl,
      alt_text: item.name,
      is_primary: true,
      sort_order: 0,
    });

    console.log(`✅ Enhanced SEO Product: ${item.name}`);
    successCount++;
  }

  console.log(`\n🎉 SUCCESS! ${successCount} products updated with Advanced SEO & High-Conversion Descriptions!\n`);
}

addAllProducts().catch((err) => {
  console.error("❌ Fatal Error:", err.message);
});
