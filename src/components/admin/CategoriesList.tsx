"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, FolderPlus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { createCategoryAction, deleteCategoryAction } from "@/app/actions/admin/catalog";
import type { Category } from "@/types/domain.types";

interface CategoriesListProps {
  categories: Category[];
}

export function CategoriesList({ categories: initialCategories }: CategoriesListProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState<string>("");
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
      const res = await createCategoryAction({
        name,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-"),
        description: description || null,
        parent_id: parentId || null,
        sort_order: parseInt(sortOrder) || 0,
        is_active: isActive,
      });

      if (res.success && res.category) {
        setCategories((prev) => [res.category!, ...prev]);
        setShowModal(false);
        // Reset form
        setName("");
        setSlug("");
        setParentId("");
        setDescription("");
        setSortOrder("0");
      } else {
        setError(res.error ?? "Failed to create category");
      }
    });
  };

  const handleDelete = (id: string, catName: string) => {
    if (!confirm(`هل أنت تأكد من حذف الفئة "${catName}"؟`)) return;

    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(res.error ?? "تعذر حذف الفئة");
      }
    });
  };

  const columns: Column<Category>[] = [
    {
      key: "name",
      header: "الفئة (Category)",
      render: (row) => (
        <div className="font-medium text-luxury-white">{row.name}</div>
      ),
    },
    { key: "slug", header: "الرابط (Slug)" },
    {
      key: "parent_id",
      header: "الفئة الأب (Parent)",
      render: (row) => {
        if (!row.parent_id) return "رئيسية (Top)";
        const parent = categories.find((c) => c.id === row.parent_id);
        return parent?.name ?? "—";
      },
    },
    {
      key: "is_active",
      header: "الحالة (Status)",
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
          <FolderPlus className="h-4 w-4" />
          إضافة فئة جديدة (Add Category)
        </Button>
      </div>

      <DataTable data={categories} columns={columns} searchKeys={["name", "slug"]} />

      {/* Add Category Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-luxury border border-luxury-border/40 bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-luxury-border/20">
              <h2 className="font-display text-xl text-luxury-white">إضافة فئة جديدة</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-luxury-muted hover:text-luxury-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <Input
                label="اسم الفئة (Category Name)"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="مثال: عطور فاخرة"
                required
              />

              <Input
                label="الرابط اللطيف (Slug)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="luxury-perfumes"
                required
              />

              <div>
                <label className="block text-xs uppercase tracking-wider text-luxury-muted mb-1.5 font-medium">
                  الفئة الأب (اختر إذا كانت فئة فرعية)
                </label>
                <select
                  value={parentId}
                  onChange={(e) => setParentId(e.target.value)}
                  className="w-full rounded-luxury border border-luxury-border/30 bg-surface-elevated px-3 py-2 text-sm text-luxury-white focus:border-gold focus:outline-none"
                >
                  <option value="">-- فئة رئيسية بدون أب --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <Textarea
                label="الوصف (اختياري)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="وصف مختصر للفئة..."
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
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="accent-gold h-4 w-4"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-luxury-white">
                    تفعيل الفئة (Active)
                  </label>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex justify-end gap-3 pt-4 border-t border-luxury-border/20">
                <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>
                  إلغاء
                </Button>
                <Button type="submit" loading={isPending}>
                  حفظ الفئة
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
