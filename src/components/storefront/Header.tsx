"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/storefront/SearchBar";
import { useCartStore } from "@/stores/cart-store";
import { cn } from "@/lib/utils";
import { STORE_NAME } from "@/lib/constants";
import { useTranslation } from "@/lib/i18n";

export function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openCart } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = mounted ? totalItems() : 0;
  const { locale, setLocale, t } = useTranslation();

  const navLinks = [
    { href: "/products", label: t.common.products },
    { href: "/categories", label: t.common.categories },
    { href: "/brands", label: t.common.brands },
    { href: "/collections", label: t.common.collections },
    { href: "/deals", label: t.common.deals },
  ];

  return (
    <>
      {/* Luxury Announcement Ticker */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gold via-gold-hover to-gold text-white text-[11px] font-semibold tracking-wider py-1.5 shadow-xs">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="mx-4 flex items-center gap-2">✨ التوصيل لكافة المحافظات المصرية • الدفع عند الاستلام • فودافون كاش & InstaPay • منتجات تجميل وعطور أصلية 100% ✨</span>
          <span className="mx-4 flex items-center gap-2">✨ التوصيل لكافة المحافظات المصرية • الدفع عند الاستلام • فودافون كاش & InstaPay • منتجات تجميل وعطور أصلية 100% ✨</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-luxury-border/30 bg-white/90 backdrop-blur-md shadow-xs transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 lg:gap-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link
              href="/"
              className="font-display text-lg tracking-[0.15em] text-luxury-white transition-colors hover:text-gold sm:text-xl font-bold flex items-center gap-2.5"
            >
              <img
                src="/logo.jpg"
                alt="Lovely Products"
                className="h-9 w-auto object-contain rounded-md border border-gold/30 shadow-xs"
              />
              <span>{STORE_NAME}</span>
            </Link>


            <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-xs uppercase tracking-[0.15em] transition-colors hover:text-gold font-medium",
                    pathname.startsWith(link.href)
                      ? "text-gold font-semibold"
                      : "text-luxury-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
              className="text-xs uppercase tracking-wider font-semibold hover:text-gold"
            >
              {locale === "ar" ? "EN" : "العربية"}
            </Button>

            <Link href="/track-order">
              <Button
                variant="ghost"
                className="hidden sm:inline-flex text-xs uppercase tracking-wider font-medium hover:text-gold"
              >
                {t.storefront.trackOrder}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              aria-label={`Cart, ${itemCount} items`}
              className="relative"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white shadow-sm animate-badge-pop glow-purple">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

      {searchOpen && (
        <div className="border-t border-luxury-border/20 bg-premium-black px-4 py-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <SearchBar autoFocus onNavigate={() => setSearchOpen(false)} />
          </div>
        </div>
      )}

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 border-r border-luxury-border/20 bg-deep-black p-6 lg:hidden">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-lg tracking-[0.15em]">
                Menu
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-4" aria-label="Mobile">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-sm uppercase tracking-[0.15em] transition-colors hover:text-gold",
                    pathname.startsWith(link.href)
                      ? "text-gold"
                      : "text-luxury-muted"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/cart"
                onClick={() => setMobileOpen(false)}
                className="text-sm uppercase tracking-[0.15em] text-luxury-muted hover:text-gold"
              >
                {t.common.cart}
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileOpen(false)}
                className="text-sm uppercase tracking-[0.15em] text-luxury-muted hover:text-gold"
              >
                {t.storefront.trackOrder}
              </Link>
            </nav>
          </div>
        </>
      )}
    </header>
  </>
  );
}
