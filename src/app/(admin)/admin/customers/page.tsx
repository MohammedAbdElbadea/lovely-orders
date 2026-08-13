import { CustomersList } from "@/components/admin/CustomersList";
import { getCustomers } from "@/lib/services/admin/catalog.service";

export default async function AdminCustomersPage() {
  const { data: customers } = await getCustomers(undefined, 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Customers</h1>
        <p className="text-sm text-luxury-muted">View and manage customer profiles</p>
      </div>
      <CustomersList customers={customers} />
    </div>
  );
}
