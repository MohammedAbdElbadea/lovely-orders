"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { getPrimaryImage } from "@/lib/product-utils";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/types/domain.types";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  className?: string;
}

export function ProductCard({ product, priority, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const primaryImage = getPrimaryImage(product);
  const imageUrl = primaryImage?.url;
  const inWishlist = has(product.id);
  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.is_available) return;

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      compareAtPrice: product.compare_at_price,
      maxQuantity: product.stock_quantity,
      imageUrl,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      imageUrl,
    });
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-luxury border border-luxury-border/20 bg-premium-black transition-all duration-300 hover:border-gold/30 hover:shadow-lg hover:shadow-gold/5",
        className
      )}
    >
      <Link href={`/products/${product.slug}`} className="flex flex-1 flex-col">
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-elevated">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={primaryImage?.alt_text ?? product.name}
              fill
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-luxury-muted/20">
              <ShoppingBag className="h-12 w-12" />
            </div>
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1">
            {product.is_new_arrival && <Badge variant="new">New</Badge>}
            {product.is_on_sale && hasDiscount && (
              <Badge variant="sale">Sale</Badge>
            )}
            {product.is_featured && <Badge variant="featured">Featured</Badge>}
            {!product.is_available && (
              <Badge variant="outOfStock">Sold Out</Badge>
            )}
          </div>

          <button
            type="button"
            onClick={handleWishlist}
            className={cn(
              "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-deep-black/60 backdrop-blur-sm transition-colors hover:bg-deep-black/80",
              inWishlist ? "text-red-400" : "text-luxury-white"
            )}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn("h-4 w-4", inWishlist && "fill-current")}
            />
          </button>
        </div>

        <div className="flex flex-1 flex-col p-4">
          {product.brand && (
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold-muted">
              {product.brand.name}
            </p>
          )}
          <h3 className="mt-1 line-clamp-2 font-display text-base leading-snug text-luxury-white group-hover:text-gold">
            {product.name}
          </h3>

          {product.review_count > 0 && (
            <div className="mt-2 flex items-center gap-1 text-xs text-luxury-muted">
              <Star className="h-3 w-3 fill-gold text-gold" />
              <span>{product.average_rating.toFixed(1)}</span>
              <span>({product.review_count})</span>
            </div>
          )}

          <div className="mt-auto flex items-baseline gap-2 pt-3">
            <span className="font-display text-lg text-gold">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-luxury-muted line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button
          variant="secondary"
          className="w-full"
          onClick={handleAddToCart}
          disabled={!product.is_available}
        >
          {product.is_available ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </article>
  );
}
