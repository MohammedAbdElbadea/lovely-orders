"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STORE_TAGLINE } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
}

export function HeroSection({
  title,
  subtitle,
  ctaText,
  ctaHref = "/products",
  secondaryCtaText,
  secondaryCtaHref = "/brands",
}: HeroSectionProps) {
  const { t } = useTranslation();

  const displayTitle = title || t.storefront.heroTitle;
  const displaySubtitle = subtitle || t.storefront.heroSubtitle || STORE_TAGLINE;
  const displayCtaText = ctaText || t.storefront.shopNow;
  const displaySecondaryCtaText = secondaryCtaText || t.common.viewAll;

  const features = [
    {
      icon: ShieldCheck,
      title: "منتجات أصلية 100%",
      desc: "ضمان الفخامة والجودة من الماركات العالمية",
    },
    {
      icon: Truck,
      title: "توصيل سريع لكافة المحافظات",
      desc: "شحن آمن مع إمكانية المعاينة قبل الاستلام",
    },
    {
      icon: CreditCard,
      title: "الدفع عند الاستلام & فودافون كاش",
      desc: "طرق دفع مرنة وسهلة تناسب الجميع",
    },
  ];

  return (
    <section className="relative overflow-hidden border-b border-luxury-border/30 bg-gradient-to-b from-deep-black via-surface-elevated/30 to-deep-black py-16 sm:py-24 lg:py-32">
      {/* Animated Ambient Glow Accents */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-[600px] -translate-x-1/2 rounded-full bg-gold/15 blur-3xl animate-glow-pulse" />
      <div className="pointer-events-none absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-rose-ruby/10 blur-2xl animate-float-slow" />
      <div className="pointer-events-none absolute bottom-10 left-10 h-64 w-64 rounded-full bg-gold/10 blur-2xl animate-float" />

      {/* Floating Sparkle Decorative Orbs */}
      <div className="pointer-events-none absolute top-12 left-1/4 hidden lg:block animate-float">
        <Sparkles className="h-6 w-6 text-gold/40" />
      </div>
      <div className="pointer-events-none absolute bottom-24 right-1/4 hidden lg:block animate-float-slow">
        <Sparkles className="h-8 w-8 text-gold/30" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          {/* Top Sparkling Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-tint/80 px-4 py-1.5 backdrop-blur-md shadow-xs mb-6 hover:border-gold/60 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-gold animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              ✨ التشكيلة الفاخرة والأحدث لعام 2026 ✨
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="font-display text-4xl leading-tight text-luxury-white sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-luxury-white via-gold to-luxury-white bg-clip-text text-transparent"
          >
            {displayTitle}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-luxury-muted sm:text-xl font-normal"
          >
            {displaySubtitle}
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href={ctaHref} className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto font-semibold shadow-md hover-lift glow-purple px-8 py-6 text-base">
                {displayCtaText}
              </Button>
            </Link>
            <Link href={secondaryCtaHref} className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto font-medium hover-lift border border-luxury-border/50 px-8 py-6 text-base">
                {displaySecondaryCtaText}
              </Button>
            </Link>
          </motion.div>

          {/* Trust Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
            className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 pt-10 border-t border-luxury-border/30"
          >
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="group flex flex-col items-center rounded-luxury border border-luxury-border/20 bg-white/60 p-5 text-center backdrop-blur-xs transition-all duration-300 hover:border-gold/50 hover:bg-white hover-lift shadow-xs"
                >
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold-tint text-gold transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-luxury-white">
                    {feat.title}
                  </h3>
                  <p className="mt-1 text-xs text-luxury-muted">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
