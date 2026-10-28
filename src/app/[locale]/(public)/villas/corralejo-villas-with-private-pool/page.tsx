import { getAllVillas } from "@/lib/villas";
import VillaCard from "@/components/VillaCard";
import type { Metadata } from "next";
import Link from "next/link";
import { Waves, Sun, Star, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Corralejo Villas with Private Pool & Jacuzzi, Fuerteventura | Canary Villas",
  description: "Holiday villas in Corralejo, Fuerteventura with private pool or jacuzzi. Direct beachfront access. Book direct — best price guaranteed, no fees. From €95/night.",
  alternates: {
    canonical: "https://www.canaryvillas.com/villas/corralejo-villas-with-private-pool",
    languages: {
      en: "https://www.canaryvillas.com/villas/corralejo-villas-with-private-pool",
      de: "https://www.canaryvillas.com/de/villas/corralejo-villas-with-private-pool",
      "x-default": "https://www.canaryvillas.com/villas/corralejo-villas-with-private-pool",
    },
  },
  openGraph: {
    title: "Corralejo Villas with Private Pool & Jacuzzi | Canary Villas",
    description: "Luxury holiday villas in Corralejo, Fuerteventura with private outdoor space, jacuzzi and sea views. Book direct for the best price.",
    url: "https://www.canaryvillas.com/villas/corralejo-villas-with-private-pool",
    images: [{ url: "https://pnkxfbsjd3gpupqs.public.blob.vercel-storage.com/header-1.jpg", width: 1200, height: 630 }],
  },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Which Canary Villas properties have a private jacuzzi or pool?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Bungalow Apartment features a private outdoor jacuzzi on its sunny terrace, perfect for relaxing under the Fuerteventura sun. The Beach House has direct beachfront terrace access — you step straight onto the sand. Both properties are available to book direct at canaryvillas.com.",
      },
    },
    {
      "@type": "Question",
      name: "Is the jacuzzi heated year-round?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — the jacuzzi at the Bungalow Apartment is available year-round. Fuerteventura's warm climate (average 22°C even in winter) means outdoor use is comfortable throughout the year.",
      },
    },
    {
      "@type": "Question",
      name: "Are the villas suitable for a romantic couple's holiday?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Bungalow Apartment is ideal for couples — a private retreat with a jacuzzi, king-size bed with hotel-grade mattress, and just minutes from Corralejo's restaurants and beaches. It is one of the most sought-after romantic getaways on Fuerteventura.",
      },
    },
    {
      "@type": "Question",
      name: "Can I book the villas for a family holiday?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Beach House sleeps up to 6 guests and is perfect for families — step straight off the private terrace onto the beach, with Corralejo's restaurants and supermarkets a short walk away. The Bungalow Apartment is ideal for smaller families of up to 4.",
      },
    },
  ],
};

const perks = [
  { icon: <Waves className="w-5 h-5" />, title: "Private outdoor space", desc: "Terrace, jacuzzi, or direct beach access — every villa has its own private outdoor area" },
  { icon: <Sun className="w-5 h-5" />, title: "Year-round sunshine", desc: "Fuerteventura averages 300 days of sunshine and 22°C year-round — the outdoor space is usable every month" },
  { icon: <Star className="w-5 h-5" />, title: "Hotel-grade amenities", desc: "Premium mattresses, quality linens, fully equipped kitchens — without the hotel price tag" },
  { icon: <CheckCircle2 className="w-5 h-5" />, title: "Direct booking savings", desc: "Book direct and save 12–20% vs Airbnb — no platform fees, straight to the owners" },
];

export default async function PrivatePoolPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const villas = await getAllVillas();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-teal-600 to-sky-700 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Waves className="w-6 h-6 text-teal-200" />
              <span className="text-teal-200 text-sm font-medium uppercase tracking-wider">Private jacuzzi · Beachfront terrace · Year-round sun</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Corralejo Villas with<br className="hidden sm:block" /> Private Pool &amp; Jacuzzi
            </h1>
            <p className="text-teal-100 text-lg max-w-2xl mx-auto mb-8">
              Luxury holiday villas in Corralejo, Fuerteventura with private outdoor space. Soak in the Atlantic sun on your own terrace or step straight onto the beach. Book direct for the best price.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/${locale}/villas`} className="bg-white text-teal-700 px-6 py-3 rounded-full font-bold text-sm hover:bg-teal-50 transition-colors">
                View all villas
              </Link>
              <Link href={`/${locale}/contact`} className="border border-white/60 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors">
                Ask a question
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Perks */}
          <div className="mb-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Why choose a private villa in Corralejo?</h2>
            <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">
              More space, more privacy, better value than a hotel — with your own outdoor space in the sun.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {perks.map((p, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="text-teal-500 mb-3">{p.icon}</div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{p.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Villa cards */}
          <div className="mb-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Our Corralejo villas</h2>
            <p className="text-gray-500 mb-8">Both villas include private outdoor spaces and are available to book direct.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {villas.map(v => <VillaCard key={v.id} villa={v} />)}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Frequently asked questions</h2>
            <div className="space-y-3">
              {pageSchema.mainEntity.map((q, i) => (
                <details key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden group">
                  <summary className="px-5 py-4 text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-50 list-none flex items-center justify-between">
                    {q.name}
                    <span className="text-gray-400 ml-2 text-lg leading-none group-open:rotate-45 transition-transform inline-block">+</span>
                  </summary>
                  <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{q.acceptedAnswer.text}</p>
                </details>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
