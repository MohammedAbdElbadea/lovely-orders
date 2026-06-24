import { notFound } from "next/navigation";
import { OrderDetailClient } from "@/components/admin/OrderDetailClient";
import { getOrderById } from "@/lib/services/admin/orders.service";

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">
          Order Details
        </h1>
        <p className="text-sm text-luxury-muted">{order.order_number}</p>
      </div>
      <OrderDetailClient order={order} />
    </div>
  );
}
