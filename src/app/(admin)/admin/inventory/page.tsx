import Link from "next/link";
import { InventoryTable } from "@/components/admin/InventoryTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getInventoryProducts,
  getInventoryLogs,
} from "@/lib/services/admin/misc.service";

export default async function AdminInventoryPage() {
  const [{ data: products }, logs] = await Promise.all([
    getInventoryProducts("all", 100),
    getInventoryLogs(10),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl tracking-wide text-luxury-white">Inventory</h1>
          <p className="text-sm text-luxury-muted">Manage stock levels across products</p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/admin/inventory/low-stock" className="text-amber-400 hover:underline">
            Low Stock
          </Link>
          <Link href="/admin/inventory/out-of-stock" className="text-red-400 hover:underline">
            Out of Stock
          </Link>
        </div>
      </div>

      <InventoryTable products={products} />

      <Card>
        <CardHeader><CardTitle>Recent Adjustments</CardTitle></CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-luxury-muted">No inventory logs yet</p>
          ) : (
            <ul className="divide-y divide-luxury-border/10 text-sm">
              {logs.map((log) => (
                <li key={log.id} className="flex justify-between py-2">
                  <span>{(log as { product?: { name: string } }).product?.name ?? log.product_id}</span>
                  <span className={log.change_amount >= 0 ? "text-emerald-400" : "text-red-400"}>
                    {log.change_amount >= 0 ? "+" : ""}{log.change_amount} ({log.reason})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
