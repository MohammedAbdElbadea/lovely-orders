"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

const brandSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
});

type BrandFormValues = z.infer<typeof brandSchema>;

export default function NewBrandPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: { is_active: true },
  });

  const onSubmit = (data: BrandFormValues) => {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("brands").insert({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        is_active: data.is_active,
      });
      if (insertError) {
        setError(insertError.message);
        return;
      }
      router.push("/admin/brands");
      router.refresh();
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">New Brand</h1>
        <p className="text-sm text-luxury-muted">Add a new brand to your store</p>
      </div>

      {error && (
        <div className="rounded-luxury border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-luxury border border-luxury-border/30 bg-premium-black p-6">
        <Input label="Name" {...register("name")} error={errors.name?.message} />
        <Input label="Slug" {...register("slug")} error={errors.slug?.message} />
        <Textarea label="Description" {...register("description")} />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register("is_active")} className="accent-gold" defaultChecked />
          <span className="text-luxury-muted">Active</span>
        </label>
        <Button type="submit" loading={isPending}>Create Brand</Button>
      </form>
    </div>
  );
}
