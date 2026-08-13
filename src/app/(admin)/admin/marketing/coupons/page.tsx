import { CouponsList } from "@/components/admin/CouponsList";
import { getCoupons } from "@/lib/services/admin/misc.service";
import type { Coupon } from "@/types/domain.types";

export default async function CouponsPage() {
  const coupons = await getCoupons();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Coupons</h1>
        <p className="text-sm text-luxury-muted">Manage promotional coupon codes</p>
      </div>
      <CouponsList coupons={coupons as Coupon[]} />
    </div>
  );
}
