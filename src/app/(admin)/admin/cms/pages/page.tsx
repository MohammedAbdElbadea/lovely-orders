import { CmsPagesList } from "@/components/admin/CmsPagesList";
import { getPages } from "@/lib/services/admin/misc.service";
import type { Page } from "@/types/domain.types";

export default async function CmsPagesPage() {
  const pages = await getPages();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">CMS Pages</h1>
        <p className="text-sm text-luxury-muted">Manage static content pages</p>
      </div>
      <CmsPagesList pages={pages as Page[]} />
    </div>
  );
}
