import Link from "next/link";
import { HeroSection } from "@/components/storefront/HeroSection";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { BrandCarousel } from "@/components/storefront/BrandCarousel";
import { ReviewHighlight } from "@/components/storefront/ReviewHighlight";
import { Button } from "@/components/ui/button";
import { getHomepageSections } from "@/services/homepage.service";
import { TranslatedText } from "@/components/shared/TranslatedText";
import {
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
} from "@/services/products.service";
import { getFeaturedBrands } from "@/services/brands.service";
import { getFeaturedCollections } from "@/services/collections.service";
import { getApprovedReviews } from "@/services/reviews.service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [
    sections,
    featuredProducts,
    brands,
    newArrivals,
    bestSellers,
    reviews,
    collections,
  ] = await Promise.all([
    getHomepageSections().catch(() => []),
    getFeaturedProducts(8).catch(() => []),
    getFeaturedBrands(8).catch(() => []),
    getNewArrivals(8).catch(() => []),
    getBestSellers(8).catch(() => []),
    getApprovedReviews(6).catch(() => []),
    getFeaturedCollections().catch(() => []),
  ]);

  const heroSection = sections.find((s) => s.section_type === "hero");
  const heroConfig = (heroSection?.config ?? {}) as Record<string, string>;

  return (
    <>
      <HeroSection
        title={heroConfig.title ?? heroSection?.title ?? undefined}
        subtitle={heroConfig.subtitle}
        ctaText={heroConfig.ctaText}
        ctaHref={heroConfig.ctaHref}
        secondaryCtaText={heroConfig.secondaryCtaText}
        secondaryCtaHref={heroConfig.secondaryCtaHref}
      />

      <BrandCarousel brands={brands} />

      {featuredProducts.length > 0 ? (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-display text-2xl tracking-wide sm:text-3xl">
                <TranslatedText path="storefront.featuredProducts" fallback="Featured Products" />
              </h2>
              <Link
                href="/products?featured=true"
                className="text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-hover font-semibold"
              >
                <TranslatedText path="common.viewAll" fallback="View All" />
              </Link>
            </div>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      ) : (
        <section className="py-16 text-center border-t border-luxury-border/30 bg-surface-elevated/40">
          <div className="mx-auto max-w-xl px-4">
            <h2 className="font-display text-2xl font-semibold tracking-wide text-luxury-white">
              تشكيلة فاخرة متجددة
            </h2>
            <p className="mt-3 text-sm text-luxury-muted leading-relaxed">
              سيتم تفعيل وعرض المنتجات فور إضافتها مباشرة عبر لوحة التحكم والإدارة.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/admin">
                <Button variant="secondary" size="sm">الدخول للوحة التحكم</Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="border-t border-luxury-border/20 bg-premium-black py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-display text-2xl tracking-wide sm:text-3xl">
                <TranslatedText path="storefront.newArrivals" fallback="New Arrivals" />
              </h2>
              <Link
                href="/products?new=true"
                className="text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-hover"
              >
                <TranslatedText path="common.viewAll" fallback="View All" />
              </Link>
            </div>
            <ProductGrid products={newArrivals} />
          </div>
        </section>
      )}

      {collections.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-display text-2xl tracking-wide sm:text-3xl">
                <TranslatedText path="common.collections" fallback="Curated Collections" />
              </h2>
              <Link
                href="/collections"
                className="text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-hover"
              >
                <TranslatedText path="common.viewAll" fallback="View All" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/collections/${collection.slug}`}
                  className="group rounded-luxury border border-luxury-border/20 bg-premium-black p-8 transition-all hover:border-gold/40"
                >
                  <h3 className="font-display text-xl text-luxury-white group-hover:text-gold">
                    {collection.name}
                  </h3>
                  {collection.description && (
                    <p className="mt-2 text-sm text-luxury-muted line-clamp-2">
                      {collection.description}
                    </p>
                  )}
                  <span className="mt-4 inline-block text-xs uppercase tracking-[0.15em] text-gold">
                    Explore
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {bestSellers.length > 0 && (
        <section className="border-t border-luxury-border/20 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-display text-2xl tracking-wide sm:text-3xl">
                <TranslatedText path="storefront.bestSellers" fallback="Best Sellers" />
              </h2>
              <Link
                href="/products?bestseller=true"
                className="text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-hover"
              >
                <TranslatedText path="common.viewAll" fallback="View All" />
              </Link>
            </div>
            <ProductGrid products={bestSellers} />
          </div>
        </section>
      )}

      <ReviewHighlight reviews={reviews} />

      <section className="border-t border-luxury-border/20 bg-premium-black py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-display text-2xl tracking-wide sm:text-3xl">
            <TranslatedText path="common.deals" fallback="Exclusive Deals" />
          </h2>
          <p className="mt-4 text-luxury-muted">
            Discover limited-time offers on premium beauty essentials.
          </p>
          <Link href="/deals" className="mt-8 inline-block">
            <Button size="lg">
              <TranslatedText path="common.deals" fallback="Shop Deals" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
