import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Home, RefreshCw, ExternalLink } from "lucide-react";
import AdminSyncButton from "@/components/AdminSyncButton";
import VillaIcalSettings from "@/components/VillaIcalSettings";

export const dynamic = "force-dynamic";

export default async function PropertiesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin");

  const villas = await prisma.villa.findMany({
    select: {
      id: true, name: true, slug: true, location: true,
      bedrooms: true, maxGuests: true, pricePerNight: true,
      cleaningFee: true, airbnbIcalUrl: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Properties</h1>
          <p className="text-gray-500 text-sm mt-0.5">{villas.length} villa{villas.length !== 1 ? "s" : ""} managed</p>
        </div>

        {/* Calendar sync */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-sky-500" /> Airbnb Calendar Sync
              </h2>
              <p className="text-gray-500 text-sm mt-1">Sync Airbnb iCal feeds to block dates and prevent double-bookings.</p>
            </div>
            <AdminSyncButton />
          </div>

          <div className="space-y-4">
            {villas.map((v) => (
              <VillaIcalSettings
                key={v.id}
                villaId={v.id}
                villaName={v.name}
                villaSlug={v.slug}
                airbnbIcalUrl={v.airbnbIcalUrl}
                baseUrl={process.env.NEXT_PUBLIC_BASE_URL || "https://www.canaryvillas.com"}
              />
            ))}
          </div>
        </div>

        {/* Villa cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {villas.map((v) => (
            <div key={v.id} className="bg-white rounded-2xl border shadow-sm p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Home className="w-4 h-4 text-sky-500" /> {v.name}
                  </h3>
                  <p className="text-gray-400 text-sm">{v.location}</p>
                </div>
                <a
                  href={`/villas/${v.slug}`}
                  target="_blank"
                  className="text-sky-600 hover:text-sky-700"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Bedrooms</p>
                  <p className="font-semibold text-gray-900">{v.bedrooms}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Max guests</p>
                  <p className="font-semibold text-gray-900">{v.maxGuests}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Price / night</p>
                  <p className="font-semibold text-gray-900">€{v.pricePerNight.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs uppercase tracking-wide mb-0.5">Cleaning fee</p>
                  <p className="font-semibold text-gray-900">€{v.cleaningFee.toFixed(0)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
