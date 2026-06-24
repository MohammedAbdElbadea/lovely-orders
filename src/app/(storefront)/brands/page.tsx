import Image from "next/image";
import Link from "next/link";
import { getBrands } from "@/services/brands.service";

export const metadata = {
  title: "Brands",
  description: "Discover luxury beauty brands at LOVELY ORDERS",
};

export default async function BrandsPage() {
  const brands = await getBrands().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl tracking-wide sm:text-4xl">Brands</h1>
      <p className="mt-2 text-luxury-muted">
        Shop the world&apos;s most prestigious beauty houses
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brands/${brand.slug}`}
            className="group flex flex-col items-center rounded-luxury border border-luxury-border/20 bg-premium-black p-8 transition-all hover:border-gold/40"
          >
            {brand.logo_url ? (
              <div className="relative mb-4 h-16 w-full">
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  fill
                  className="object-contain opacity-80 group-hover:opacity-100"
                  sizes="200px"
                />
              </div>
            ) : (
              <span className="mb-4 font-display text-2xl text-luxury-white group-hover:text-gold">
                {brand.name}
              </span>
            )}
            {brand.description && (
              <p className="text-center text-xs text-luxury-muted line-clamp-2">
                {brand.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
