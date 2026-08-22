import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardCharts } from "@/components/admin/DashboardCharts";
import {
  getDashboardStats,
  getRecentOrders,
  getLowStockProducts,
  getMonthlyRevenueTrend,
  getOrderStatusBreakdown,
} from "@/lib/services/admin/dashboard.service";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [stats, recentOrders, lowStock, revenueTrend, orderBreakdown] =
    await Promise.all([
      getDashboardStats(),
      getRecentOrders(5),
      getLowStockProducts(5),
      getMonthlyRevenueTrend(),
      getOrderStatusBreakdown(),
    ]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-full">
      <div>
        <h1 className="font-display text-xl sm:text-2xl font-bold tracking-wide text-luxury-white">
          لوحة التحكم الرئيسية (Dashboard)
        </h1>
        <p className="text-xs sm:text-sm text-luxury-muted mt-1">
          نظرة عامة على مبيعات المتجر، الطلبات، والمخزون
        </p>
      </div>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title="إجمالي الإيرادات"
          value={formatPrice(stats.revenue, "EGP", "en-EG")}
          icon={DollarSign}
          description="مدفوعات مؤكدة"
        />
        <StatCard
          title="إجمالي الطلبات"
          value={stats.ordersCount}
          icon={ShoppingCart}
          description="طلب مسجل"
        />
        <StatCard
          title="المنتجات المتاحة"
          value={stats.productsCount}
          icon={Package}
          description="منتج في الكتالوج"
        />
        <StatCard
          title="تنبيهات المخزون"
          value={stats.lowStockCount}
          icon={AlertTriangle}
          description="أوشك على النفاد"
        />
      </div>

      {/* Interactive Charts */}
      <DashboardCharts
        revenueTrend={revenueTrend}
        orderBreakdown={orderBreakdown}
      />

      {/* Bottom Lists: Recent Orders & Low Stock */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-luxury-border/30 bg-surface-elevated/40">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-3">
            <CardTitle className="text-sm sm:text-base font-bold">أحدث الطلبات (Recent Orders)</CardTitle>
            <Link href="/admin/orders" className="text-xs text-gold hover:underline font-medium">
              عرض الكل ➔
            </Link>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ul className="divide-y divide-luxury-border/10">
              {recentOrders.length === 0 ? (
                <li className="py-6 text-center text-xs sm:text-sm text-luxury-muted">لا توجد طلبات مسجلة حتى الآن</li>
              ) : (
                recentOrders.map((order) => (
                  <li key={order.id} className="flex items-center justify-between py-3 gap-2">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs sm:text-sm font-semibold text-luxury-white hover:text-gold block truncate"
                      >
                        {order.order_number}
                      </Link>
                      <p className="text-[11px] sm:text-xs text-luxury-muted truncate">{order.guest_name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs sm:text-sm font-bold text-luxury-white font-mono">
                        {formatPrice(Number(order.total_amount), "EGP", "en-EG")}
                      </p>
                      <div className="mt-1">
                        <StatusBadge status={order.status} type="order" />
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-luxury-border/30 bg-surface-elevated/40">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 pb-3">
            <CardTitle className="text-sm sm:text-base font-bold">تنبيهات المخزون المنخفض</CardTitle>
            <Link
              href="/admin/inventory/low-stock"
              className="text-xs text-gold hover:underline font-medium"
            >
              إدارة المخزون ➔
            </Link>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <ul className="divide-y divide-luxury-border/10">
              {lowStock.length === 0 ? (
                <li className="py-6 text-center text-xs sm:text-sm text-luxury-muted">كافة المنتجات بمستوى مخزون كافٍ ✅</li>
              ) : (
                lowStock.map((product) => (
                  <li key={product.id} className="flex items-center justify-between py-3 gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-xs sm:text-sm font-medium text-luxury-white hover:text-gold truncate max-w-[200px]"
                    >
                      {product.name}
                    </Link>
                    <span className="text-xs font-bold text-amber-400 shrink-0 bg-amber-400/10 px-2 py-0.5 rounded-md">
                      متبقي {product.stock_quantity} فقط
                    </span>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
