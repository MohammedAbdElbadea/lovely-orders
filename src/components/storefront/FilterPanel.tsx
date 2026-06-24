"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Brand, Category } from "@/types/domain.types";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  categories: Category[];
  brands: Brand[];
  priceRange?: { min: number; max: number };
  className?: string;
}

export function FilterPanel({
  categories,
  brands,
  priceRange = { min: 0, max: 10000 },
  className,
}: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const categoryId = searchParams.get("category") ?? "";
  const brandId = searchParams.get("brand") ?? "";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";
  const rating = searchParams.get("rating") ?? "";

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      params.delete("page");
      startTransition(() => {
        router.push(`/products?${params.toString()}`);
      });
    },
    [router, searchParams]
  );

  const clearFilters = () => {
    const q = searchParams.get("q");
    startTransition(() => {
      router.push(q ? `/products?q=${encodeURIComponent(q)}` : "/products");
    });
  };

  const topCategories = categories.filter((c) => !c.parent_id);

  return (
    <aside
      className={cn(
        "space-y-6 rounded-luxury border border-luxury-border/20 bg-premium-black p-5",
        isPending && "opacity-60",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-gold">
          Filters
        </h2>
        <Button variant="link" size="sm" onClick={clearFilters} className="text-xs">
          Clear all
        </Button>
      </div>

      <Select
        label="Category"
        value={categoryId}
        onChange={(e) => updateParams({ category: e.target.value || null })}
        placeholder="All categories"
        options={topCategories.map((c) => ({ value: c.id, label: c.name }))}
      />

      <Select
        label="Brand"
        value={brandId}
        onChange={(e) => updateParams({ brand: e.target.value || null })}
        placeholder="All brands"
        options={brands.map((b) => ({ value: b.id, label: b.name }))}
      />

      <div className="space-y-3">
        <p className="text-sm font-medium text-luxury-white">Price Range (EGP)</p>
        <div className="grid grid-cols-2 gap-3">
          <Input
            type="number"
            placeholder={`Min (${priceRange.min})`}
            value={minPrice}
            min={priceRange.min}
            max={priceRange.max}
            onChange={(e) => updateParams({ minPrice: e.target.value || null })}
          />
          <Input
            type="number"
            placeholder={`Max (${priceRange.max})`}
            value={maxPrice}
            min={priceRange.min}
            max={priceRange.max}
            onChange={(e) => updateParams({ maxPrice: e.target.value || null })}
          />
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-luxury-white">Minimum Rating</p>
        <div className="flex flex-wrap gap-2">
          {[4, 3, 2, 1].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() =>
                updateParams({
                  rating: rating === String(value) ? null : String(value),
                })
              }
              className={cn(
                "flex items-center gap-1 rounded-luxury border px-3 py-1.5 text-xs transition-colors",
                rating === String(value)
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-luxury-border/30 text-luxury-muted hover:border-gold/40"
              )}
            >
              {value}+ <Star className="h-3 w-3 fill-gold text-gold" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
