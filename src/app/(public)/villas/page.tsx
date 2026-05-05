export const dynamic = "force-dynamic";

import { getAllVillas } from "@/lib/villas";
import VillaCard from "@/components/VillaCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Holiday Villas in Fuerteventura",
  description:
    "Browse our collection of holiday villas in Corralejo, Fuerteventura. Beachfront properties and private bungalows — book direct for the best price.",
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
