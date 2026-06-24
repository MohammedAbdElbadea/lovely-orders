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
      if (result.success) setMessage("Settings saved successfully");
      else setError(result.error);
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-2">
      {message && (
        <div className="lg:col-span-2 rounded-luxury border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {message}
        </div>
      )}
      {error && (
        <div className="lg:col-span-2 rounded-luxury border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <Card>
        <CardHeader><CardTitle>Store Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input label="Store Name" {...register("storeName")} />
          <Input label="Phone" {...register("storePhone")} />
          <Input label="Email" type="email" {...register("storeEmail")} />
          <Input
            label="Low Stock Threshold"
            type="number"
            {...register("lowStockThreshold")}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Payment Settings</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Vodafone Cash Number"
            {...register("vodafoneNumber")}
            hint="Number customers send payments to"
          />
          <Input
            label="InstaPay Number"
            {...register("instapayNumber")}
            hint="InstaPay account for receiving payments"
          />
        </CardContent>
      </Card>

      <div className="lg:col-span-2">
        <Button type="submit" loading={isPending}>Save Settings</Button>
      </div>
    </form>
  );
}
