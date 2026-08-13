"use server";

import { revalidatePath } from "next/cache";
import {
  createCategory,
  deleteCategory,
  type CategoryInput,
} from "@/services/categories.service";
import {
  createBrand,
  deleteBrand,
  type BrandInput,
} from "@/services/brands.service";

function revalidateAll() {
  // Admin pages
  revalidatePath("/admin/products");
  revalidatePath("/admin/brands");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/inventory");
  revalidatePath("/admin/inventory/low-stock");
  revalidatePath("/admin/inventory/out-of-stock");
  // Storefront pages
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath("/brands");
  revalidatePath("/categories");
  revalidatePath("/deals");
  revalidatePath("/collections");
}

export async function createCategoryAction(input: CategoryInput) {
  try {
    const category = await createCategory(input);
    revalidateAll();
    return { success: true, category };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create category";
    return { success: false, error: msg };
  }
}

export async function deleteCategoryAction(id: string) {
  try {
    await deleteCategory(id);
    revalidateAll();
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete category";
    return { success: false, error: msg };
  }
}

export async function createBrandAction(input: BrandInput) {
  try {
    const brand = await createBrand(input);
    revalidateAll();
    return { success: true, brand };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create brand";
    return { success: false, error: msg };
  }
}

export async function deleteBrandAction(id: string) {
  try {
    await deleteBrand(id);
    revalidateAll();
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete brand";
    return { success: false, error: msg };
  }
}
