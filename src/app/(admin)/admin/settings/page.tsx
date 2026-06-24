import { SettingsForm } from "@/components/admin/SettingsForm";
import { getStoreSettings } from "@/lib/services/admin/misc.service";
import { STORE_NAME, STORE_PHONE, STORE_EMAIL, PAYMENT_NUMBER } from "@/lib/constants";

function parseSetting<T>(value: unknown, fallback: T): T {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as T;
    }
  }
  return value as T;
}

export default async function AdminSettingsPage() {
  const settings = await getStoreSettings();

  const contact = parseSetting<{ phone?: string; email?: string }>(
    settings["store.contact"],
    { phone: STORE_PHONE, email: STORE_EMAIL }
  );

  const initial = {
    storeName: parseSetting<string>(settings["store.name"], STORE_NAME),
    storePhone: contact.phone ?? STORE_PHONE,
    storeEmail: contact.email ?? STORE_EMAIL,
    vodafoneNumber: parseSetting<string>(
      settings["payment.vodafone_number"],
      PAYMENT_NUMBER
    ),
    instapayNumber: parseSetting<string>(
      settings["payment.instapay_number"],
      PAYMENT_NUMBER
    ),
    lowStockThreshold: parseSetting<number>(
      settings["inventory.low_stock_threshold"],
      5
    ),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl tracking-wide text-luxury-white">Settings</h1>
        <p className="text-sm text-luxury-muted">Configure store and payment settings</p>
      </div>
      <SettingsForm initial={initial} />
    </div>
  );
}
