"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Tag, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/stores/cart-store";
import { createOrderAction } from "@/app/actions/orders";
import { validateCouponAction } from "@/app/actions/coupons";
import { formatPrice } from "@/lib/utils";
import { PAYMENT_NUMBER, PAYMENT_METHODS } from "@/lib/constants";

interface AppliedCoupon {
  code: string;
  couponId: string;
  discountAmount: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const cartSubtotal = subtotal();
  const [state, formAction, pending] = useActionState(createOrderAction, null);

  const [promoInput, setPromoInput] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);

  useEffect(() => {
    if (state?.success && state.orderNumber && state.trackingToken) {
      clearCart();
      router.push(
        `/order-confirmation/${state.orderNumber}?token=${state.trackingToken}`
      );
    }
  }, [state, clearCart, router]);

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    setPromoLoading(true);
    setPromoError(null);

    const res = await validateCouponAction(promoInput, cartSubtotal);
    setPromoLoading(false);

    if (res.success && res.couponId && res.code && res.discountAmount !== undefined) {
      setAppliedCoupon({
        code: res.code,
        couponId: res.couponId,
        discountAmount: res.discountAmount,
      });
      setPromoError(null);
    } else {
      setPromoError(res.error ?? "كود الخصم غير صالح");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setPromoInput("");
    setPromoError(null);
  };

  if (items.length === 0 && !state?.success) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mx-auto h-16 w-16 text-luxury-muted/30" />
        <h1 className="mt-6 font-display text-3xl tracking-wide">إتمام الطلب - Checkout</h1>
        <p className="mt-2 text-luxury-muted">سلة المشتريات فارغة حالياً</p>
        <Link href="/products" className="mt-8 inline-block">
          <Button size="lg">تصفح المنتجات</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl tracking-wide sm:text-4xl">
        إتمام الشراء والطلب — Checkout
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <form action={formAction} className="space-y-6">
          <input
            type="hidden"
            name="items"
            value={JSON.stringify(items)}
          />
          {appliedCoupon && (
            <>
              <input type="hidden" name="couponCode" value={appliedCoupon.code} />
              <input type="hidden" name="couponId" value={appliedCoupon.couponId} />
              <input type="hidden" name="discountAmount" value={appliedCoupon.discountAmount} />
            </>
          )}

          <div className="rounded-luxury border border-luxury-border/30 bg-white p-6 space-y-4 shadow-xs">
            <h2 className="font-display text-lg font-bold tracking-wide text-luxury-white">
              بيانات العميل والتوصيل
            </h2>
            <Input name="guestName" label="الاسم بالكامل" required placeholder="مثال: أحمد محمد" />
            <Input
              name="guestPhone"
              label="رقم الهاتف"
              type="tel"
              required
              placeholder="01XXXXXXXXX"
            />
            <Textarea
              name="guestAddress"
              label="عنوان التوصيل بالتفصيل"
              required
              rows={3}
              placeholder="اسم الشارع، رقم العمارة، الشقة، المنطقة، المحافظة..."
            />
          </div>

          <div className="rounded-luxury border border-luxury-border/30 bg-white p-6 space-y-4 shadow-xs">
            <h2 className="font-display text-lg font-bold tracking-wide text-luxury-white">
              طريقة الدفع المناسبة
            </h2>

            <label className="flex cursor-pointer items-start gap-3 rounded-luxury border border-luxury-border/30 p-4 transition-colors hover:border-gold/40 has-[:checked]:border-gold has-[:checked]:bg-gold-tint/50">
              <input
                type="radio"
                name="paymentMethod"
                value={PAYMENT_METHODS.COD}
                defaultChecked
                className="mt-1 accent-gold"
              />
              <div>
                <p className="font-bold text-luxury-white">الدفع عند الاستلام (Cash on Delivery)</p>
                <p className="mt-1 text-xs text-luxury-muted">
                  ادفع نقداً لمندوب التوصيل فور معاينة واستلام طلبك
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-luxury border border-luxury-border/30 p-4 transition-colors hover:border-gold/40 has-[:checked]:border-gold has-[:checked]:bg-gold-tint/50">
              <input
                type="radio"
                name="paymentMethod"
                value={PAYMENT_METHODS.VODAFONE_CASH}
                className="mt-1 accent-gold"
              />
              <div>
                <p className="font-bold text-luxury-white">فودافون كاش (Vodafone Cash)</p>
                <p className="mt-1 text-xs text-luxury-muted">
                  تحويل على رقم المحفظة:{" "}
                  <span className="font-mono text-gold font-bold">{PAYMENT_NUMBER}</span>
                </p>
              </div>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-luxury border border-luxury-border/30 p-4 transition-colors hover:border-gold/40 has-[:checked]:border-gold has-[:checked]:bg-gold-tint/50">
              <input
                type="radio"
                name="paymentMethod"
                value={PAYMENT_METHODS.INSTAPAY}
                className="mt-1 accent-gold"
              />
              <div>
                <p className="font-bold text-luxury-white">إنستاباي (InstaPay)</p>
                <p className="mt-1 text-xs text-luxury-muted">
                  تحويل سريع على الرقم:{" "}
                  <span className="font-mono text-gold font-bold">{PAYMENT_NUMBER}</span>
                </p>
              </div>
            </label>

            <div className="rounded-luxury border border-gold/30 bg-gold-tint/60 p-4 space-y-2">
              <p className="text-xs font-bold text-gold">تعليمات تأكيد الطلب</p>
              <ul className="list-disc space-y-1 pl-4 text-xs text-luxury-muted leading-relaxed">
                <li>عند اختيار <strong>الدفع عند الاستلام</strong>، سيتم تجهيز وشحن الطلب فوراً.</li>
                <li>عند اختيار <strong>فودافون كاش / إنستاباي</strong>، يرجى تحويل المبلغ ({formatPrice(finalTotal)}) للرقم <strong className="text-luxury-white">{PAYMENT_NUMBER}</strong> وإدخال رقم العملية كمرجع لتأكيد الشحن فوراً.</li>
              </ul>
            </div>

            <Input
              name="paymentReference"
              label="رقم تحويل المحفظة / مرجع الدفع (اختياري للتحويلات الرقمية)"
              placeholder="رقم العملية أو اسم المحول"
            />
          </div>

          {state?.error && (
            <p className="text-sm font-semibold text-red-500 bg-red-50 p-3 rounded-luxury border border-red-200" role="alert">
              {state.error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full font-bold py-6 text-base shadow-md hover-lift glow-purple" loading={pending}>
            تأكيد وإرسال الطلب — {formatPrice(finalTotal)}
          </Button>
        </form>

        <aside className="space-y-6">
          {/* Promo Code Card */}
          <div className="rounded-luxury border border-luxury-border/30 bg-white p-6 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-gold" />
              <h3 className="font-display text-base font-bold text-luxury-white">
                كود الخصم (Promo Code)
              </h3>
            </div>

            {appliedCoupon ? (
              <div className="flex items-center justify-between rounded-luxury border border-emerald-300 bg-emerald-50 p-3">
                <div className="flex items-center gap-2 text-emerald-800">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span className="text-sm font-bold">
                    تم تطبيق الكود: <span className="font-mono">{appliedCoupon.code}</span> (-{formatPrice(appliedCoupon.discountAmount)})
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-900"
                  onClick={handleRemoveCoupon}
                  aria-label="Remove coupon"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <Input
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="أدخل كود الخصم مثل: LOVELY10"
                  className="uppercase font-mono tracking-wider"
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="shrink-0 font-semibold border border-luxury-border/50"
                  loading={promoLoading}
                >
                  تطبيق
                </Button>
              </form>
            )}

            {promoError && (
              <p className="mt-2 text-xs font-semibold text-red-500">
                {promoError}
              </p>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="rounded-luxury border border-luxury-border/30 bg-white p-6 shadow-xs h-fit">
            <h2 className="font-display text-lg font-bold tracking-wide text-luxury-white">ملخص الطلب</h2>
            <ul className="mt-6 space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId ?? "default"}`}
                  className="flex justify-between gap-4 text-sm"
                >
                  <span className="text-luxury-muted">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-luxury-white">{formatPrice(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 border-t border-luxury-border/20 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-luxury-muted">
                <span>المجموع الفرعي (Subtotal):</span>
                <span>{formatPrice(cartSubtotal)}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-sm font-semibold text-emerald-600">
                  <span>خصم البروموكود ({appliedCoupon.code}):</span>
                  <span>-{formatPrice(appliedCoupon.discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between border-t border-luxury-border/20 pt-3">
                <span className="font-bold text-luxury-white">الإجمالي النهائـي (Total):</span>
                <span className="font-display text-2xl font-bold text-gold">
                  {formatPrice(finalTotal)}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
