import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/constants";
import { generateTrackingToken } from "@/lib/utils";
import { DEMO_ORDERS, DEMO_CUSTOMERS, DEMO_PRODUCTS, DEMO_COUPONS } from "@/lib/demo-data";
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
  couponCode?: string;
  couponId?: string;
  discountAmount?: number;
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
  const discountAmount = Math.max(0, input.discountAmount ?? 0);
  const totalAmount = Math.max(0, subtotal - discountAmount);

  // Increment coupon usage in DEMO_COUPONS
  if (input.couponId || input.couponCode) {
    const c = DEMO_COUPONS.find(
      (cp) =>
        cp.id === input.couponId ||
        cp.code.toUpperCase() === input.couponCode?.toUpperCase()
    );
    if (c) {
      c.usage_count = (c.usage_count ?? 0) + 1;
    }
  }

  // Always create in-memory order object & sync to DEMO_CUSTOMERS and DEMO_ORDERS
  let customer = DEMO_CUSTOMERS.find((c) => c.phone === input.guestPhone);
  if (customer) {
    customer.total_orders = (customer.total_orders ?? 0) + 1;
    customer.total_spent = (customer.total_spent ?? 0) + totalAmount;
    customer.last_order_at = new Date().toISOString();
  } else {
    customer = {
      id: crypto.randomUUID(),
      auth_user_id: null,
      full_name: input.guestName,
      phone: input.guestPhone,
      email: null,
      segment: "new",
      total_orders: 1,
      total_spent: totalAmount,
      last_order_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    DEMO_CUSTOMERS.unshift(customer);
  }

  const inMemoryOrder: Order = {
    id: crypto.randomUUID(),
    order_number: generateOrderNumber(),
    customer_id: customer.id,
    guest_name: input.guestName,
    guest_phone: input.guestPhone,
    guest_address: input.guestAddress,
    subtotal,
    discount_amount: discountAmount,
    total_amount: totalAmount,
    coupon_id: input.couponId ?? null,
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

  // Decrement stock in DEMO_PRODUCTS immediately
  for (const item of input.items) {
    const demoProd = DEMO_PRODUCTS.find((p) => p.id === item.productId);
    if (demoProd) {
      demoProd.stock_quantity = Math.max(0, demoProd.stock_quantity - item.quantity);
      demoProd.is_available = demoProd.stock_quantity > 0;
    }
  }

  // Add to DEMO_ORDERS immediately
  DEMO_ORDERS.unshift(inMemoryOrder);

  if (!isSupabaseConfigured()) {
    return { order: inMemoryOrder, trackingToken };
  }

  try {
    const supabase = createAdminClient();
    let orderNumber = inMemoryOrder.order_number;

    try {
      const { data: orderNumberData, error: rpcErr } = await supabase.rpc("generate_order_number");
      if (!rpcErr && orderNumberData) {
        orderNumber = orderNumberData as string;
        inMemoryOrder.order_number = orderNumber;
      }
    } catch (rpcEx) {
      console.warn("RPC order number fallback:", rpcEx);
    }

    let customerId: string | null = null;
    try {
      const { data: existingCust } = await supabase
        .from("customers")
        .select("id, total_orders, total_spent")
        .eq("phone", input.guestPhone)
        .maybeSingle();

      if (existingCust) {
        customerId = existingCust.id;
        await supabase
          .from("customers")
          .update({
            total_orders: (existingCust.total_orders ?? 0) + 1,
            total_spent: Number(existingCust.total_spent ?? 0) + totalAmount,
            last_order_at: new Date().toISOString(),
          })
          .eq("id", customerId);
      } else {
        const { data: newCust } = await supabase
          .from("customers")
          .insert({
            full_name: input.guestName,
            phone: input.guestPhone,
            segment: "new",
            total_orders: 1,
            total_spent: totalAmount,
            last_order_at: new Date().toISOString(),
          })
          .select("id")
          .single();

        if (newCust) {
          customerId = newCust.id;
        }
      }
    } catch (custErr) {
      console.warn("Customer database auto-sync notice:", custErr);
    }

    // Increment coupon usage in Supabase
    if (input.couponId || input.couponCode) {
      try {
        let cQuery = supabase.from("coupons").select("id, usage_count");
        if (input.couponId) {
          cQuery = cQuery.eq("id", input.couponId);
        } else if (input.couponCode) {
          cQuery = cQuery.eq("code", input.couponCode.toUpperCase());
        }
        const { data: cData } = await cQuery.maybeSingle();
        if (cData) {
          await supabase
            .from("coupons")
            .update({ usage_count: (cData.usage_count ?? 0) + 1 })
            .eq("id", cData.id);
        }
      } catch (cErr) {
        console.warn("Coupon usage increment notice:", cErr);
      }
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: customerId,
        guest_name: input.guestName,
        guest_phone: input.guestPhone,
        guest_address: input.guestAddress,
        subtotal,
        discount_amount: discountAmount,
        total_amount: totalAmount,
        coupon_id: input.couponId ?? null,
        payment_method: input.paymentMethod,
        payment_reference: input.paymentReference ?? null,
        payment_status: "pending",
        status: "pending_payment",
        tracking_token: trackingToken,
      })
      .select("*")
      .single();

    if (!orderError && order) {
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

      await supabase.from("order_items").insert(orderItems);

      // Automatically decrement stock quantity atomically in PostgreSQL via RPC with fallback
      for (const item of input.items) {
        try {
          const { data: rpcSuccess, error: rpcErr } = await supabase.rpc("decrement_stock", {
            p_product_id: item.productId,
            p_qty: item.quantity,
          });

          if (rpcErr || !rpcSuccess) {
            // Application fallback if RPC function is not installed
            const { data: prod } = await supabase
              .from("products")
              .select("stock_quantity")
              .eq("id", item.productId)
              .maybeSingle();

            if (prod && prod.stock_quantity !== null) {
              const newStock = Math.max(0, prod.stock_quantity - item.quantity);
              await supabase
                .from("products")
                .update({ stock_quantity: newStock, is_available: newStock > 0 })
                .eq("id", item.productId);
            }
          }
        } catch (stkErr) {
          console.warn("Stock auto-decrement notice:", stkErr);
        }
      }

      return {
        order: mapOrder(order),
        trackingToken,
      };
    }
  } catch (dbErr) {
    console.error("Supabase order insert error (fallback used):", dbErr);
  }

  return { order: inMemoryOrder, trackingToken };
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
    const oldStatus = order.status;
    const newStatus = input.status;
    order.status = newStatus;
    order.updated_at = new Date().toISOString();

    // Restock logic in Demo Mode
    if (newStatus === "cancelled" && oldStatus !== "cancelled") {
      for (const item of order.items ?? []) {
        const prod = DEMO_PRODUCTS.find((p) => p.id === item.product_id);
        if (prod) {
          prod.stock_quantity = (prod.stock_quantity ?? 0) + item.quantity;
          prod.is_available = prod.stock_quantity > 0;
        }
      }
    } else if (oldStatus === "cancelled" && newStatus !== "cancelled") {
      for (const item of order.items ?? []) {
        const prod = DEMO_PRODUCTS.find((p) => p.id === item.product_id);
        if (prod) {
          prod.stock_quantity = Math.max(0, (prod.stock_quantity ?? 0) - item.quantity);
          prod.is_available = prod.stock_quantity > 0;
        }
      }
    }

    return order;
  }

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  const oldStatus = existing?.status;
  const newStatus = input.status;

  const { data, error } = await supabase
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .select("*, items:order_items(*)")
    .single();

  if (error) throw new Error(error.message);

  // Restock logic in Supabase Mode
  if (newStatus === "cancelled" && oldStatus !== "cancelled") {
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    if (orderItems) {
      for (const item of orderItems) {
        if (!item.product_id) continue;
        const productId = item.product_id;
        const { data: prod } = await supabase
          .from("products")
          .select("stock_quantity")
          .eq("id", productId)
          .maybeSingle();

        if (prod && prod.stock_quantity !== null) {
          const newStock = prod.stock_quantity + item.quantity;
          await supabase
            .from("products")
            .update({ stock_quantity: newStock, is_available: newStock > 0 })
            .eq("id", productId);
        }
      }
    }
  } else if (oldStatus === "cancelled" && newStatus !== "cancelled") {
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", orderId);

    if (orderItems) {
      for (const item of orderItems) {
        if (!item.product_id) continue;
        const productId = item.product_id;
        const { data: prod } = await supabase
          .from("products")
          .select("stock_quantity")
          .eq("id", productId)
          .maybeSingle();

        if (prod && prod.stock_quantity !== null) {
          const newStock = Math.max(0, prod.stock_quantity - item.quantity);
          await supabase
            .from("products")
            .update({ stock_quantity: newStock, is_available: newStock > 0 })
            .eq("id", productId);
        }
      }
    }
  }

  await supabase.from("order_status_history").insert({
    order_id: orderId,
    previous_status: oldStatus ?? null,
    new_status: newStatus,
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

  if (error) throw error;
  return data as Order;
}
