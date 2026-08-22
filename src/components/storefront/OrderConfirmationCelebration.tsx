"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import { CheckCircle2, Copy, Check, Sparkles, Truck, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { formatPrice } from "@/lib/utils";
import { STORE_NAME, PAYMENT_NUMBER } from "@/lib/constants";
import Link from "next/link";

interface OrderConfirmationCelebrationProps {
  orderNumber: string;
  token?: string;
  totalAmount?: number | string | null;
}

export function OrderConfirmationCelebration({
  orderNumber,
  token,
  totalAmount,
}: OrderConfirmationCelebrationProps) {
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedPayment, setCopiedPayment] = useState(false);

  useEffect(() => {
    // Launch celebratory fireworks confetti
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ["#D4AF37", "#F3E5AB", "#AA7C11", "#9333EA", "#E9D5FF", "#10B981"],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedNumber(true);
    toast.success("تم نسخ رقم الطلب بنجاح! 📋", {
      description: orderNumber,
    });
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  const copyPaymentNumber = () => {
    navigator.clipboard.writeText(PAYMENT_NUMBER);
    setCopiedPayment(true);
    toast.success("تم نسخ رقم التحويل (فودافون كاش / انستا باي)! 💳", {
      description: PAYMENT_NUMBER,
    });
    setTimeout(() => setCopiedPayment(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-16 text-center sm:px-6 lg:px-8 animate-fade-in">
      {/* Animated Checkmark Circle */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="mx-auto flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 shadow-xl"
      >
        <CheckCircle2 className="h-12 w-12 sm:h-14 sm:w-14" />
      </motion.div>

      {/* Main Headline */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h1 className="mt-6 font-display text-2xl sm:text-4xl font-bold tracking-wide text-luxury-white">
          تهانينا! تم تأكيد طلبك بنجاح 🎉
        </h1>
        <p className="mt-2 text-sm sm:text-base text-luxury-muted">
          شكراً لتسوقك من <strong className="text-gold font-semibold">{STORE_NAME}</strong>. نحن نجهز طلبك بكل حب وعناية.
        </p>
      </motion.div>

      {/* Order Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="mt-8 rounded-2xl border border-luxury-border/30 bg-surface-elevated/60 p-5 sm:p-8 text-right shadow-2xl backdrop-blur-md"
      >
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-luxury-border/20 pb-4">
            <div>
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-gold font-semibold">
                رقم الطلب (Order Number)
              </p>
              <p className="mt-1 font-mono text-lg sm:text-2xl font-bold text-luxury-white">
                {orderNumber}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyOrderNumber}
              className="gap-1.5 text-xs h-9"
            >
              {copiedNumber ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copiedNumber ? "تم النسخ" : "نسخ الرقم"}</span>
            </Button>
          </div>

          {totalAmount && (
            <div className="border-b border-luxury-border/20 pb-4">
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-gold font-semibold">
                المبلغ الإجمالي المطلوب
              </p>
              <p className="mt-1 font-display text-xl sm:text-2xl font-bold text-gold font-mono">
                {formatPrice(Number(totalAmount), "EGP", "en-EG")}
              </p>
            </div>
          )}

          {token && (
            <div className="border-b border-luxury-border/20 pb-4">
              <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-gold font-semibold">
                رمز تتبع الطلب السري
              </p>
              <p className="mt-1 break-all font-mono text-xs sm:text-sm text-luxury-muted bg-premium-black p-2.5 rounded-lg">
                {token}
              </p>
            </div>
          )}
        </div>

        {/* Payment & Transfer Guide */}
        <div className="mt-6 rounded-xl border border-gold/30 bg-gold/5 p-4 sm:p-5 space-y-3">
          <p className="text-sm font-bold text-gold flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span>خطوات إتمام الدفع وتأكيد الشحن:</span>
          </p>
          <ol className="list-decimal space-y-2 pr-5 text-xs sm:text-sm text-gray-200 leading-relaxed">
            <li>
              إذا اخترت الدفع عبر المحفظة الإلكترونية أو InstaPay، يرجى تحويل مبلغ{" "}
              <strong className="text-gold font-bold">{totalAmount ? formatPrice(Number(totalAmount)) : "الطلب"}</strong>{" "}
              إلى الرقم:
              <div className="mt-2 flex items-center gap-2 bg-premium-black/80 px-3 py-2 rounded-lg border border-gold/20 w-fit">
                <span className="font-mono text-sm sm:text-base font-bold text-luxury-white">{PAYMENT_NUMBER}</span>
                <button
                  type="button"
                  onClick={copyPaymentNumber}
                  className="text-gold hover:text-gold-hover p-1"
                  title="نسخ رقم التحويل"
                >
                  {copiedPayment ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </li>
            <li>
              يرجى كتابة رقم الطلب (<strong className="text-gold font-mono">{orderNumber}</strong>) في خانة الملاحظات أثناء التحويل.
            </li>
            <li>
              إذا اخترت <strong>الدفع عند الاستلام</strong>، سيتم التواصل معك هاتفياً لتأكيد الشحن فوراً.
            </li>
          </ol>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
        {token && (
          <Link
            href={`/track-order?orderNumber=${encodeURIComponent(orderNumber)}&token=${encodeURIComponent(token)}`}
            className="w-full sm:w-auto"
          >
            <Button variant="secondary" className="w-full h-11 px-6 text-sm font-semibold gap-2">
              <Truck className="h-4 w-4 text-gold" />
              تتبع مسار شحنتك
            </Button>
          </Link>
        )}
        <Link href="/products" className="w-full sm:w-auto">
          <Button className="w-full h-11 px-6 text-sm font-semibold">
            متابعة التسوق 🛍️
          </Button>
        </Link>
      </div>
    </div>
  );
}
