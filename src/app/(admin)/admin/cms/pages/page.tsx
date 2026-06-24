import Link from "next/link";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { getPages } from "@/lib/services/admin/misc.service";
import type { Page } from "@/types/domain.types";

export default async function CmsPagesPage() {
  const pages = await getPages();

  const columns: Column<Page>[] = [
    {
      key: "title",
      header: "Title",
      render: (row) => (
        <Link
          href={`/admin/cms/pages/${row.id}/edit`}
          className="font-medium text-gold hover:underline"
        >
          {row.title}
        </Link>
      ),
    },
    { key: "slug", header: "Slug" },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <Badge variant={row.status === "active" ? "inStock" : "outline"}>
          {row.status}
        </Badge>
      ),
    },
    {
      key: "updated_at",
      header: "Updated",
      render: (row) => new Date(row.updated_at).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">CMS Pages</h1>
        <p className="text-sm text-luxury-muted">Manage static content pages</p>
      </div>
      <DataTable data={pages as Page[]} columns={columns} searchKeys={["title", "slug"]} />
    </div>
  );
}
