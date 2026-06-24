"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/domain.types";

interface ProductActionsProps {
  product: Product;
  primaryImageUrl?: string;
}

export function ProductActions({ product, primaryImageUrl }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const inWishlist = has(product.id);
  const hasDiscount =
    product.compare_at_price && product.compare_at_price > product.price;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      price: product.price,
      compareAtPrice: product.compare_at_price,
      quantity,
      maxQuantity: product.stock_quantity,
      imageUrl: primaryImageUrl,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {product.is_new_arrival && <Badge variant="new">New</Badge>}
        {product.is_on_sale && hasDiscount && <Badge variant="sale">Sale</Badge>}
        {product.is_featured && <Badge variant="featured">Featured</Badge>}
        {product.is_available ? (
          <Badge variant="inStock">In Stock</Badge>
        ) : (
          <Badge variant="outOfStock">Out of Stock</Badge>
        )}
      </div>

      <div className="flex items-baseline gap-3">
        <span className="font-display text-3xl text-gold">
          {formatPrice(product.price)}
        </span>
        {hasDiscount && (
          <span className="text-lg text-luxury-muted line-through">
            {formatPrice(product.compare_at_price!)}
          </span>
        )}
      </div>

      {product.short_description && (
        <p className="text-luxury-muted">{product.short_description}</p>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center rounded-luxury border border-luxury-border/30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center text-sm">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setQuantity((q) => Math.min(product.stock_quantity, q + 1))
            }
            disabled={quantity >= product.stock_quantity}
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <Button
          className="flex-1"
          onClick={handleAddToCart}
          disabled={!product.is_available}
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </Button>

        <Button
          variant="secondary"
          size="icon"
          onClick={() =>
            toggle({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              imageUrl: primaryImageUrl,
            })
          }
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "fill-red-400 text-red-400" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
