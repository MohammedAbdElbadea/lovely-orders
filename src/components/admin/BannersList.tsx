"use client";

import { useState } from "react";
import { Plus, Image as ImageIcon, ToggleLeft, ToggleRight, Trash2, ExternalLink } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createBannerAction,
  toggleBannerStatusAction,
  deleteBannerAction,
} from "@/app/actions/admin/marketing";
import type { PromotionalBanner } from "@/types/domain.types";

interface BannersListProps {
  banners: PromotionalBanner[];
}

export function BannersList({ banners }: BannersListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await createBannerAction(formData);
    setLoading(false);

    if (res.success) {
      setShowAddModal(false);
    } else {
      setErrorMsg(res.error ?? "حدث خطأ أثناء إضافة البنر");
    }
  };

  const handleToggle = async (id: string) => {
    await toggleBannerStatusAction(id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت تأكد من رغبتك في حذف هذا البنر؟")) {
      await deleteBannerAction(id);
    }
  };

  const columns: Column<PromotionalBanner>[] = [
    {
      key: "title",
      header: "عنوان البنر الترويجي",
      render: (row) => (
        <div className="flex items-center gap-3">
          {row.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={row.image_url}
              alt={row.title}
              className="h-10 w-16 object-cover rounded-luxury border border-luxury-border/30 shrink-0"
            />
          ) : (
            <ImageIcon className="h-6 w-6 text-luxury-muted shrink-0" />
          )}
          <div>
            <p className="font-bold text-luxury-white">{row.title}</p>
            {row.subtitle && (
              <p className="text-xs text-luxury-muted">{row.subtitle}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "link_url",
      header: "رابط الرابط التفاعلي",
      render: (row) => (
        <a
          href={row.link_url ?? "/products"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs text-gold hover:underline font-mono"
        >
          <span>{row.link_url ?? "/products"}</span>
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      ),
    },
    {
      key: "is_active",
      header: "الحالة",
      render: (row) => (
        <Badge variant={row.is_active ? "inStock" : "outOfStock"}>
          {row.is_active ? "نَشِط (معروض)" : "معطّل"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "إجراءات",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggle(row.id)}
            title={row.is_active ? "تعطيل البنر" : "تفعيل البنر"}
            className="text-luxury-muted hover:text-gold"
          >
            {row.is_active ? (
              <ToggleRight className="h-5 w-5 text-emerald-600" />
            ) : (
              <ToggleLeft className="h-5 w-5 text-gray-400" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.id)}
            className="text-luxury-muted hover:text-red-500"
            title="حذف البنر"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-luxury-muted">
          إجمالي البنرات الإعلانية: ({banners.length})
        </h2>
        <Button
          onClick={() => setShowAddModal(!showAddModal)}
          className="font-bold flex items-center gap-2 glow-purple"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة بنر إعلاني جديد</span>
        </Button>
      </div>

      {showAddModal && (
        <form
          onSubmit={handleCreate}
          className="rounded-luxury border border-luxury-border/40 bg-white p-6 shadow-md space-y-4 animate-fade-down"
        >
          <h3 className="font-display text-lg font-bold text-luxury-white">
            إنشاء بنر إعلاني جديد
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              name="title"
              label="عنوان البنر الإعلاني الرئيسي"
              required
              placeholder="عروض الصيف الفاخرة"
            />
            <Input
              name="subtitle"
              label="العنوان الفرعي / الخصم (اختياري)"
              placeholder="خصومات تصل إلى 30% على السيروم"
            />
            <Input
              name="imageUrl"
              label="رابط صورة البنر (Image URL)"
              required
              placeholder="https://images.unsplash.com/..."
            />
            <Input
              name="linkUrl"
              label="الرابط عند ضغط الزبون (Link URL)"
              placeholder="/products"
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-red-500">{errorMsg}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowAddModal(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" loading={loading} className="font-bold">
              حفظ ونشر البنر
            </Button>
          </div>
        </form>
      )}

      <DataTable data={banners} columns={columns} searchKeys={["title"]} />
    </div>
  );
}
