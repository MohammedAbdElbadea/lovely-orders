"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { registerCustomerAction } from "@/app/actions/customer-auth";

export default function CustomerRegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await registerCustomerAction({ fullName, phone, email, password });
    setLoading(false);

    if (res.success) {
      router.push("/");
      router.refresh();
    } else {
      setError(res.error ?? "حدث خطأ أثناء إنشاء الحساب. يرجى التأكد من البيانات.");
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="rounded-luxury border border-luxury-border/30 bg-white p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl tracking-wide text-luxury-white">
            إنشاء حساب جديد
          </h1>
          <p className="mt-2 text-sm text-luxury-muted">
            سجّل حسابك للاستفادة من تجربة شراء أسرع وعروض حصرية
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="الاسم بالكامل"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="الاسم الثلاثي"
          />

          <Input
            label="رقم الهاتف"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="01XXXXXXXXX"
          />

          <Input
            label="البريد الإلكتروني"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
          />

          <Input
            label="كلمة المرور"
            type="password"
            required
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
            إنشاء الحساب
          </Button>

          <div className="mt-6 text-center text-xs text-luxury-muted">
            لديك حساب بالفعل؟{" "}
            <Link href="/auth/login" className="text-gold font-semibold hover:underline">
              تسجيل الدخول
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
