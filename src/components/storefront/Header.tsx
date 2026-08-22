"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, X, Phone, MapPin, Truck } from "lucide-react";
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
      <div className="relative overflow-hidden bg-gradient-to-r from-gold via-gold-hover to-gold text-white text-[10px] sm:text-[11px] font-semibold tracking-wider py-1.5 shadow-xs">
        <div className="flex whitespace-nowrap animate-marquee">
          <span className="mx-4 flex items-center gap-2">✨ التوصيل لكافة المحافظات المصرية • الدفع عند الاستلام • فودافون كاش & InstaPay • منتجات تجميل وعطور أصلية 100% ✨</span>
          <span className="mx-4 flex items-center gap-2">✨ التوصيل لكافة المحافظات المصرية • الدفع عند الاستلام • فودافون كاش & InstaPay • منتجات تجميل وعطور أصلية 100% ✨</span>
        </div>
      </div>

      <header className="sticky top-0 z-50 border-b border-luxury-border/30 bg-white/95 backdrop-blur-md shadow-xs transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 sm:gap-4 px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-8">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 text-luxury-white hover:text-gold hover:bg-surface-elevated"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </Button>

            <Link
              href="/"
              className="font-display text-base tracking-[0.12em] text-luxury-white transition-colors hover:text-gold sm:text-xl font-bold flex items-center gap-2"
            >
              <img
                src="/logo.jpg"
                alt="Lovely Products"
                className="h-8 sm:h-9 w-auto object-contain rounded-md border border-gold/30 shadow-xs"
              />
              <span className="truncate">{STORE_NAME}</span>
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

          <div className="flex items-center gap-1.5 sm:gap-3">
            <Button
              variant="ghost"
              onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
              className="text-[11px] sm:text-xs uppercase tracking-wider font-semibold hover:text-gold px-2 sm:px-3 h-9"
            >
              {locale === "ar" ? "EN" : "العربية"}
            </Button>

            <Link href="/track-order">
              <Button
                variant="ghost"
                className="hidden sm:inline-flex text-xs uppercase tracking-wider font-medium hover:text-gold h-9 px-3"
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
              className="h-9 w-9 text-luxury-white hover:text-gold"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              aria-label={`Cart, ${itemCount} items`}
              className="relative h-9 w-9 text-luxury-white hover:text-gold"
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4.5 w-4.5 sm:h-5 sm:w-5 items-center justify-center rounded-full bg-gold text-[9px] sm:text-[10px] font-bold text-white shadow-sm animate-badge-pop">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Expandable Mobile/Desktop Search Bar */}
        {searchOpen && (
          <div className="border-t border-luxury-border/20 bg-premium-black px-4 py-3 sm:px-6 lg:px-8 animate-fade-in">
            <div className="mx-auto max-w-2xl">
              <SearchBar autoFocus onNavigate={() => setSearchOpen(false)} />
            </div>
          </div>
        )}

        {/* Storefront Mobile Drawer */}
        {mobileOpen && (
          <>
            <div
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs lg:hidden transition-opacity"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div className="fixed inset-y-0 right-0 rtl:right-0 rtl:left-auto ltr:left-0 ltr:right-auto z-50 w-72 sm:w-80 border-l rtl:border-l-0 rtl:border-r border-luxury-border/30 bg-deep-black p-5 lg:hidden shadow-2xl flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="mb-6 flex items-center justify-between border-b border-luxury-border/20 pb-4">
                  <div className="flex items-center gap-2.5">
                    <img
                      src="/logo.jpg"
                      alt="Logo"
                      className="h-8 w-auto rounded-md border border-gold/30"
                    />
                    <span className="font-display text-sm font-bold text-luxury-white tracking-widest">
                      {STORE_NAME}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Close menu"
                    className="text-luxury-muted hover:text-luxury-white h-9 w-9"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "rounded-luxury px-3.5 py-3 text-sm font-medium transition-colors flex items-center justify-between touch-manipulation",
                        pathname.startsWith(link.href)
                          ? "bg-gold/15 text-gold font-bold border border-gold/30"
                          : "text-luxury-white hover:bg-surface-elevated hover:text-gold"
                      )}
                    >
                      <span>{link.label}</span>
                      <span className="text-gold/40 text-xs">›</span>
                    </Link>
                  ))}
                  
                  <div className="my-2 border-t border-luxury-border/20 pt-2" />

                  <Link
                    href="/track-order"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-luxury px-3.5 py-3 text-sm font-medium text-luxury-white hover:bg-surface-elevated hover:text-gold flex items-center gap-2.5 transition-colors"
                  >
                    <Truck className="h-4 w-4 text-gold" />
                    <span>{t.storefront.trackOrder}</span>
                  </Link>

                  <Link
                    href="/shipping"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-luxury px-3.5 py-2.5 text-xs text-luxury-muted hover:text-gold transition-colors"
                  >
                    سياسة الشحن والتوصيل
                  </Link>
                  <Link
                    href="/refund"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-luxury px-3.5 py-2.5 text-xs text-luxury-muted hover:text-gold transition-colors"
                  >
                    سياسة الإرجاع والاستبدال
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-luxury px-3.5 py-2.5 text-xs text-luxury-muted hover:text-gold transition-colors"
                  >
                    تواصل معنا
                  </Link>
                </nav>
              </div>

              {/* Bottom Quick Contact Info */}
              <div className="border-t border-luxury-border/20 pt-4 mt-6">
                <a
                  href="tel:01067258266"
                  className="flex items-center gap-2 text-xs text-luxury-muted hover:text-gold transition-colors py-1"
                >
                  <Phone className="h-3.5 w-3.5 text-gold" />
                  <span>01067258266</span>
                </a>
                <p className="text-[10px] text-luxury-muted/70 mt-2">
                  © 2026 LOVELY ORDERS • جودة أصلية 100%
                </p>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  );
}
