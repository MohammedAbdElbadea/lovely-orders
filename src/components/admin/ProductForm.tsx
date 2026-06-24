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
import { ImageUploader } from "@/components/admin/ImageUploader";
import { createProduct, updateProduct } from "@/app/actions/admin/products";
import type { Product, Brand, Category } from "@/types/domain.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  sku: z.string().min(1, "SKU is required"),
  price: z.coerce.number().min(0),
  compare_at_price: z.coerce.number().optional().nullable(),
  stock_quantity: z.coerce.number().int().min(0),
  low_stock_threshold: z.coerce.number().int().min(0),
  brand_id: z.string().optional(),
  category_id: z.string().optional(),
  description: z.string().optional(),
  short_description: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  is_featured: z.boolean().optional(),
  is_best_seller: z.boolean().optional(),
  is_new_arrival: z.boolean().optional(),
  is_on_sale: z.boolean().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product;
  brands: Brand[];
  categories: Category[];
}

export function ProductForm({ product, brands, categories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      sku: product?.sku ?? "",
      price: product?.price ?? 0,
      compare_at_price: product?.compare_at_price ?? undefined,
      stock_quantity: product?.stock_quantity ?? 0,
      low_stock_threshold: product?.low_stock_threshold ?? 5,
      brand_id: product?.brand_id ?? "",
      category_id: product?.category_id ?? "",
      description: product?.description ?? "",
      short_description: product?.short_description ?? "",
      status: product?.status ?? "draft",
      is_featured: product?.is_featured ?? false,
      is_best_seller: product?.is_best_seller ?? false,
      is_new_arrival: product?.is_new_arrival ?? false,
      is_on_sale: product?.is_on_sale ?? false,
      meta_title: product?.meta_title ?? "",
      meta_description: product?.meta_description ?? "",
    },
  });

  const name = watch("name");

  const onSubmit = (data: ProductFormValues) => {
    setError(null);
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push("/admin/products");
      router.refresh();
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-luxury border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Product Name"
                {...register("name")}
                error={errors.name?.message}
                onBlur={() => {
                  if (!product && name && !watch("slug")) {
                    setValue(
                      "slug",
                      name
                        .toLowerCase()
                        .replace(/[^\w\s-]/g, "")
                        .replace(/[\s_-]+/g, "-")
                    );
                  }
                }}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Slug" {...register("slug")} error={errors.slug?.message} />
                <Input label="SKU" {...register("sku")} error={errors.sku?.message} />
              </div>
              <Textarea
                label="Short Description"
                {...register("short_description")}
                error={errors.short_description?.message}
              />
              <Textarea
                label="Description"
                {...register("description")}
                error={errors.description?.message}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Images</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={product?.images?.map((i) => i.url) ?? []}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Meta Title" {...register("meta_title")} />
              <Textarea label="Meta Description" {...register("meta_description")} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Price"
                type="number"
                step="0.01"
                {...register("price")}
                error={errors.price?.message}
              />
              <Input
                label="Compare at Price"
                type="number"
                step="0.01"
                {...register("compare_at_price")}
              />
              <Input
                label="Stock Quantity"
                type="number"
                {...register("stock_quantity")}
                error={errors.stock_quantity?.message}
              />
              <Input
                label="Low Stock Threshold"
                type="number"
                {...register("low_stock_threshold")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="Brand"
                placeholder="Select brand"
                options={brands.map((b) => ({ value: b.id, label: b.name }))}
                {...register("brand_id")}
              />
              <Select
                label="Category"
                placeholder="Select category"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                {...register("category_id")}
              />
              <Select
                label="Status"
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                  { value: "archived", label: "Archived" },
                ]}
                {...register("status")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(
                [
                  ["is_featured", "Featured"],
                  ["is_best_seller", "Best Seller"],
                  ["is_new_arrival", "New Arrival"],
                  ["is_on_sale", "On Sale"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    {...register(key)}
                    className="rounded accent-gold"
                  />
                  <span className="text-luxury-muted">{label}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          <Button type="submit" loading={isPending} className="w-full">
            {product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
