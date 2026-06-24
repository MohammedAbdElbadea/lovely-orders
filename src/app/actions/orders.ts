"use server";

import { z } from "zod";
import { createOrder } from "@/services/orders.service";
import type { CartItem, PaymentMethod } from "@/types/domain.types";

const cartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  sku: z.string().min(1),
  price: z.number().positive(),
  compareAtPrice: z.number().nullable().optional(),
  quantity: z.number().int().positive(),
  imageUrl: z.string().optional(),
  maxQuantity: z.number().int().positive(),
});

const orderSchema = z.object({
  guestName: z.string().min(2, "Name is required"),
  guestPhone: z
    .string()
    .min(10, "Valid phone number is required")
    .regex(/^01[0-9]{9}$/, "Enter a valid Egyptian mobile number"),
  guestAddress: z.string().min(10, "Address is required"),
  paymentMethod: z.enum(["vodafone_cash", "instapay"]),
  paymentReference: z.string().optional(),
  items: z.array(cartItemSchema).min(1, "Cart is empty"),
});

export interface CreateOrderState {
  success?: boolean;
  error?: string;
  orderNumber?: string;
  trackingToken?: string;
}

export async function createOrderAction(
  _prevState: CreateOrderState | null,
  formData: FormData
): Promise<CreateOrderState> {
  try {
    const itemsRaw = formData.get("items");
    let items: CartItem[] = [];

    if (typeof itemsRaw === "string") {
      items = JSON.parse(itemsRaw) as CartItem[];
    }

    const parsed = orderSchema.safeParse({
      guestName: formData.get("guestName"),
      guestPhone: formData.get("guestPhone"),
      guestAddress: formData.get("guestAddress"),
      paymentMethod: formData.get("paymentMethod"),
      paymentReference: formData.get("paymentReference") || undefined,
      items,
    });

    if (!parsed.success) {
      return {
        error: parsed.error.errors[0]?.message ?? "Invalid order data",
      };
    }

    const result = await createOrder({
      guestName: parsed.data.guestName,
      guestPhone: parsed.data.guestPhone,
      guestAddress: parsed.data.guestAddress,
      paymentMethod: parsed.data.paymentMethod as PaymentMethod,
      paymentReference: parsed.data.paymentReference,
      items: parsed.data.items as CartItem[],
    });

    return {
      success: true,
      orderNumber: result.order.order_number,
      trackingToken: result.trackingToken,
    };
  } catch (err) {
    console.error("Create order error:", err);
    return {
      error: "Failed to create order. Please try again.",
    };
  }
}
