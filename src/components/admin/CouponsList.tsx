"use client";

import { useState } from "react";
import { Plus, Tag, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createCouponAction,
  toggleCouponStatusAction,
  deleteCouponAction,
} from "@/app/actions/admin/marketing";
import type { Coupon } from "@/types/domain.types";

interface CouponsListProps {
  coupons: Coupon[];
}

export function CouponsList({ coupons }: CouponsListProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await createCouponAction(formData);
    setLoading(false);

    if (res.success) {
      setShowAddModal(false);
    } else {
      setErrorMsg(res.error ?? "حدث خطأ أثناء إضافة الكود");
    }
  };

  const handleToggle = async (id: string) => {
    await toggleCouponStatusAction(id);
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت تأكد من رغبتك في حذف كود الخصم هذا؟")) {
      await deleteCouponAction(id);
    }
  };

  const columns: Column<Coupon & { discount?: { name?: string; type?: string; value?: number } }>[] = [
    {
      key: "code",
      header: "رمز الكود (Promo Code)",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-gold shrink-0" />
          <span className="font-mono text-base font-bold text-luxury-white">{row.code}</span>
        </div>
      ),
    },
    {
      key: "discount",
      header: "قيمة الخصم",
      render: (row) => {
        const d = row.discount;
        if (!d) return "—";
        return d.type === "percentage" ? `${d.value}% خصم` : `${d.value} EGP خصم ثابت`;
      },
    },
    {
      key: "usage",
      header: "عدد مرات الاستخدام في الطلبات",
      render: (row) => (
        <span className="font-medium text-luxury-white bg-surface-elevated px-3 py-1 rounded-full text-xs">
          تم استخدامه في <strong className="text-gold font-bold">{row.usage_count ?? 0}</strong> طلبات
          {row.usage_limit ? ` (من أصل ${row.usage_limit})` : ""}
        </span>
      ),
    },
    {
      key: "is_active",
      header: "الحالة",
      render: (row) => (
        <Badge variant={row.is_active ? "inStock" : "outOfStock"}>
          {row.is_active ? "نَشِط (مُفَعَّل)" : "معطّل"}
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
            title={row.is_active ? "تعطيل الكود" : "تفعيل الكود"}
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
            title="حذف الكود"
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
          إجمالي الأكواد المتاحة: ({coupons.length})
        </h2>
        <Button
          onClick={() => setShowAddModal(!showAddModal)}
          className="font-bold flex items-center gap-2 glow-purple"
        >
          <Plus className="h-4 w-4" />
          <span>إضافة كود خصم جديد</span>
        </Button>
      </div>

      {showAddModal && (
        <form
          onSubmit={handleCreate}
          className="rounded-luxury border border-luxury-border/40 bg-white p-6 shadow-md space-y-4 animate-fade-down"
        >
          <h3 className="font-display text-lg font-bold text-luxury-white">
            إنشاء كود خصم جديد (Promo Code)
          </h3>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Input
              name="code"
              label="رمز الكود (مثال: SUMMER20)"
              required
              placeholder="LOVELY20"
              className="uppercase font-mono"
            />
            <div>
              <label className="block text-xs font-semibold text-luxury-muted mb-1.5">
                نوع الخصم
              </label>
              <select
                name="type"
                className="w-full rounded-luxury border border-luxury-border/40 bg-white px-3 py-2 text-sm text-luxury-white focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="percentage">نسبة مئوية (%)</option>
                <option value="fixed">مبلغ ثابت (EGP)</option>
              </select>
            </div>
            <Input
              name="value"
              label="قيمة الخصم"
              type="number"
              required
              min={1}
              placeholder="مثال: 10 أو 50"
            />
            <Input
              name="usageLimit"
              label="الحد الأقصى للطلبات (اختياري)"
              type="number"
              placeholder="مثال: 100"
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
              حفظ وتفعيل الكود
            </Button>
          </div>
        </form>
      )}

      <DataTable data={coupons} columns={columns} searchKeys={["code"]} />
    </div>
  );
}
