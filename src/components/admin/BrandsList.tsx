"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Tag, X } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBrandAction, deleteBrandAction } from "@/app/actions/admin/catalog";
import type { Brand } from "@/types/domain.types";

interface BrandsListProps {
  brands: Brand[];
}

export function BrandsList({ brands: initialBrands }: BrandsListProps) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/\s+/g, "-")) {
      setSlug(val.toLowerCase().trim().replace(/[^\w\u0600-\u06FF\s-]/g, "").replace(/\s+/g, "-"));
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await createBrandAction({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        description: description || null,
        sort_order: parseInt(sortOrder) || 0,
        is_active: isActive,
      });

      if (res.success && res.brand) {
        setBrands((prev) => [res.brand!, ...prev]);
        setShowModal(false);
        setName("");
        setSlug("");
        setDescription("");
        setSortOrder("0");
      } else {
        setError(res.error ?? "Failed to create brand");
      }
    });
  };

  const handleDelete = (id: string, brandName: string) => {
    if (!confirm(`هل أنت تأكد من حذف الماركة "${brandName}"؟`)) return;

    startTransition(async () => {
      const res = await deleteBrandAction(id);
      if (res.success) {
        setBrands((prev) => prev.filter((b) => b.id !== id));
      } else {
        alert(res.error ?? "تعذر حذف الماركة");
      }
    });
  };

  const columns: Column<Brand>[] = [
    {
      key: "name",
      header: "الماركة (Brand)",
      render: (row) => (
        <span className="font-medium text-luxury-white">{row.name}</span>
      ),
    },
    { key: "slug", header: "الرابط (Slug)" },
    {
      key: "is_active",
      header: "الحالة",
      render: (row) => (
        <Badge variant={row.is_active ? "inStock" : "outOfStock"}>
          {row.is_active ? "نشطة" : "معطلة"}
        </Badge>
      ),
    },
    { key: "sort_order", header: "الترتيب" },
    {
      key: "actions",
      header: "إجراءات",
      render: (row) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={() => handleDelete(row.id, row.name)}
          loading={isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowModal(true)} className="gap-2">
          <Tag className="h-4 w-4" />
          إضافة ماركة جديدة (Add Brand)
        </Button>
      </div>

      <DataTable data={brands} columns={columns} searchKeys={["name", "slug"]} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3.5 sm:p-4">
          <div className="w-full max-w-lg rounded-luxury border border-luxury-border/40 bg-premium-black p-4 sm:p-6 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-luxury-border/20">
              <h2 className="font-display text-lg sm:text-xl font-bold text-luxury-white">إضافة ماركة جديدة</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-luxury-muted hover:text-luxury-white p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <Input
                label="اسم الماركة (Brand Name)"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="مثال: CHANEL"
                required
              />

              <Input
                label="الرابط اللطيف (Slug)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="chanel"
                required
              />

              <Textarea
                label="الوصف (اختياري)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="نبذة عن الماركة..."
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="ترتيب العرض"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isBrandActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-gold h-4 w-4"
                  />
                  <label htmlFor="isBrandActive" className="text-sm font-medium text-luxury-white">
                    تفعيل الماركة
                  </label>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex justify-end gap-3 pt-4 border-t border-luxury-border/20">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  إلغاء
                </Button>
                <Button type="submit" loading={isPending}>
                  حفظ الماركة
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
