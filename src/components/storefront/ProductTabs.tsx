"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, HelpCircle, Truck, ShieldCheck, CheckCircle2, Lightbulb, Clock, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
  description?: string | null;
  shortDescription?: string | null;
  productName: string;
  categoryName?: string;
}

export function ProductTabs({
  description,
  shortDescription,
  productName,
  categoryName,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<"desc" | "usage" | "shipping">("desc");

  // Extract usage from HTML if present or generate contextual usage guide
  const extractUsageContent = () => {
    if (description && (description.includes("طريقة الاستخدام") || description.includes("💡"))) {
      const parts = description.split(/طريقة الاستخدام[^\n<]*[:：]?/i);
      if (parts.length > 1) {
        return parts[1].replace(/<\/div>[\s\S]*$/i, "").trim();
      }
    }
    return null;
  };

  const usageHtml = extractUsageContent();

  const tabs = [
    { id: "desc" as const, label: "وصف ومميزات المنتج", icon: Sparkles },
    { id: "usage" as const, label: "طريقة الاستخدام والروتين", icon: HelpCircle },
    { id: "shipping" as const, label: "الشحن والضمان", icon: Truck },
  ];

  return (
    <div className="mt-12 rounded-2xl border border-luxury-border/30 bg-surface-elevated/40 p-4 sm:p-8 backdrop-blur-md shadow-xl">
      {/* Animated Tab Switcher */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 border-b border-luxury-border/20 pb-4 mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-300 touch-manipulation",
                isActive
                  ? "text-gold bg-gold/15 border border-gold/40 shadow-sm"
                  : "text-luxury-muted hover:text-luxury-white hover:bg-surface-elevated"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-gold animate-pulse" : "text-luxury-muted")} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels with Smooth Animation */}
      <div className="min-h-[220px]">
        <AnimatePresence mode="wait">
          {activeTab === "desc" && (
            <motion.div
              key="desc"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Luxury Guarantee Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center gap-3 rounded-xl border border-gold/20 bg-gold/5 p-3.5">
                  <ShieldCheck className="h-5 w-5 text-gold shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-luxury-white">أصلي ومضمون 100%</p>
                    <p className="text-[11px] text-luxury-muted">مستورد ومطابق للمواصفات</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-luxury-border/30 bg-premium-black/50 p-3.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-luxury-white">جودة معتمدة</p>
                    <p className="text-[11px] text-luxury-muted">نتائج فعالة وآمنة تماماً</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-luxury-border/30 bg-premium-black/50 p-3.5">
                  <Droplets className="h-5 w-5 text-blue-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-luxury-white">تركيبة فاخرة</p>
                    <p className="text-[11px] text-luxury-muted">ترطيب وعناية فائقة</p>
                  </div>
                </div>
              </div>

              {/* Rich HTML Description */}
              {description ? (
                <div
                  className="prose prose-invert max-w-none text-luxury-white leading-relaxed text-sm sm:text-base border-t border-luxury-border/20 pt-6"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              ) : (
                <p className="text-luxury-muted text-sm sm:text-base leading-relaxed">
                  {shortDescription ?? `استمتع بأفخم تجربة عناية مع ${productName}. منتج أصلي فاخر يمنحك نتائج ملحوظة وعناية استثنائية.`}
                </p>
              )}
            </motion.div>
          )}

          {activeTab === "usage" && (
            <motion.div
              key="usage"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-2 text-gold font-bold text-base sm:text-lg">
                <Lightbulb className="h-5 w-5 text-gold animate-bounce" />
                <h3>دليل الاستخدام والروتين الموصى به:</h3>
              </div>

              {/* Step by Step Animated Guide Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-xl border border-luxury-border/30 bg-premium-black p-4 space-y-2 hover:border-gold/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-white shadow-xs">
                      1
                    </span>
                    <Clock className="h-4 w-4 text-luxury-muted" />
                  </div>
                  <h4 className="text-sm font-bold text-luxury-white">الخطوة الأولى: التحضير والتنظيف</h4>
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    نظفي المنطقة المستهدفة (الوجه أو الجسم أو الشعر) بالماء الفاتر وغسول مناسب، ثم جففي بلطف بطريقة الطبطبة.
                  </p>
                </div>

                <div className="rounded-xl border border-gold/30 bg-gold/5 p-4 space-y-2 hover:border-gold/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-white shadow-xs">
                      2
                    </span>
                    <Droplets className="h-4 w-4 text-gold" />
                  </div>
                  <h4 className="text-sm font-bold text-luxury-white">الخطوة الثانية: التطبيق الصحيح</h4>
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    ضعي كمية مناسبة من المنتج ووزعيها بحركات دائرية خفيفة من الأسفل للأعلى حتى تتشربها البشرة بالكامل.
                  </p>
                </div>

                <div className="rounded-xl border border-luxury-border/30 bg-premium-black p-4 space-y-2 hover:border-gold/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-xs font-bold text-white shadow-xs">
                      3
                    </span>
                    <Sparkles className="h-4 w-4 text-luxury-muted" />
                  </div>
                  <h4 className="text-sm font-bold text-luxury-white">الخطوة الثالثة: النتيجة والاستمرار</h4>
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    استخدمي المنتج بانتظام يومياً صباحاً أو مساءً حسب الروتين لتحصلي على أفضل نتائج مرئية وملموسة وسريعة.
                  </p>
                </div>
              </div>

              {/* Custom Specific Usage Tips if Available */}
              <div className="rounded-xl border border-gold/20 bg-surface-elevated/60 p-4 sm:p-5">
                <h4 className="text-xs sm:text-sm font-bold text-gold mb-2 flex items-center gap-2">
                  <span>💡 نصائح ذهبية لنتائج استثنائية:</span>
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-luxury-muted list-disc list-inside">
                  <li>يُفضل إجراء اختبار حساسية بسيط على جزء صغير من الجلد قبل الاستخدام للمرة الأولى.</li>
                  <li>احفظي المنتج في مكان بارد وجاف بعيداً عن أشعة الشمس المباشرة للحفاظ على فعالية التركيبة.</li>
                  <li>في حال استخدامه صباحاً مع منتجات العناية بالبشرة، يُنصح دائماً بوضع واقي الشمس بعده.</li>
                </ul>
              </div>
            </motion.div>
          )}

          {activeTab === "shipping" && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-luxury-border/30 bg-premium-black p-4 space-y-2">
                  <h4 className="text-sm font-bold text-luxury-white flex items-center gap-2">
                    <Truck className="h-4 w-4 text-gold" />
                    <span>الشحن والتوصيل لكافة المحافظات</span>
                  </h4>
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    نوفر شحناً سريعاً وموثوقاً لجميع محافظات جمهورية مصر العربية (القاهرة، الجيزة، الإسكندرية، محافظات الدلتا والصعيد) خلال 2 إلى 4 أيام عمل.
                  </p>
                </div>

                <div className="rounded-xl border border-luxury-border/30 bg-premium-black p-4 space-y-2">
                  <h4 className="text-sm font-bold text-luxury-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-gold" />
                    <span>طرق الدفع السهلة والمريحة</span>
                  </h4>
                  <p className="text-xs text-luxury-muted leading-relaxed">
                    يمكنك الدفع نقداً عند استلام طلبك (COD)، أو التحويل السريع عبر محافظ فودافون كاش أو شبكة المدفوعات اللحظية InstaPay.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-xs text-luxury-muted leading-relaxed">
                <strong className="text-luxury-white block mb-1">🛡️ ضمان الجودة والإرجاع:</strong>
                نلتزم بتقديم منتجات أصلية 100%، وتتيح سياسة متجرنا فحص المنتج عند الاستلام مع إمكانية الاستبدال والاسترجاع وفق الشروط والضوابط.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
