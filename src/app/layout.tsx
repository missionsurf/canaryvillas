import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Canary Villas — Luxury Holiday Villas in Fuerteventura",
    template: "%s | Canary Villas",
  },
  description:
    "Book stunning beachfront holiday villas in Corralejo, Fuerteventura. Direct booking, best price guaranteed. Sea views, private terraces & year-round sunshine.",
  alternates: {
    canonical: "https://canaryvillas.com",
    languages: {
      "en": "https://canaryvillas.com",
      "de": "https://canaryvillas.com",
      "x-default": "https://canaryvillas.com",
    },
  },
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://canaryvillas.com",
    siteName: "Canary Villas",
    images: [
      {
        url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "Canary Villas — Fuerteventura",
      },
    ],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Canary Villas",
  url: "https://canaryvillas.com",
  logo: "https://canaryvillas.com/favicon.ico",
  telephone: "+447809870561",
  email: "info@canaryvillas.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Corralejo",
    addressRegion: "Fuerteventura",
    addressCountry: "ES",
  },
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Canary Villas",
  url: "https://canaryvillas.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://canaryvillas.com/villas?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        {children}
      </body>
    </html>
  );
}
