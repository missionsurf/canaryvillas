import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Canary Villas — Luxury Holiday Villas in Fuerteventura",
    template: "%s | Canary Villas",
  },
  description:
    "Book stunning beachfront holiday villas in Corralejo, Fuerteventura. Direct booking, best price guaranteed. Sea views, private terraces & year-round sunshine.",
  keywords: [
    "holiday villas Fuerteventura",
    "Corralejo villa rental",
    "beachfront villa Canary Islands",
    "self catering Fuerteventura",
    "villa holiday Spain",
  ],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://www.canaryvillas.com",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
