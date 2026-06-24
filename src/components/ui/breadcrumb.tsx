"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
  homeHref?: string;
  separator?: ReactNode;
}

function Breadcrumb({
  items,
  className,
  showHome = true,
  homeHref = "/",
  separator,
}: BreadcrumbProps) {
  const Separator = separator ?? (
    <ChevronRight className="h-4 w-4 text-luxury-muted/50 shrink-0" aria-hidden="true" />
  );

  const allItems: BreadcrumbItem[] = showHome
    ? [{ label: "Home", href: homeHref }, ...items]
    : items;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {allItems.map((item, index) => {
          const isLast = index === allItems.length - 1;
          const isHome = showHome && index === 0;

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <li className="flex items-center" aria-hidden="true">
                  {Separator}
                </li>
              )}
              <li className="flex items-center">
                {isLast || !item.href ? (
                  <span
                    className={cn(
                      "text-luxury-muted",
                      isLast && "text-luxury-white font-medium"
                    )}
                    aria-current={isLast ? "page" : undefined}
                  >
                    {isHome ? (
                      <span className="flex items-center gap-1">
                        <Home className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only">{item.label}</span>
                      </span>
                    ) : (
                      item.label
                    )}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-luxury-muted transition-colors hover:text-gold"
                  >
                    {isHome ? (
                      <span className="flex items-center gap-1">
                        <Home className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="sr-only">{item.label}</span>
                      </span>
                    ) : (
                      item.label
                    )}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}

export { Breadcrumb };
