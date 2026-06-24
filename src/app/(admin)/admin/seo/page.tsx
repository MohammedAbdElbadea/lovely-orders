import { StatCard } from "@/components/admin/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSeoHealth } from "@/lib/services/admin/misc.service";
import { Search, AlertTriangle, CheckCircle2 } from "lucide-react";

export default async function SeoPage() {
  const health = await getSeoHealth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">SEO Health</h1>
        <p className="text-sm text-luxury-muted">Monitor meta tags and SEO coverage</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="SEO Score" value={`${health.score}%`} icon={Search} />
        <StatCard title="Products" value={health.totalProducts} />
        <StatCard title="Pages" value={health.totalPages} />
        <StatCard title="Brands" value={health.totalBrands} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Missing Meta Tags</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <SeoIssue
              label="Products missing meta"
              count={health.missingMetaProducts}
              total={health.totalProducts}
            />
            <SeoIssue
              label="Pages missing meta"
              count={health.missingMetaPages}
              total={health.totalPages}
            />
            <SeoIssue
              label="Brands missing meta"
              count={health.missingMetaBrands}
              total={health.totalBrands}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recommendations</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-luxury-muted">
            <p>• Add meta titles and descriptions to all published products</p>
            <p>• Ensure CMS pages have unique meta tags</p>
            <p>• Complete brand meta information for better search visibility</p>
            <p>• Use descriptive slugs across all content types</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SeoIssue({
  label,
  count,
  total,
}: {
  label: string;
  count: number;
  total: number;
}) {
  const ok = count === 0;
  return (
    <div className="flex items-center justify-between rounded-luxury border border-luxury-border/20 px-4 py-3">
      <div className="flex items-center gap-2">
        {ok ? (
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-amber-400" />
        )}
        <span className="text-sm text-luxury-white">{label}</span>
      </div>
      <span className={`text-sm ${ok ? "text-emerald-400" : "text-amber-400"}`}>
        {count} / {total}
      </span>
    </div>
  );
}
