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
import { Percent } from "lucide-react";

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
  const [discountPercentInput, setDiscountPercentInput] = useState<string>("");

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
      status: product?.status ?? "published",
      is_featured: product?.is_featured ?? false,
      is_best_seller: product?.is_best_seller ?? false,
      is_new_arrival: product?.is_new_arrival ?? false,
      is_on_sale: product?.is_on_sale ?? Boolean(product?.compare_at_price && product.compare_at_price > product.price),
      meta_title: product?.meta_title ?? "",
      meta_description: product?.meta_description ?? "",
    },
  });

  const name = watch("name");
  const currentPrice = watch("price");
  const currentComparePrice = watch("compare_at_price");

  const applyDiscountPercentage = (pct: number) => {
    if (pct <= 0 || pct >= 100) return;
    const basePrice = currentComparePrice && currentComparePrice > 0 ? currentComparePrice : currentPrice;
    if (!basePrice || basePrice <= 0) return;

    const newCompareAtPrice = basePrice;
    const newPrice = Math.round(basePrice * (1 - pct / 100) * 100) / 100;

    setValue("compare_at_price", newCompareAtPrice);
    setValue("price", newPrice);
    setValue("is_on_sale", true);
  };

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
        <div className="rounded-luxury border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400 font-semibold">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية للمنتج (Basic Info)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="اسم المنتج (English Name)"
                {...register("name")}
                error={errors.name?.message}
                placeholder="ANUA Niacinamide 10% + TXA 4% Serum"
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
                <Input label="المعرف المباشر (Slug)" {...register("slug")} error={errors.slug?.message} />
                <Input label="رمز كود المنتج (SKU)" {...register("sku")} error={errors.sku?.message} />
              </div>
              <Textarea
                label="الوصف المختصر (باللغة العربية)"
                {...register("short_description")}
                placeholder="سيروم نياشيناميد لتفتيح البشرة وتوحيد لونها..."
                error={errors.short_description?.message}
              />
              <Textarea
                label="الوصف الشامل والتفصيلي للمنتج (باللغة العربية)"
                {...register("description")}
                placeholder="تفاصيل المكونات، كيفية الاستخدام، الفوائد..."
                error={errors.description?.message}
                rows={5}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>صور المنتج (Images)</CardTitle>
            </CardHeader>
            <CardContent>
              <ImageUploader
                value={product?.images?.map((i) => i.url) ?? []}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>إعدادات محركات البحث (SEO)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="عنوان البحث (Meta Title)" {...register("meta_title")} />
              <Textarea label="وصف البحث (Meta Description)" {...register("meta_description")} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>السعر وتفاصيل الخصم والمخزون</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="السعر الحالي بعد الخصم (Sale Price EGP)"
                type="number"
                step="0.01"
                {...register("price")}
                error={errors.price?.message}
              />
              <Input
                label="السعر قبل الخصم (Original / Compare at Price EGP)"
                type="number"
                step="0.01"
                {...register("compare_at_price")}
              />

              {/* Discount Calculator Helper */}
              <div className="rounded-luxury border border-gold/30 bg-gold-tint/50 p-3 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gold">
                  <Percent className="h-4 w-4" />
                  <span>تطبيق نسبة خصم سريعة (%)</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="مثال: 20%"
                    value={discountPercentInput}
                    onChange={(e) => setDiscountPercentInput(e.target.value)}
                    className="w-full rounded-luxury border border-luxury-border/40 bg-white px-3 py-1.5 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="shrink-0 text-xs font-bold border border-luxury-border/50"
                    onClick={() => {
                      const pct = Number(discountPercentInput);
                      if (pct > 0) applyDiscountPercentage(pct);
                    }}
                  >
                    حساب الخصم
                  </Button>
                </div>
                <p className="text-[11px] text-luxury-muted">
                  سيتم وضع السعر الحالي كسعر قبل الخصم وحساب السعر الجديد تلقائياً.
                </p>
              </div>

              <Input
                label="كمية المخزون (Stock Quantity)"
                type="number"
                {...register("stock_quantity")}
                error={errors.stock_quantity?.message}
              />
              <Input
                label="حد التنبيه للمخزون القليل (Low Stock Threshold)"
                type="number"
                {...register("low_stock_threshold")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>التصنيف والماركة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="الماركة (Brand)"
                placeholder="اختر الماركة"
                options={brands.map((b) => ({ value: b.id, label: b.name }))}
                {...register("brand_id")}
              />
              <Select
                label="الفئة (Category)"
                placeholder="اختر الفئة"
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                {...register("category_id")}
              />
              <Select
                label="حالة النشر"
                options={[
                  { value: "published", label: "منشور بالمتجر (Published)" },
                  { value: "draft", label: "مسودة (Draft)" },
                  { value: "archived", label: "مؤرشف (Archived)" },
                ]}
                {...register("status")}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>شارات وتمييز المنتج</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(
                [
                  ["is_on_sale", "منتج عليه خصم وتخفيض (On Sale)"],
                  ["is_featured", "منتج مميز (Featured)"],
                  ["is_best_seller", "الأكثر مبيعاً (Best Seller)"],
                  ["is_new_arrival", "وصل حديثاً (New Arrival)"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    {...register(key)}
                    className="rounded accent-gold"
                  />
                  <span className="text-luxury-muted font-medium">{label}</span>
                </label>
              ))}
            </CardContent>
          </Card>

          <Button type="submit" loading={isPending} className="w-full font-bold shadow-md glow-purple py-6 text-base">
            {product ? "تحديث حفظ التعديلات" : "إضافة المنتج للمتجر"}
          </Button>
        </div>
      </div>
    </form>
  );
}
