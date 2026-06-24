import Link from "next/link";
import { HeroSection } from "@/components/storefront/HeroSection";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { BrandCarousel } from "@/components/storefront/BrandCarousel";
import { ReviewHighlight } from "@/components/storefront/ReviewHighlight";
import { Button } from "@/components/ui/button";
import { getHomepageSections } from "@/services/homepage.service";
import {
  getFeaturedProducts,
  getNewArrivals,
  getBestSellers,
} from "@/services/products.service";
import { getFeaturedBrands } from "@/services/brands.service";
import { getFeaturedCollections } from "@/services/collections.service";
import { getApprovedReviews } from "@/services/reviews.service";

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

      {featuredProducts.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-display text-2xl tracking-wide sm:text-3xl">
                Featured Products
              </h2>
              <Link
                href="/products?featured=true"
                className="text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-hover"
              >
                View All
              </Link>
            </div>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <section className="border-t border-luxury-border/20 bg-premium-black py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-display text-2xl tracking-wide sm:text-3xl">
                New Arrivals
              </h2>
              <Link
                href="/products?new=true"
                className="text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-hover"
              >
                View All
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
                Curated Collections
              </h2>
              <Link
                href="/collections"
                className="text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-hover"
              >
                View All
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
                Best Sellers
              </h2>
              <Link
                href="/products?bestseller=true"
                className="text-xs uppercase tracking-[0.15em] text-gold hover:text-gold-hover"
              >
                View All
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
            Exclusive Deals
          </h2>
          <p className="mt-4 text-luxury-muted">
            Discover limited-time offers on premium beauty essentials.
          </p>
          <Link href="/deals" className="mt-8 inline-block">
            <Button size="lg">Shop Deals</Button>
          </Link>
        </div>
      </section>
    </>
  );
}
