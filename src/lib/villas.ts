import { prisma } from "./prisma";
import type { Villa } from "@/types";

function parseVilla(v: {
  id: string;
  slug: string;
  name: string;
  description: string;
  shortDesc: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  pricePerNight: number;
  cleaningFee: number;
  images: string;
  imageGroups: string | null;
  amenities: string;
  airbnbIcalUrl: string | null;
}): Villa {
  return {
    ...v,
    images: JSON.parse(v.images),
    imageGroups: v.imageGroups ? JSON.parse(v.imageGroups) : null,
    amenities: JSON.parse(v.amenities),
  };
}

export async function getAllVillas(): Promise<Villa[]> {
  const villas = await prisma.villa.findMany({ orderBy: { createdAt: "asc" } });
  return villas.map(parseVilla);
}

export async function getVillaBySlug(slug: string): Promise<Villa | null> {
  const villa = await prisma.villa.findUnique({ where: { slug } });
  return villa ? parseVilla(villa) : null;
}

export async function getBookedDates(villaId: string): Promise<Date[]> {
  const bookings = await prisma.booking.findMany({
    where: { villaId, status: { in: ["pending", "confirmed"] } },
    select: { checkIn: true, checkOut: true },
  });
  const blocked = await prisma.blockedDate.findMany({
    where: { villaId },
    select: { date: true },
  });

  const dates: Date[] = blocked.map((b) => b.date);
  for (const b of bookings) {
    const current = new Date(b.checkIn);
    while (current < b.checkOut) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  }
  return dates;
}
