"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Star, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useToast } from "@/components/ui/toast";
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
  const openCart = useCartStore((s) => s.openCart);
  const { toggle, has } = useWishlistStore();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const primaryImage = getPrimaryImage(product);
  const imageUrl = primaryImage?.url;
  const inWishlist = mounted ? has(product.id) : false;
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

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);

    toast({
      title: "تمت إضافة المنتج بنجاح! ✨",
      description: `${product.name} أصبح في سلة تسوقك.`,
      variant: "success",
      duration: 3000,
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

    toast({
      title: inWishlist ? "تم الإزالة من المفضلة" : "تمت الإضافة للمفضلة ❤️",
      variant: "info",
      duration: 2000,
    });
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-luxury border border-luxury-border/40 bg-white shadow-xs transition-all duration-300 hover:border-gold/60 hover:shadow-xl hover-lift animate-fade-up",
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
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-luxury-muted/20">
              <ShoppingBag className="h-12 w-12" />
            </div>
          )}

          {/* Badges container */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10">
            {product.is_new_arrival && <Badge variant="new">جديد</Badge>}
            {product.is_on_sale && hasDiscount && (
              <Badge variant="sale">
                خصم {Math.round(((product.compare_at_price! - product.price) / product.compare_at_price!) * 100)}%
              </Badge>
            )}
            {product.is_featured && <Badge variant="featured">مميز</Badge>}
            {!product.is_available && (
              <Badge variant="outOfStock">نفد بالكامل</Badge>
            )}
          </div>

          {/* Wishlist Heart Button */}
          <button
            type="button"
            onClick={handleWishlist}
            className={cn(
              "absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-md transition-all duration-300 hover:scale-110 shadow-xs",
              inWishlist ? "text-rose-ruby bg-rose-soft" : "text-luxury-muted hover:text-rose-ruby"
            )}
            aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn("h-4 w-4 transition-transform duration-300", inWishlist && "fill-current scale-110")}
            />
          </button>
        </div>

        {/* Product Details */}
        <div className="flex flex-1 flex-col p-4">
          {product.brand && (
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
              {product.brand.name}
            </p>
          )}
          <h3 className="mt-1.5 line-clamp-2 font-display text-base font-semibold leading-snug text-luxury-white transition-colors group-hover:text-gold">
            {product.name}
          </h3>

          {product.review_count > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-luxury-muted">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-luxury-white">{product.average_rating.toFixed(1)}</span>
              <span>({product.review_count})</span>
            </div>
          )}

          <div className="mt-auto flex items-baseline gap-2 pt-3">
            <span className="font-display text-lg font-bold text-gold">
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
          variant={added ? "secondary" : "primary"}
          className={cn(
            "w-full font-semibold transition-all duration-300 shadow-xs",
            added && "bg-emerald-600 text-white hover:bg-emerald-700"
          )}
          onClick={handleAddToCart}
          disabled={!product.is_available}
        >
          {added ? (
            <span className="inline-flex items-center gap-1.5 animate-badge-pop">
              <Check className="h-4 w-4" /> تمت الإضافة للسلة
            </span>
          ) : product.is_available ? (
            "أضف للسلة"
          ) : (
            "نفد من المخزون"
          )}
        </Button>
      </div>
    </article>
  );
}
