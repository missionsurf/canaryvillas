import { getAllVillas } from "@/lib/villas";
import VillaCard from "@/components/VillaCard";
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Beachfront Villas to Rent in Fuerteventura | Corralejo | Canary Villas",
  description: "Book beachfront holiday villas to rent in Corralejo, Fuerteventura. Direct sea access, private terraces and stunning Atlantic views. Book direct — best price guaranteed, zero booking fees.",
  alternates: {
    canonical: "https://www.canaryvillas.com/villas/beachfront-villas-fuerteventura",
  },
  openGraph: {
    title: "Beachfront Villas to Rent in Fuerteventura | Canary Villas",
    description: "Luxury beachfront holiday villas in Corralejo, Fuerteventura. Direct sea access, private terraces. Book direct for the best price.",
    url: "https://www.canaryvillas.com/villas/beachfront-villas-fuerteventura",
    images: [{ url: "https://pnkxfbsjd3gpupqs.public.blob.vercel-storage.com/header-1.jpg", width: 1200, height: 630 }],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are there direct beachfront villas available in Corralejo?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — The Beach House is a direct beachfront villa in Corralejo with panoramic Atlantic views and step-off-the-terrace beach access. It sleeps up to 6 guests and is available to book direct from €180/night." },
    },
    {
      "@type": "Question",
      name: "What is included when renting a villa in Fuerteventura with Canary Villas?",
      acceptedAnswer: { "@type": "Answer", text: "All our villas include free WiFi, fully equipped kitchen, private terrace, UK TV channels, and full linen and towels. The Beach House also has a private swimming pool and direct beach access. There are no hidden fees — what you see is what you pay." },
    },
    {
      "@type": "Question",
      name: "How far in advance should I book a beachfront holiday villa in Fuerteventura?",
      acceptedAnswer: { "@type": "Answer", text: "For peak summer (July–August) and school holiday weeks (Christmas, Easter, half term), we recommend booking 3–6 months in advance as beachfront properties fill up quickly. For shoulder season travel (April–June, September–October), 4–8 weeks is usually sufficient." },
    },
    {
      "@type": "Question",
      name: "Is it cheaper to book a beachfront villa direct rather than through Airbnb?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — booking direct with Canary Villas avoids the 12–18% Airbnb guest service fee. On a typical week's stay that can save you €200–€400. We also offer flexible payment options including bank transfer and card." },
    },
  ],
};

export default async function BeachfrontVillasPage() {
  const villas = await getAllVillas();
  const beachfront = villas.filter(v => v.amenities?.includes("Beachfront location") || v.slug === "beach-house");

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="pt-16 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-b from-sky-700 to-sky-500 text-white py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sky-200 text-sm font-semibold uppercase tracking-widest mb-4">Corralejo, Fuerteventura</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Beachfront Holiday Villas to Rent in Fuerteventura
            </h1>
            <p className="text-sky-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              Direct sea access, panoramic Atlantic views, private terraces. Book direct with Canary Villas — no platform fees, best price guaranteed.
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              {["Direct beach access", "Private terraces", "Sea views", "Book direct & save", "Local team in Corralejo"].map(f => (
                <span key={f} className="flex items-center gap-1.5 bg-white/20 rounded-full px-4 py-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {f}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Villas */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">Our Beachfront Villas in Corralejo</h2>
            <p className="text-gray-500 mb-10">Hand-picked properties with direct or near-direct beach access in Corralejo, Fuerteventura.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {(beachfront.length > 0 ? beachfront : villas).map(v => <VillaCard key={v.id} villa={v} />)}
            </div>
          </div>
        </section>

        {/* Why beachfront */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-6">Why Choose a Beachfront Villa in Fuerteventura?</h2>
            <div className="prose prose-gray max-w-none text-gray-600 space-y-4">
              <p>Fuerteventura's beaches are among the finest in Europe — miles of white sand, crystal-clear Atlantic water, and sunshine virtually every day of the year. Staying in a beachfront villa puts you directly on the sand, so you can wake up to the sound of the waves, walk straight from your terrace to the sea, and watch the sunset from your own private space.</p>
              <p>Corralejo in the north of the island is the best base for a beachfront villa holiday. The town has fantastic restaurants, bars, and shops, excellent watersports including kitesurfing, windsurfing, surfing and diving, and direct access to the stunning Corralejo Natural Park — 10km of protected white sand dunes.</p>
              <p>Booking a beachfront villa direct with Canary Villas means no Airbnb or Booking.com platform fees (typically 12–18% added on top), flexible payment options, and a local team based in Corralejo who can help before and during your stay.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {faqSchema.mainEntity.map((f) => (
                <div key={f.name} className="bg-white rounded-2xl p-6 border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-2">{f.name}</h3>
                  <p className="text-gray-600 text-sm">{f.acceptedAnswer.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-sky-600 text-white text-center px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">Ready to Book Your Beachfront Villa?</h2>
          <p className="text-sky-100 mb-8 max-w-xl mx-auto">Book direct with Canary Villas — zero booking fees, flexible payment, and a local team on the ground in Corralejo.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/villas" className="bg-white text-sky-600 font-bold px-8 py-4 rounded-full hover:bg-sky-50 transition-colors">View All Villas</Link>
            <Link href="/contact" className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-colors">Contact Us</Link>
          </div>
        </section>
      </div>
    </>
  );
}
