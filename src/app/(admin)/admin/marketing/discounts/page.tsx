import { DiscountsList } from "@/components/admin/DiscountsList";
import { getDiscounts } from "@/lib/services/admin/misc.service";
import type { Discount } from "@/types/domain.types";

export default async function DiscountsPage() {
  const discounts = await getDiscounts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Discounts</h1>
        <p className="text-sm text-luxury-muted">Manage store-wide and targeted discounts</p>
      </div>
      <DiscountsList discounts={discounts as Discount[]} />
    </div>
  );
}
