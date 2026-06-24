import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPageBySlug, isCmsSlug } from "@/services/pages.service";

interface CmsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CmsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug).catch(() => null);

  if (!page) return { title: "Page Not Found" };

  return {
    title: page.meta_title ?? page.title,
    description: page.meta_description ?? undefined,
  };
}

export default async function CmsPage({ params }: CmsPageProps) {
  const { slug } = await params;

  if (!isCmsSlug(slug)) {
    notFound();
  }

  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 text-xs text-luxury-muted">
        <Link href="/" className="hover:text-gold">
          Home
        </Link>
        {" / "}
        <span className="text-luxury-white">{page.title}</span>
      </nav>

      <h1 className="font-display text-3xl tracking-wide sm:text-4xl">
        {page.title}
      </h1>

      {page.content ? (
        <div
          className="prose-luxury mt-8"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      ) : (
        <p className="mt-8 text-luxury-muted">
          Content for this page is coming soon.
        </p>
      )}
    </div>
  );
}
