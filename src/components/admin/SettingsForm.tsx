"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateSettings } from "@/app/actions/admin/settings";

const settingsSchema = z.object({
  storeName: z.string().min(1),
  storePhone: z.string().optional(),
  storeEmail: z.string().email().optional().or(z.literal("")),
  vodafoneNumber: z.string().optional(),
  instapayNumber: z.string().optional(),
  lowStockThreshold: z.coerce.number().int().min(0),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

interface SettingsFormProps {
  initial: SettingsFormValues;
}

export function SettingsForm({ initial }: SettingsFormProps) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initial,
  });

  const onSubmit = (data: SettingsFormValues) => {
    setMessage(null);
    setError(null);
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, String(v)));

    startTransition(async () => {
      const result = await updateSettings(formData);
      if (result.success) setMessage("تم حفظ وتحديث الإعدادات بنجاح ✅");
      else setError(result.error ?? "حدث خطأ أثناء الحفظ");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-2 max-w-full">
      {message && (
        <div className="lg:col-span-2 rounded-luxury border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-xs sm:text-sm font-semibold text-emerald-400 animate-fade-in">
          {message}
        </div>
      )}
      {error && (
        <div className="lg:col-span-2 rounded-luxury border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs sm:text-sm font-semibold text-red-400 animate-fade-in">
          {error}
        </div>
      )}

      <Card className="border-luxury-border/30 bg-surface-elevated/40">
        <CardHeader className="p-4 sm:p-6"><CardTitle className="text-base sm:text-lg">بيانات المتجر الأساسية (Store Info)</CardTitle></CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
          <Input label="اسم المتجر (Store Name)" {...register("storeName")} />
          <Input label="رقم الهاتف والتواصل (Phone)" {...register("storePhone")} />
          <Input label="البريد الإلكتروني الرسمي (Email)" type="email" {...register("storeEmail")} />
          <Input
            label="حد تنبيه انخفاض المخزون (Low Stock Threshold)"
            type="number"
            {...register("lowStockThreshold")}
          />
        </CardContent>
      </Card>

      <Card className="border-luxury-border/30 bg-surface-elevated/40">
        <CardHeader className="p-4 sm:p-6"><CardTitle className="text-base sm:text-lg">إعدادات أرقام الدفع والتحويل 💳</CardTitle></CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
          <Input
            label="رقم محفظة فودافون كاش (Vodafone Cash)"
            {...register("vodafoneNumber")}
            hint="الرقم الذي يحول عليه العملاء عند الدفع بفودافون كاش"
          />
          <Input
            label="رقم حساب انستا باي (InstaPay)"
            {...register("instapayNumber")}
            hint="الرقم / المعرف المخصص لاستقبال تحويلات InstaPay"
          />
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Button type="submit" loading={isPending} className="w-full sm:w-auto h-11 px-8 text-sm font-semibold">
          حفظ الإعدادات
        </Button>
      </div>
    </form>
  );
}
