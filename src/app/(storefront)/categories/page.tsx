import Image from "next/image";
import Link from "next/link";
import { getTopLevelCategories } from "@/services/categories.service";

export const metadata = {
  title: "Categories",
  description: "Browse our luxury beauty categories",
};

export default async function CategoriesPage() {
  const categories = await getTopLevelCategories().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl tracking-wide sm:text-4xl">
        Categories
      </h1>
      <p className="mt-2 text-luxury-muted">
        Explore our curated collections by category
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group relative overflow-hidden rounded-luxury border border-luxury-border/20 bg-premium-black transition-all hover:border-gold/40"
          >
            <div className="relative aspect-[4/3] bg-surface-elevated">
              {category.image_url ? (
                <Image
                  src={category.image_url}
                  alt={category.name}
                  fill
                  className="object-cover opacity-80 transition-all group-hover:scale-105 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="font-display text-2xl text-luxury-muted/30">
                    {category.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-deep-black/80 to-transparent" />
              <div className="absolute bottom-0 p-6">
                <h2 className="font-display text-xl text-luxury-white group-hover:text-gold">
                  {category.name}
                </h2>
                {category.description && (
                  <p className="mt-1 text-sm text-luxury-muted line-clamp-2">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
