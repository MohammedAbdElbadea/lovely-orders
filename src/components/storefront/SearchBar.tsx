"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  defaultValue?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
  className?: string;
}

export function SearchBar({
  defaultValue = "",
  autoFocus,
  onNavigate,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultValue);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    setQuery(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    if (debouncedQuery.trim() && debouncedQuery !== defaultValue) {
      router.push(`/products?q=${encodeURIComponent(debouncedQuery.trim())}`);
      onNavigate?.();
    }
  }, [debouncedQuery, defaultValue, router, onNavigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/products?q=${encodeURIComponent(trimmed)}`);
      onNavigate?.();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-luxury-muted" />
      <Input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products, brands..."
        autoFocus={autoFocus}
        className="pl-10"
        aria-label="Search products"
      />
    </form>
  );
}
