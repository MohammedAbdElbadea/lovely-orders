"use server";

import { registerCustomer, loginCustomer } from "@/services/customer-auth.service";

export async function registerCustomerAction(input: {
  fullName: string;
  phone: string;
  email: string;
  password?: string;
}) {
  return await registerCustomer(input);
}

export async function loginCustomerAction(input: {
  email: string;
  password?: string;
}) {
  return await loginCustomer(input);
}
