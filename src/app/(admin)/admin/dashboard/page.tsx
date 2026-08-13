import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  TrendingUp,
  BarChart3,
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
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">
          Dashboard
        </h1>
        <p className="text-sm text-luxury-muted">Store overview and key metrics</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Revenue"
          value={formatPrice(stats.revenue, "EGP", "en-EG")}
          icon={DollarSign}
          description="Verified payments"
        />
        <StatCard
          title="Orders"
          value={stats.ordersCount}
          icon={ShoppingCart}
        />
        <StatCard
          title="Products"
          value={stats.productsCount}
          icon={Package}
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStockCount}
          icon={AlertTriangle}
          description="Items below threshold"
        />
      </div>

      <DashboardCharts
        revenueTrend={revenueTrend}
        orderBreakdown={orderBreakdown}
      />


      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/admin/orders" className="text-xs text-gold hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-luxury-border/10">
              {recentOrders.length === 0 ? (
                <li className="py-4 text-sm text-luxury-muted">No orders yet</li>
              ) : (
                recentOrders.map((order) => (
                  <li key={order.id} className="flex items-center justify-between py-3">
                    <div>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm font-medium text-luxury-white hover:text-gold"
                      >
                        {order.order_number}
                      </Link>
                      <p className="text-xs text-luxury-muted">{order.guest_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-luxury-white">
                        {formatPrice(Number(order.total_amount), "EGP", "en-EG")}
                      </p>
                      <StatusBadge status={order.status} type="order" />
                    </div>
                  </li>
                ))
              )}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Low Stock Alerts</CardTitle>
            <Link
              href="/admin/inventory/low-stock"
              className="text-xs text-gold hover:underline"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <ul className="divide-y divide-luxury-border/10">
              {lowStock.length === 0 ? (
                <li className="py-4 text-sm text-luxury-muted">All stock levels healthy</li>
              ) : (
                lowStock.map((product) => (
                  <li key={product.id} className="flex items-center justify-between py-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-sm text-luxury-white hover:text-gold"
                    >
                      {product.name}
                    </Link>
                    <span className="text-sm font-medium text-amber-400">
                      {product.stock_quantity} left
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
