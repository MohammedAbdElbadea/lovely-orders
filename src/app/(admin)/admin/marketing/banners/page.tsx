import { BannersList } from "@/components/admin/BannersList";
import { getBanners } from "@/lib/services/admin/misc.service";
import type { PromotionalBanner } from "@/types/domain.types";

export default async function BannersPage() {
  const banners = await getBanners();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Banners</h1>
        <p className="text-sm text-luxury-muted">Manage promotional banners</p>
      </div>
      <BannersList banners={banners as PromotionalBanner[]} />
    </div>
  );
}
