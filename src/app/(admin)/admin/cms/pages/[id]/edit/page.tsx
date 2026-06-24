import { notFound } from "next/navigation";
import { EditPageForm } from "@/components/admin/EditPageForm";
import { getPageById } from "@/lib/services/admin/misc.service";
import type { Page } from "@/types/domain.types";

interface EditCmsPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCmsPage({ params }: EditCmsPageProps) {
  const { id } = await params;
  const page = await getPageById(id);

  if (!page) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Edit Page</h1>
        <p className="text-sm text-luxury-muted">{(page as Page).title}</p>
      </div>
      <EditPageForm page={page as Page} />
    </div>
  );
}
