import { notFound } from "next/navigation";
import { getVillaBySlug, getBookedDates } from "@/lib/villas";
import BookingWidget from "@/components/BookingWidget";
import PhotoGallery from "@/components/PhotoGallery";
import { Bed, Bath, Users, MapPin, CheckCircle2 } from "lucide-react";
import ConsentMap from "@/components/ConsentMap";
import PriceDisplay from "@/components/PriceDisplay";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}


export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const villa = await getVillaBySlug(slug);
  if (!villa) return { title: "Villa Not Found" };
  const title = `${villa.name} — Beachfront Villa to Rent in Corralejo, Fuerteventura | Canary Villas`;
  const description = `${villa.shortDesc} Book this ${villa.bedrooms}-bedroom beachfront villa to rent in Corralejo, Fuerteventura — direct booking, best price guaranteed, no hidden fees.`;
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.canaryvillas.com/villas/${slug}`,
      languages: {
        en: `https://www.canaryvillas.com/villas/${slug}`,
        de: `https://www.canaryvillas.com/de/villas/${slug}`,
        es: `https://www.canaryvillas.com/es/villas/${slug}`,
        fr: `https://www.canaryvillas.com/fr/villas/${slug}`,
        nl: `https://www.canaryvillas.com/nl/villas/${slug}`,
        it: `https://www.canaryvillas.com/it/villas/${slug}`,
        "x-default": `https://www.canaryvillas.com/villas/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.canaryvillas.com/villas/${slug}`,
      type: "website",
      images: [{ url: villa.images[0], width: 1200, height: 800, alt: `${villa.name} — holiday villa in Fuerteventura` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [villa.images[0]] },
  };
}

function VillaSchema({ villa }: { villa: Awaited<ReturnType<typeof getVillaBySlug>> }) {
  if (!villa) return null;

  const photos = villa.images.slice(0, 8).map((url) => ({
    "@type": "ImageObject",
    url,
    width: 1200,
    height: 800,
  }));

  const mapsUrl = villa.latitude
    ? `https://www.google.com/maps/search/?api=1&query=${villa.latitude},${villa.longitude}`
    : undefined;

  const schema = {
    "@context": "https://schema.org",
    "@type": "VacationRental",
    name: villa.name,
    description: villa.description,
    url: `https://www.canaryvillas.com/villas/${villa.slug}`,
    image: photos,
    photo: photos,
    priceRange: `€${villa.pricePerNight} per night`,
    keywords: `holiday villa Fuerteventura, beach villa Corralejo, vacation rental Fuerteventura, self catering Corralejo, ${villa.name}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Corralejo",
      addressLocality: "Corralejo",
      addressRegion: "Fuerteventura",
      postalCode: "35660",
      addressCountry: "ES",
    },
    geo: villa.latitude
      ? { "@type": "GeoCoordinates", latitude: villa.latitude, longitude: villa.longitude }
      : undefined,
    hasMap: mapsUrl,
    numberOfRooms: villa.bedrooms + villa.bathrooms,
    numberOfBedrooms: villa.bedrooms,
    numberOfBathroomsTotal: villa.bathrooms,
    floorLevel: "ground",
    occupancy: {
      "@type": "QuantitativeValue",
      minValue: 1,
      maxValue: villa.maxGuests,
      unitText: "guests",
    },
    amenityFeature: villa.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    })),
    checkinTime: "T15:00:00",
    checkoutTime: "T10:00:00",
    petsAllowed: false,
    smokingAllowed: false,
    isAccessibleForFree: false,
    telephone: "+447809870561",
    email: "info@canaryvillas.com",
    tourBookingPage: `https://www.canaryvillas.com/villas/${villa.slug}`,
    starRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "47",
      bestRating: "5",
      worstRating: "1",
    },
    offers: {
      "@type": "Offer",
      price: villa.pricePerNight,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: `https://www.canaryvillas.com/villas/${villa.slug}`,
      priceSpecification: [
        {
          "@type": "UnitPriceSpecification",
          price: villa.pricePerNight,
          priceCurrency: "EUR",
          unitCode: "DAY",
          unitText: "per night",
          name: "Nightly rate",
        },
        ...(villa.cleaningFee > 0
          ? [{
              "@type": "UnitPriceSpecification",
              price: villa.cleaningFee,
              priceCurrency: "EUR",
              name: "Cleaning fee",
            }]
          : []),
      ],
    },
    brand: {
      "@type": "Brand",
      name: "Canary Villas",
      url: "https://www.canaryvillas.com",
    },
    provider: {
      "@type": "LodgingBusiness",
      name: "Canary Villas",
      url: "https://www.canaryvillas.com",
      telephone: "+447809870561",
      email: "info@canaryvillas.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Corralejo",
        addressRegion: "Fuerteventura",
        postalCode: "35660",
        addressCountry: "ES",
      },
    },
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.canaryvillas.com" },
      { "@type": "ListItem", position: 2, name: "Villas", item: "https://www.canaryvillas.com/villas" },
      { "@type": "ListItem", position: 3, name: villa.name, item: `https://www.canaryvillas.com/villas/${villa.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    </>
  );
}

export default async function VillaDetailPage({ params }: Props) {
  const { slug, locale } = await params;
  const t = await getTranslations({ locale, namespace: "villa" });
  const tContent = await getTranslations({ locale, namespace: `villas_content.${slug}` });
  const villa = await getVillaBySlug(slug);
  if (!villa) notFound();

  const bookedDates = await getBookedDates(villa.id);
  const bookedDatesStr = bookedDates.map((d) => d.toISOString());

  return (
    <>
      <VillaSchema villa={villa} />

      <div className="pt-16 min-h-screen">
        <PhotoGallery images={villa.images} villaName={villa.name} imageGroups={villa.imageGroups} />

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
                  <PriceDisplay eurAmount={villa.pricePerNight} className="text-3xl font-extrabold text-sky-600" />
                  <span className="text-gray-500">{t("perNight")}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-gray-600 pb-6 border-b mb-8">
                <span className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-sky-500" />
                  {t("bedrooms", { n: villa.bedrooms })}
                </span>
                <span className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-sky-500" />
                  {t("bathrooms", { n: villa.bathrooms })}
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-sky-500" />
                  {t("guests", { n: villa.maxGuests })}
                </span>
              </div>

              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("about")}</h2>
                <div className="text-gray-600 leading-relaxed space-y-4">
                  {tContent("description").split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-900 mb-4">{t("amenities")}</h2>
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
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t("location")}</h2>
                  <div className="rounded-2xl overflow-hidden border h-72">
                    <ConsentMap
                      lat={villa.latitude!}
                      lng={villa.longitude!}
                      title={`Map showing location of ${villa.name} in Corralejo, Fuerteventura`}
                    />
                  </div>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${villa.latitude},${villa.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-sky-500 hover:text-sky-600 text-sm font-medium"
                  >
                    <MapPin className="w-4 h-4" /> {t("openMaps")}
                  </a>
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
