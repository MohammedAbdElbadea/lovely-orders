import { Suspense } from "react";
import { OrdersList } from "@/components/admin/OrdersList";
import { getOrders } from "@/lib/services/admin/orders.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminOrdersPage() {
  const { data: orders } = await getOrders({ limit: 100 });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Orders</h1>
        <p className="text-sm text-luxury-muted">Manage and fulfill customer orders</p>
      </div>
      <Suspense fallback={<p className="text-luxury-muted">Loading...</p>}>
        <OrdersList orders={orders} />
      </Suspense>
    </div>
  );
}
