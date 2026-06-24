import { HomepageSectionsManager } from "@/components/admin/HomepageSectionsManager";
import { getHomepageSections } from "@/lib/services/admin/misc.service";
import type { HomepageSection } from "@/types/domain.types";

export default async function HomepageCmsPage() {
  const sections = await getHomepageSections();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">
          Homepage Sections
        </h1>
        <p className="text-sm text-luxury-muted">
          Enable, disable, and reorder homepage sections
        </p>
      </div>
      <HomepageSectionsManager sections={sections as HomepageSection[]} />
    </div>
  );
}
