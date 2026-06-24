import Link from "next/link";
import { Instagram, Facebook, Mail, Phone } from "lucide-react";
import { STORE_EMAIL, STORE_NAME, STORE_PHONE } from "@/lib/constants";

const FOOTER_LINKS = {
  shop: [
    { href: "/products", label: "All Products" },
    { href: "/categories", label: "Categories" },
    { href: "/brands", label: "Brands" },
    { href: "/collections", label: "Collections" },
    { href: "/deals", label: "Deals" },
  ],
  help: [
    { href: "/track-order", label: "Track Order" },
    { href: "/shipping", label: "Shipping" },
    { href: "/refund", label: "Returns & Refunds" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-luxury-border/20 bg-premium-black">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link
              href="/"
              className="font-display text-xl tracking-[0.2em] text-luxury-white"
            >
              {STORE_NAME}
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-luxury-muted">
              Curated premium cosmetics and skincare. Luxury beauty, delivered
              with care across Egypt.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-luxury-muted transition-colors hover:text-gold"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-luxury-muted transition-colors hover:text-gold"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Shop
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-luxury-muted transition-colors hover:text-luxury-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Help
            </h3>
            <ul className="space-y-2">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-luxury-muted transition-colors hover:text-luxury-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-gold">
              Contact
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${STORE_PHONE}`}
                  className="flex items-center gap-2 text-sm text-luxury-muted transition-colors hover:text-luxury-white"
                >
                  <Phone className="h-4 w-4 text-gold" />
                  {STORE_PHONE}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${STORE_EMAIL}`}
                  className="flex items-center gap-2 text-sm text-luxury-muted transition-colors hover:text-luxury-white"
                >
                  <Mail className="h-4 w-4 text-gold" />
                  {STORE_EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-luxury-border/20 pt-8 text-center text-xs text-luxury-muted">
          <p>
            &copy; {year} {STORE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
