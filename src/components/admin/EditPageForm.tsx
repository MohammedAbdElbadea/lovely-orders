"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Page } from "@/types/domain.types";

const pageSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  status: z.enum(["draft", "scheduled", "active", "expired"]),
});

type PageFormValues = z.infer<typeof pageSchema>;

interface EditPageFormProps {
  page: Page;
}

export function EditPageForm({ page }: EditPageFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<PageFormValues>({
    resolver: zodResolver(pageSchema),
    defaultValues: {
      title: page.title,
      slug: page.slug,
      content: page.content ?? "",
      meta_title: page.meta_title ?? "",
      meta_description: page.meta_description ?? "",
      status: page.status,
    },
  });

  const onSubmit = (data: PageFormValues) => {
    setError(null);
    startTransition(async () => {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("pages")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", page.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }
      router.push("/admin/cms/pages");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-4 rounded-luxury border border-luxury-border/30 bg-premium-black p-6">
      {error && (
        <div className="rounded-luxury border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      <Input label="Title" {...register("title")} />
      <Input label="Slug" {...register("slug")} />
      <Textarea label="Content (HTML)" {...register("content")} rows={12} />
      <Input label="Meta Title" {...register("meta_title")} />
      <Textarea label="Meta Description" {...register("meta_description")} />
      <Select
        label="Status"
        options={[
          { value: "draft", label: "Draft" },
          { value: "scheduled", label: "Scheduled" },
          { value: "active", label: "Active" },
          { value: "expired", label: "Expired" },
        ]}
        {...register("status")}
      />
      <Button type="submit" loading={isPending}>Save Page</Button>
    </form>
  );
}
