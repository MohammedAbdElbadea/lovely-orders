import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Star } from "lucide-react";
import { ProductGallery } from "@/components/storefront/ProductGallery";
import { ProductActions } from "@/components/storefront/ProductActions";
import { ProductGrid } from "@/components/storefront/ProductGrid";
import { ProductTabs } from "@/components/storefront/ProductTabs";
import { ReviewSection } from "@/components/storefront/ReviewSection";
import { getProductBySlug, getRelatedProducts } from "@/services/products.service";
import { getPrimaryImage } from "@/lib/product-utils";
import { getProductReviews } from "@/services/reviews.service";
import { STORE_NAME } from "@/lib/constants";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const primaryImage = getPrimaryImage(product);

  return {
    title: product.meta_title ?? product.name,
    description:
      product.meta_description ??
      product.short_description ??
      `${product.name} at ${STORE_NAME}`,
    openGraph: {
      title: product.meta_title ?? product.name,
      description: product.short_description ?? undefined,
      images: primaryImage ? [{ url: primaryImage.url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [reviews, related] = await Promise.all([
    getProductReviews(product.id).catch(() => []),
    getRelatedProducts(product.id, product.category_id).catch(() => []),
  ]);

  const primaryImage = getPrimaryImage(product);
  const images = product.images ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? product.short_description,
    sku: product.sku,
    image: images.map((img) => img.url),
    brand: product.brand
      ? { "@type": "Brand", name: product.brand.name }
      : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EGP",
      availability: product.is_available
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      product.review_count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.average_rating,
            reviewCount: product.review_count,
          }
        : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <nav className="mb-6 text-xs text-luxury-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          {" / "}
          <Link href="/products" className="hover:text-gold">
            Products
          </Link>
          {product.brand && (
            <>
              {" / "}
              <Link
                href={`/brands/${product.brand.slug}`}
                className="hover:text-gold"
              >
                {product.brand.name}
              </Link>
            </>
          )}
          {" / "}
          <span className="text-luxury-white">{product.name}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={images} productName={product.name} />

          <div>
            {product.brand && (
              <Link
                href={`/brands/${product.brand.slug}`}
                className="text-xs uppercase tracking-[0.2em] text-gold-muted hover:text-gold"
              >
                {product.brand.name}
              </Link>
            )}

            <h1 className="mt-2 font-display text-3xl tracking-wide sm:text-4xl">
              {product.name}
            </h1>

            {product.review_count > 0 && (
              <div className="mt-3 flex items-center gap-2 text-sm text-luxury-muted">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(product.average_rating)
                          ? "fill-gold text-gold"
                          : "text-luxury-border"
                      }`}
                    />
                  ))}
                </div>
                <span>
                  {product.average_rating.toFixed(1)} ({product.review_count}{" "}
                  reviews)
                </span>
              </div>
            )}

            <div className="mt-8">
              <ProductActions
                product={product}
                primaryImageUrl={primaryImage?.url}
              />
            </div>
          </div>
        </div>

        <ProductTabs
          description={product.description}
          shortDescription={product.short_description}
          productName={product.name}
          categoryName={product.category?.name}
        />

        <ReviewSection reviews={reviews} productId={product.id} />

        {related.length > 0 && (
          <section className="mt-16 border-t border-luxury-border/20 pt-12">
            <h2 className="mb-8 font-display text-2xl tracking-wide">
              Related Products
            </h2>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </>
  );
}
