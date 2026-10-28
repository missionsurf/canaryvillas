import { getAllVillas } from "@/lib/villas";
import VillaCard from "@/components/VillaCard";
import type { Metadata } from "next";
import Link from "next/link";
import { Wind, Waves, MapPin, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kitesurfing Accommodation Corralejo, Fuerteventura | Canary Villas",
  description: "Holiday villas in Corralejo, Fuerteventura — perfectly located for kitesurfing at Flag Beach and El Cotillo. Direct booking, best price guaranteed. From €95/night.",
  alternates: {
    canonical: "https://www.canaryvillas.com/villas/kitesurfing-accommodation-corralejo",
    languages: {
      en: "https://www.canaryvillas.com/villas/kitesurfing-accommodation-corralejo",
      de: "https://www.canaryvillas.com/de/villas/kitesurfing-accommodation-corralejo",
      "x-default": "https://www.canaryvillas.com/villas/kitesurfing-accommodation-corralejo",
    },
  },
  openGraph: {
    title: "Kitesurfing Accommodation Corralejo, Fuerteventura | Canary Villas",
    description: "Holiday villas in Corralejo close to Flag Beach — the world-class kitesurfing spot on Fuerteventura. Book direct for the best price.",
    url: "https://www.canaryvillas.com/villas/kitesurfing-accommodation-corralejo",
    images: [{ url: "https://pnkxfbsjd3gpupqs.public.blob.vercel-storage.com/header-1.jpg", width: 1200, height: 630 }],
  },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How far is Flag Beach from Canary Villas accommodation in Corralejo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Flag Beach (Playa de la Bandera), Corralejo's world-famous kitesurfing spot, is approximately 2–3 km from our Corralejo villas — a 5 to 8-minute drive. Many guests cycle or take a taxi. Several kitesurfing schools, gear hire shops, and the annual Fuerteventura Kiteboarding World Cup are based here.",
      },
    },
    {
      "@type": "Question",
      name: "Can I store kitesurfing equipment at the villas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — our villas have outdoor storage and terrace space suitable for boards, kites, and wetsuits. Please contact us in advance if you are bringing a large amount of equipment and we will make suitable arrangements.",
      },
    },
    {
      "@type": "Question",
      name: "Which is the best beach for kitesurfing near Corralejo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Flag Beach (Playa de la Bandera) is the most popular spot, hosting the annual PWA Kite World Cup. Grandes Playas (just past the Corralejo Dunes) also offers excellent conditions. El Cotillo, on the west coast, is a 20-minute drive and is excellent for both kitesurfing and windsurfing.",
      },
    },
    {
      "@type": "Question",
      name: "Are there kitesurfing schools near the villas?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — several IKO-certified kitesurfing schools operate directly on Flag Beach, a short drive from our villas. We can recommend local schools and arrange lessons for guests on request.",
      },
    },
  ],
};

const highlights = [
  { icon: <Wind className="w-5 h-5" />, title: "Flag Beach access", desc: "2 km from the villas — Fuerteventura's premier kitesurfing spot, host of the annual PWA World Cup" },
  { icon: <Waves className="w-5 h-5" />, title: "Year-round wind", desc: "Fuerteventura's consistent trade winds make it a world-class destination for kitesurfing, windsurfing and wing foiling" },
  { icon: <MapPin className="w-5 h-5" />, title: "Corralejo base", desc: "Walk to restaurants, supermarkets and equipment hire — everything you need between sessions" },
  { icon: <CheckCircle2 className="w-5 h-5" />, title: "Equipment-friendly", desc: "Outdoor storage, terrace space, and easy hosing-down access for boards, kites and wetsuits" },
];

export default async function KitesurfingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const villas = await getAllVillas();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }} />

      <div className="pt-20 min-h-screen bg-gray-50">
        {/* Hero */}
        <div className="bg-gradient-to-br from-sky-600 to-sky-800 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Wind className="w-6 h-6 text-sky-200" />
              <span className="text-sky-200 text-sm font-medium uppercase tracking-wider">Kitesurfing · Windsurfing · Wing Foiling</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Kitesurfing Accommodation<br className="hidden sm:block" /> in Corralejo, Fuerteventura
            </h1>
            <p className="text-sky-100 text-lg max-w-2xl mx-auto mb-8">
              Stay minutes from Flag Beach — one of the world's best kitesurfing spots. Direct booking, best price guaranteed, no hidden fees.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href={`/${locale}/villas`} className="bg-white text-sky-700 px-6 py-3 rounded-full font-bold text-sm hover:bg-sky-50 transition-colors">
                View all villas
              </Link>
              <Link href={`/${locale}/contact`} className="border border-white/60 text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-white/10 transition-colors">
                Ask a question
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

          {/* Why stay here */}
          <div className="mb-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2 text-center">Why kitesurfers love staying in Corralejo</h2>
            <p className="text-gray-500 text-center mb-8 max-w-2xl mx-auto">
              Fuerteventura is one of the best kitesurfing destinations in the world. Our villas put you right in the heart of the action.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {highlights.map((h, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="text-sky-500 mb-3">{h.icon}</div>
                  <p className="font-bold text-gray-900 text-sm mb-1">{h.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Villa cards */}
          <div className="mb-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Our Corralejo villas</h2>
            <p className="text-gray-500 mb-8">Both villas are a short drive from Flag Beach and the Corralejo Dunes wind corridor.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {villas.map(v => <VillaCard key={v.id} villa={v} />)}
            </div>
          </div>

          {/* Flag Beach guide */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 mb-16">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Flag Beach, Corralejo — a quick guide for kitesurfers</h2>
            <div className="prose prose-sm text-gray-600 max-w-none space-y-3">
              <p>
                <strong>Flag Beach (Playa de la Bandera)</strong> sits approximately 2 km south of Corralejo town centre, nestled between the Grandes Playas dunes and the Atlantic Ocean. It hosts the annual <strong>PWA Kite World Cup</strong> — one of the sport's most prestigious events — and is renowned for its consistent thermal winds, reliable side-shore conditions, and flat-water lagoon sections perfect for beginners and freestylers alike.
              </p>
              <p>
                The beach is lined with IKO-certified kitesurfing schools, gear rental shops, and beach bars. Wind conditions are strongest from May to September (the trade wind season), but Fuerteventura's location means you can kite comfortably year-round.
              </p>
              <p>
                <strong>Grandes Playas</strong>, stretching further south into the Corralejo Dunes Natural Park, offers wilder conditions for more experienced riders. <strong>El Cotillo</strong>, on the west coast (about 20 minutes' drive), is excellent for kitesurfing, windsurfing, and wing foiling with a different wind angle.
              </p>
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
