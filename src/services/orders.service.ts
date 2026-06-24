import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/constants";
import { generateTrackingToken } from "@/lib/utils";
import { DEMO_ORDERS } from "@/lib/demo-data";
import type { UpdateOrderStatusInput } from "@/lib/validation/order.schema";
import type {
  CartItem,
  Order,
  OrderItem,
  OrderStatus,
  PaginatedResult,
  PaymentMethod,
} from "@/types/domain.types";

export interface CreateOrderInput {
  guestName: string;
  guestPhone: string;
  guestAddress: string;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  items: CartItem[];
}

export interface CreateOrderResult {
  order: Order;
  trackingToken: string;
}

function mapOrder(row: Record<string, unknown>): Order {
  return row as unknown as Order;
}

function mapOrderItem(row: Record<string, unknown>): OrderItem {
  return row as unknown as OrderItem;
}

function generateOrderNumber(): string {
  const date = new Date();
  const yymmdd = date.toISOString().slice(2, 10).replace(/-/g, "");
  const seq = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `LO-${yymmdd}-${seq}`;
}

export async function createOrder(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const trackingToken = generateTrackingToken();
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!isSupabaseConfigured()) {
    const order: Order = {
      id: crypto.randomUUID(),
      order_number: generateOrderNumber(),
      customer_id: null,
      guest_name: input.guestName,
      guest_phone: input.guestPhone,
      guest_address: input.guestAddress,
      subtotal,
      discount_amount: 0,
      total_amount: subtotal,
      coupon_id: null,
      payment_method: input.paymentMethod,
      payment_status: "pending",
      payment_reference: input.paymentReference ?? null,
      status: "pending_payment",
      internal_notes: null,
      tracking_token: trackingToken,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      items: input.items.map((item) => ({
        id: crypto.randomUUID(),
        order_id: "",
        product_id: item.productId,
        variant_id: item.variantId ?? null,
        product_name: item.name,
        product_sku: item.sku,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
      })),
    };
    DEMO_ORDERS.unshift(order);
    return { order, trackingToken };
  }

  const supabase = createAdminClient();

  const { data: orderNumberData, error: orderNumberError } = await supabase.rpc(
    "generate_order_number"
  );

  if (orderNumberError) throw orderNumberError;

  const orderNumber = orderNumberData as string;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      guest_name: input.guestName,
      guest_phone: input.guestPhone,
      guest_address: input.guestAddress,
      subtotal,
      discount_amount: 0,
      total_amount: subtotal,
      payment_method: input.paymentMethod,
      payment_reference: input.paymentReference ?? null,
      payment_status: "pending",
      status: "pending_payment",
      tracking_token: trackingToken,
    })
    .select("*")
    .single();

  if (orderError) throw orderError;

  const orderItems = input.items.map((item) => ({
    order_id: order.id as string,
    product_id: item.productId,
    variant_id: item.variantId ?? null,
    product_name: item.name,
    product_sku: item.sku,
    quantity: item.quantity,
    unit_price: item.price,
    total_price: item.price * item.quantity,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);
  if (itemsError) throw itemsError;

  return {
    order: mapOrder(order),
    trackingToken,
  };
}

export async function getOrders(options?: {
  status?: OrderStatus;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResult<Order>> {
  const limit = options?.limit ?? 20;
  const offset = options?.offset ?? 0;

  if (!isSupabaseConfigured()) {
    let orders = [...DEMO_ORDERS];
    if (options?.status) {
      orders = orders.filter((o) => o.status === options.status);
    }
    return {
      data: orders.slice(offset, offset + limit),
      total: orders.length,
      limit,
      offset,
    };
  }

  const supabase = await createClient();
  let query = supabase
    .from("orders")
    .select("*, items:order_items(*)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (options?.status) query = query.eq("status", options.status);

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);

  return {
    data: (data ?? []) as Order[],
    total: count ?? 0,
    limit,
    offset,
  };
}

export async function getOrderByNumberAndToken(
  orderNumber: string,
  trackingToken: string
): Promise<(Order & { items: OrderItem[] }) | null> {
  if (!isSupabaseConfigured()) {
    const order = DEMO_ORDERS.find(
      (o) =>
        o.order_number === orderNumber && o.tracking_token === trackingToken
    );
    if (!order) return null;
    return {
      ...order,
      items: order.items ?? [],
    };
  }

  const supabase = createAdminClient();

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .eq("tracking_token", trackingToken)
    .maybeSingle();

  if (error) throw error;
  if (!order) return null;

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", order.id as string);

  if (itemsError) throw itemsError;

  return {
    ...mapOrder(order),
    items: (items ?? []).map(mapOrderItem),
  };
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<Order | null> {
  if (!isSupabaseConfigured()) {
    return DEMO_ORDERS.find((o) => o.order_number === orderNumber) ?? null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (error) throw error;
  return data ? mapOrder(data) : null;
}

export async function updateOrderStatus(
  orderId: string,
  input: UpdateOrderStatusInput,
  adminUserId?: string
): Promise<Order> {
  if (!isSupabaseConfigured()) {
    const order = DEMO_ORDERS.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    order.status = input.status;
    order.updated_at = new Date().toISOString();
    return order;
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  const { data, error } = await supabase
    .from("orders")
    .update({ status: input.status })
    .eq("id", orderId)
    .select("*, items:order_items(*)")
    .single();

  if (error) throw new Error(error.message);

  await supabase.from("order_status_history").insert({
    order_id: orderId,
    previous_status: existing?.status ?? null,
    new_status: input.status,
    changed_by: adminUserId ?? null,
    note: input.note ?? null,
  });

  return data as Order;
}

export async function verifyPayment(
  orderId: string,
  verified = true,
  paymentReference?: string
): Promise<Order> {
  if (!isSupabaseConfigured()) {
    const order = DEMO_ORDERS.find((o) => o.id === orderId);
    if (!order) throw new Error("Order not found");
    order.payment_status = verified ? "verified" : "failed";
    order.status = verified ? "paid" : "pending_payment";
    if (paymentReference) order.payment_reference = paymentReference;
    order.updated_at = new Date().toISOString();
    return order;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_status: verified ? "verified" : "failed",
      status: verified ? "paid" : "pending_payment",
      payment_reference: paymentReference,
    })
    .eq("id", orderId)
    .select("*, items:order_items(*)")
    .single();

  if (error) throw new Error(error.message);
  return data as Order;
}
