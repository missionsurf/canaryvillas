import { getAllVillas } from "@/lib/villas";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const villas = await getAllVillas();
  return NextResponse.json(
    villas.map((v) => ({
      id: v.id,
      slug: v.slug,
      name: v.name,
      shortDesc: v.shortDesc,
      bedrooms: v.bedrooms,
      bathrooms: v.bathrooms,
      maxGuests: v.maxGuests,
      pricePerNight: v.pricePerNight,
      cleaningFee: v.cleaningFee,
      location: v.location,
      amenities: v.amenities,
      bookingUrl: `https://www.canaryvillas.com/villas/${v.slug}`,
    })),
    {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
