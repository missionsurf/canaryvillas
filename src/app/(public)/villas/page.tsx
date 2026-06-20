export const dynamic = "force-dynamic";

import { getAllVillas } from "@/lib/villas";
import VillaCard from "@/components/VillaCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Holiday Villas to Rent in Fuerteventura — Corralejo | Canary Villas",
  description: "Browse luxury holiday villas to rent in Corralejo, Fuerteventura. Beachfront villas, private bungalows and self-catering accommodation. Book direct for the best price guaranteed.",
alternates: { canonical: "https://canaryvillas.com/villas" },
  openGraph: {
    title: "Holiday Villas to Rent in Fuerteventura | Canary Villas",
    description: "Luxury beachfront villas in Corralejo, Fuerteventura — book direct for the best price.",
    url: "https://canaryvillas.com/villas",
    images: [{ url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=1200&q=80", width: 1200, height: 630 }],
  },
};

export default async function VillasPage() {
  const villas = await getAllVillas();

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Our Holiday Villas
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            All properties are in Corralejo, Fuerteventura — with direct booking,
            no fees, and flexible cancellation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {villas.map((v) => (
            <VillaCard key={v.id} villa={v} />
          ))}
        </div>

        {villas.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">No villas available at the moment.</p>
            <p className="mt-2">Please check back soon or contact us directly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
