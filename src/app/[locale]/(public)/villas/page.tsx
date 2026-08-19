export const dynamic = "force-dynamic";

import { getAllVillas } from "@/lib/villas";
import VillaCard from "@/components/VillaCard";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: "Holiday Villas to Rent in Fuerteventura — Corralejo | Canary Villas",
  description: "Browse luxury holiday villas to rent in Corralejo, Fuerteventura. Beachfront villas, private bungalows and self-catering accommodation. Book direct for the best price guaranteed.",
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
      </div>
    </div>
  );
}
