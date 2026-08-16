import Link from "next/link";
import { Instagram, Facebook, Mail, Phone, ShieldCheck, HeartHandshake, Truck } from "lucide-react";
import { STORE_EMAIL, STORE_NAME, STORE_PHONE } from "@/lib/constants";

const FOOTER_LINKS = {
  shop: [
    { href: "/products", label: "جميع المنتجات - All Products" },
    { href: "/categories", label: "الفئات - Categories" },
    { href: "/brands", label: "الماركات العالمية - Brands" },
    { href: "/collections", label: "التشكيلات الفاخرة - Collections" },
    { href: "/deals", label: "العروض والتخفيضات - Deals" },
  ],
  help: [
    { href: "/track-order", label: "تتبع طلبك - Track Order" },
    { href: "/shipping", label: "سياسة الشحن - Shipping" },
    { href: "/refund", label: "الإرجاع والاستبدال - Returns" },
    { href: "/contact", label: "تواصل معنا - Contact Us" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-luxury-border/30 bg-surface-elevated/80 pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="font-display text-2xl font-bold tracking-[0.2em] text-luxury-white hover:text-gold transition-colors flex items-center gap-3"
            >
              <img
                src="/logo.jpg"
                alt="Lovely Products"
                className="h-11 w-auto object-contain rounded-lg border border-gold/30 shadow-xs"
              />
              <span>{STORE_NAME}</span>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-luxury-muted">
              وجهتك الأولى لأحدث مستحضرات التجميل والعطور الفاخرة والأصلية 100%، مع خدمة التوصيل السريع لكافة المحافظات المصرية.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gold transition-all hover:bg-gold hover:text-white shadow-xs"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gold transition-all hover:bg-gold hover:text-white shadow-xs"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              التسوق والمنتجات
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-luxury-muted transition-colors hover:text-gold font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              خدمة العملاء
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-luxury-muted transition-colors hover:text-gold font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              تواصل معنا
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${STORE_PHONE}`}
                  className="flex items-center gap-2.5 text-sm text-luxury-muted transition-colors hover:text-gold font-medium"
                >
                  <Phone className="h-4 w-4 text-gold shrink-0" />
                  <span>{STORE_PHONE}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${STORE_EMAIL}`}
                  className="flex items-center gap-2.5 text-sm text-luxury-muted transition-colors hover:text-gold font-medium"
                >
                  <Mail className="h-4 w-4 text-gold shrink-0" />
                  <span>{STORE_EMAIL}</span>
                </a>
              </li>
            </ul>

            <div className="mt-6 rounded-luxury border border-luxury-border/40 bg-white p-3 shadow-xs">
              <p className="text-[11px] font-bold text-gold uppercase tracking-wider mb-1">
                طرق الدفع المتاحة 💳
              </p>
              <p className="text-xs text-luxury-muted">
                الدفع عند الاستلام • فودافون كاش • انستا باي (InstaPay)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-luxury-border/30 pt-8 text-center text-xs text-luxury-muted">
          <p>
            &copy; {year} {STORE_NAME}. جميع الحقوق محفوظة | All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
