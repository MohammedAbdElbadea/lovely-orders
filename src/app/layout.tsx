import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "@/styles/globals.css";
import { ToastProvider } from "@/components/ui";
import { STORE_NAME, STORE_TAGLINE } from "@/lib/constants";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL || "https://lovely-orders.vercel.app";
const siteUrl = rawSiteUrl.startsWith("http://") || rawSiteUrl.startsWith("https://") 
  ? rawSiteUrl 
  : `https://${rawSiteUrl}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${STORE_NAME} | متجر العطور والتجميل الفاخر`,
    template: `%s | ${STORE_NAME}`,
  },
  description: "اكتشف أفخم العطور ومستحضرات التجميل الأصلية من أشهر الماركات العالمية العالمية مع توصيل سريع لجميع المحافظات.",
  keywords: [
    "عطور فخمة",
    "مستحضرات تجميل",
    "تجميل وعناية",
    "ديور",
    "شانيل",
    "عطور رجالية",
    "عطور نسائية",
    "Lovely Orders",
    "متجر عطور اونلاين",
  ],
  authors: [{ name: STORE_NAME }],
  creator: STORE_NAME,
  publisher: STORE_NAME,
  alternates: {
    canonical: siteUrl,
    languages: {
      "ar-EG": siteUrl,
    },
  },
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: siteUrl,
    siteName: STORE_NAME,
    title: `${STORE_NAME} | عطور ومستحضرات تجميل فاخرة`,
    description: "أفخم المنتجات والعطور الأصلية والماركات العالمية بأسعار متميزة وتوصيل سريع.",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: STORE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: STORE_NAME,
    description: STORE_TAGLINE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import { LocaleProvider } from "@/lib/i18n";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: STORE_NAME,
    url: siteUrl,
    description: STORE_TAGLINE,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/products?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${display.variable} ${sans.variable} min-h-screen bg-deep-black font-sans antialiased`}
      >
        <LocaleProvider>
          <ToastProvider>{children}</ToastProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
