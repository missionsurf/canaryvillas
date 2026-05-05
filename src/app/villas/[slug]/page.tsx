import { notFound } from "next/navigation";
import { getVillaBySlug, getBookedDates } from "@/lib/villas";
import BookingWidget from "@/components/BookingWidget";
import PhotoGallery from "@/components/PhotoGallery";
import { Bed, Bath, Users, MapPin, CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const villa = await getVillaBySlug(slug);
  if (!villa) return { title: "Villa Not Found" };
  return {
    title: villa.name,
    description: villa.shortDesc,
    openGraph: {
      images: [villa.images[0]],
    },
  };
}

function VillaSchema({ villa }: { villa: Awaited<ReturnType<typeof getVillaBySlug>> }) {
  if (!villa) return null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: villa.name,
    description: villa.description,
    url: `https://www.canaryvillas.com/villas/${villa.slug}`,
    image: villa.images,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Corralejo",
      addressRegion: "Fuerteventura",
      addressCountry: "ES",
    },
    geo: villa.latitude
      ? {
          "@type": "GeoCoordinates",
          latitude: villa.latitude,
          longitude: villa.longitude,
        }
      : undefined,
    numberOfRooms: villa.bedrooms,
    amenityFeature: villa.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    priceRange: `€${villa.pricePerNight}/night`,
    telephone: "+447809870561",
    email: "info@canaryvillas.com",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function VillaDetailPage({ params }: Props) {
  const { slug } = await params;
  const villa = await getVillaBySlug(slug);
  if (!villa) notFound();

  const bookedDates = await getBookedDates(villa.id);
  const bookedDatesStr = bookedDates.map((d) => d.toISOString());

  return (
    <>
      <VillaSchema villa={villa} />

      <div className="pt-16 min-h-screen">
        <PhotoGallery images={villa.images} villaName={villa.name} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left column */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                    {villa.name}
                  </h1>
                  <p className="flex items-center gap-1 text-gray-500 mt-2">
                    <MapPin className="w-4 h-4" /> {villa.location}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold text-sky-600">
                    €{villa.pricePerNight}
                  </span>
                  <span className="text-gray-500">/night</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-gray-600 pb-6 border-b mb-8">
                <span className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-sky-500" />
                  {villa.bedrooms} bedroom{villa.bedrooms > 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-sky-500" />
                  {villa.bathrooms} bathroom{villa.bathrooms > 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-500" />
                  Up to {villa.maxGuests} guests
                </span>
              </div>

              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About this villa</h2>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  {villa.description.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {villa.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-3 text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-sky-500 shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>

              {villa.latitude && (
                <div className="mb-10">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
                  <div className="rounded-2xl overflow-hidden border bg-gray-100 h-64 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <MapPin className="w-10 h-10 mx-auto mb-2 text-sky-400" />
                      <p className="font-medium">{villa.location}</p>
                      <p className="text-sm">
                        {villa.latitude?.toFixed(4)}, {villa.longitude?.toFixed(4)}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${villa.latitude},${villa.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-block text-sky-500 hover:text-sky-600 text-sm font-medium"
                      >
                        View on Google Maps →
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Booking Widget */}
            <div className="lg:col-span-1">
              <BookingWidget
                villaId={villa.id}
                villaName={villa.name}
                pricePerNight={villa.pricePerNight}
                cleaningFee={villa.cleaningFee}
                maxGuests={villa.maxGuests}
                bookedDates={bookedDatesStr}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
