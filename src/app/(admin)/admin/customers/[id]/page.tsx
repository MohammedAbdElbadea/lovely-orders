import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { getCustomerById } from "@/lib/services/admin/catalog.service";
import { formatPrice } from "@/lib/utils";

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: CustomerDetailPageProps) {
  const { id } = await params;
  const customer = await getCustomerById(id);

  if (!customer) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">
          {customer.full_name}
        </h1>
        <p className="text-sm text-luxury-muted">{customer.phone}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle>Profile</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-luxury-muted">Email</p>
              <p>{customer.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-luxury-muted">Segment</p>
              <p className="capitalize">{customer.segment.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-luxury-muted">Total Orders</p>
              <p>{customer.total_orders}</p>
            </div>
            <div>
              <p className="text-luxury-muted">Total Spent</p>
              <p>{formatPrice(Number(customer.total_spent), "EGP", "en-EG")}</p>
            </div>
            <div>
              <p className="text-luxury-muted">Member Since</p>
              <p>{new Date(customer.created_at).toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Orders</CardTitle></CardHeader>
          <CardContent>
            {customer.orders.length === 0 ? (
              <p className="text-sm text-luxury-muted">No orders yet</p>
            ) : (
              <ul className="divide-y divide-luxury-border/10">
                {customer.orders.map((order) => (
                  <li key={order.id} className="flex items-center justify-between py-3">
                    <Link href={`/admin/orders/${order.id}`} className="text-gold hover:underline">
                      {order.order_number}
                    </Link>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={order.status} type="order" />
                      <span className="text-sm">
                        {formatPrice(Number(order.total_amount), "EGP", "en-EG")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
        <CardContent>
          {customer.notes.length === 0 ? (
            <p className="text-sm text-luxury-muted">No notes yet</p>
          ) : (
            <ul className="space-y-3">
              {customer.notes.map((note: { id: string; note: string; created_at: string; admin?: { full_name: string } }) => (
                <li key={note.id} className="rounded-luxury border border-luxury-border/20 p-3">
                  <p className="text-sm">{note.note}</p>
                  <p className="mt-1 text-xs text-luxury-muted">
                    {note.admin?.full_name ?? "Admin"} · {new Date(note.created_at).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
