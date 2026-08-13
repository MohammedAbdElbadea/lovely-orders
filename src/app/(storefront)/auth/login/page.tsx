"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginCustomerAction } from "@/app/actions/customer-auth";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await loginCustomerAction({ email, password });
    setLoading(false);

    if (res.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(res.error ?? "فشل تسجيل الدخول. يرجى التأكد من البيانات.");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-luxury border border-luxury-border/30 bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl tracking-wide text-luxury-white">
            تسجيل الدخول
          </h1>
          <p className="mt-2 text-sm text-luxury-muted">
            مرحباً بك مجدداً في تجربتك الفاخرة للتسوق
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="البريد الإلكتروني أو رقم الهاتف"
            type="text"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
          />

          <Input
            label="كلمة المرور (اختياري للعملاء الجدد)"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && (
            <p className="text-sm text-red-500 text-center" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            تسجيل الدخول
          </Button>

          <div className="mt-6 text-center text-xs text-luxury-muted space-y-2">
            <p>
              ليس لديك حساب؟{" "}
              <Link href="/auth/register" className="text-gold font-semibold hover:underline">
                إنشاء حساب جديد
              </Link>
            </p>
            <p>
              أو يمكنك الشراء كضيف مباشرة من{" "}
              <Link href="/checkout" className="text-gold font-semibold hover:underline">
                صفحة الطلب
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
