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
        url: "https://canaryvillas.com/wp-content/uploads/2024/11/header-1.jpg",
        width: 1200,
        height: 630,
        alt: "Canary Villas — Fuerteventura",
      },
    ],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": ["Organization", "LodgingBusiness"],
  name: "Canary Villas",
  url: "https://canaryvillas.com",
  logo: "https://canaryvillas.com/wp-content/uploads/2024/11/header-1.jpg",
  telephone: "+447809870561",
  email: "info@canaryvillas.com",
  priceRange: "€€",
  currenciesAccepted: "EUR, GBP",
  paymentAccepted: "Credit Card, Bank Transfer, PayPal",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Corralejo",
    addressRegion: "Fuerteventura",
    postalCode: "35660",
    addressCountry: "ES",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 28.7291,
    longitude: -13.8684,
  },
  areaServed: {
    "@type": "City",
    name: "Corralejo",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+447809870561",
    email: "info@canaryvillas.com",
    contactType: "customer service",
    availableLanguage: ["English"],
    hoursAvailable: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
      opens: "08:00",
      closes: "21:00",
    },
  },
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    opens: "08:00",
    closes: "21:00",
  },
  sameAs: [
    "https://canaryvillas.com",
  ],
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
    <html lang="en" translate="no" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        {children}
      </body>
    </html>
  );
}
