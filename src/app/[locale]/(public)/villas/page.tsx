export const dynamic = "force-dynamic";

import { getAllVillas } from "@/lib/villas";
import VillaCard from "@/components/VillaCard";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { Wind, Waves, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "Beachfront Villas to Rent in Corralejo, Fuerteventura | Canary Villas",
  description: "Beachfront holiday villas to rent in Corralejo, Fuerteventura from €95/night. Direct beach access, sea views, private terraces. Book direct — best price guaranteed, no hidden fees.",
  alternates: {
    canonical: "https://www.canaryvillas.com/villas",
    languages: {
      en: "https://www.canaryvillas.com/villas",
      de: "https://www.canaryvillas.com/de/villas",
      es: "https://www.canaryvillas.com/es/villas",
      fr: "https://www.canaryvillas.com/fr/villas",
      nl: "https://www.canaryvillas.com/nl/villas",
      it: "https://www.canaryvillas.com/it/villas",
      "x-default": "https://www.canaryvillas.com/villas",
    },
  },
  openGraph: {
    title: "Holiday Villas to Rent in Fuerteventura | Canary Villas",
    description: "Luxury beachfront villas in Corralejo, Fuerteventura — book direct for the best price.",
    url: "https://www.canaryvillas.com/villas",
    images: [{ url: "https://pnkxfbsjd3gpupqs.public.blob.vercel-storage.com/header-1.jpg", width: 1200, height: 630 }],
  },
};

export default async function VillasPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const villas = await getAllVillas();
  const t = await getTranslations({ locale, namespace: "villas" });

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t("heading")}</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto mb-6">{t("sub")}</p>
          <p className="text-gray-500 text-base max-w-3xl mx-auto">{t("intro")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {villas.map((v) => (
            <VillaCard key={v.id} villa={v} />
          ))}
        </div>

        {villas.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-xl">{t("noVillas")}</p>
            <p className="mt-2">{t("checkBack")}</p>
          </div>
        )}

        {/* Internal landing page links — SEO + user discovery */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Browse by holiday type</h2>
          <p className="text-gray-500 text-center mb-8">Find the perfect villa for your trip to Corralejo, Fuerteventura.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link href={`/${locale}/villas/beachfront-villas-fuerteventura`} className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-4 hover:border-sky-300 hover:shadow-sm transition-all group">
              <Waves className="w-5 h-5 text-sky-500 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-sky-600 transition-colors">Beachfront villas</p>
                <p className="text-xs text-gray-500">Direct beach access, Atlantic views</p>
              </div>
            </Link>
            <Link href={`/${locale}/villas/kitesurfing-accommodation-corralejo`} className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-4 hover:border-sky-300 hover:shadow-sm transition-all group">
              <Wind className="w-5 h-5 text-sky-500 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-sky-600 transition-colors">Kitesurfing accommodation</p>
                <p className="text-xs text-gray-500">2 km from Flag Beach</p>
              </div>
            </Link>
            <Link href={`/${locale}/villas/corralejo-villas-with-private-pool`} className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-5 py-4 hover:border-sky-300 hover:shadow-sm transition-all group">
              <Users className="w-5 h-5 text-sky-500 shrink-0" />
              <div>
                <p className="font-semibold text-gray-900 text-sm group-hover:text-sky-600 transition-colors">Villas with private pool</p>
                <p className="text-xs text-gray-500">Jacuzzi & private outdoor space</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
