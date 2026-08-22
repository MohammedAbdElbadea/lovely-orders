import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/services/orders.service";
import { OrderConfirmationCelebration } from "@/components/storefront/OrderConfirmationCelebration";

interface OrderConfirmationPageProps {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ token?: string }>;
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: OrderConfirmationPageProps) {
  const { orderNumber } = await params;
  const { token } = await searchParams;

  const order = await getOrderByNumber(orderNumber).catch(() => null);

  return (
    <OrderConfirmationCelebration
      orderNumber={orderNumber}
      token={token}
      totalAmount={order?.total_amount}
    />
  );
}
