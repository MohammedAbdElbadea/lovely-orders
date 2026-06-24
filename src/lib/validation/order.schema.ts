import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.coerce.number().int().min(1).max(99),
});

export const checkoutSchema = z.object({
  guest_name: z.string().min(2, "Full name is required").max(255),
  guest_phone: z
    .string()
    .min(10, "Valid phone number is required")
    .max(20)
    .regex(/^01[0-9]{9}$/, "Enter a valid Egyptian mobile number"),
  guest_address: z.string().min(5, "Delivery address is required"),
  payment_method: z.enum(["vodafone_cash", "instapay"]),
  coupon_code: z.string().optional(),
  items: z.array(checkoutItemSchema).min(1, "Cart cannot be empty"),
});

export const createOrderSchema = checkoutSchema.extend({
  subtotal: z.coerce.number().min(0),
  discount_amount: z.coerce.number().min(0).default(0),
  total_amount: z.coerce.number().min(0),
  payment_reference: z.string().optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    "pending_payment",
    "paid",
    "processing",
    "shipped",
    "delivered",
    "completed",
    "cancelled",
  ]),
  note: z.string().optional(),
});

export const verifyPaymentSchema = z.object({
  order_id: z.string().uuid(),
  payment_reference: z.string().min(1).optional(),
  verified: z.boolean(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;
