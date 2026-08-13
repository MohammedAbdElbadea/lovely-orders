"use client";

import { Select } from "@/components/ui/select";

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <form action="/products" method="get" className="flex items-center gap-2">
      <Select
        name="sort"
        defaultValue={defaultValue}
        options={[
          { value: "newest", label: "Newest" },
          { value: "price_asc", label: "Price: Low to High" },
          { value: "price_desc", label: "Price: High to Low" },
          { value: "rating", label: "Top Rated" },
          { value: "name", label: "Name A–Z" },
        ]}
        className="w-44"
        aria-label="Sort products"
        onChange={(e) => e.currentTarget.form?.submit()}
      />
    </form>
  );
}
