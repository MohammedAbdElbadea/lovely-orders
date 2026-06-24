import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/services/collections.service";

export const metadata = {
  title: "Collections",
  description: "Curated luxury beauty collections",
};

export default async function CollectionsPage() {
  const collections = await getCollections().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl tracking-wide sm:text-4xl">
        Collections
      </h1>
      <p className="mt-2 text-luxury-muted">
        Handpicked edits for every beauty ritual
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.slug}`}
            className="group overflow-hidden rounded-luxury border border-luxury-border/20 bg-premium-black transition-all hover:border-gold/40"
          >
            <div className="relative aspect-[16/10] bg-surface-elevated">
              {collection.image_url ? (
                <Image
                  src={collection.image_url}
                  alt={collection.name}
                  fill
                  className="object-cover opacity-80 transition-all group-hover:scale-105 group-hover:opacity-100"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              ) : (
                <div className="flex h-full items-center justify-center font-display text-3xl text-luxury-muted/20">
                  {collection.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="p-6">
              <h2 className="font-display text-xl group-hover:text-gold">
                {collection.name}
              </h2>
              {collection.description && (
                <p className="mt-2 text-sm text-luxury-muted line-clamp-2">
                  {collection.description}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
