import { prisma } from "./prisma";
import { eachDayOfInterval, parseISO } from "date-fns";

export interface PriceBreakdown {
  pricePerNight: number; // effective blended rate
  cleaningFee: number;
  totalPrice: number;
  nights: number;
  seasonal: boolean; // true if any seasonal rate was used
}

/**
 * Returns the effective nightly price for a given date, checking seasonal rates first.
 * Falls back to the villa's base price.
 */
export async function getEffectivePriceForStay(
  villaId: string,
  checkIn: Date,
  checkOut: Date
): Promise<PriceBreakdown> {
  const villa = await prisma.villa.findUnique({
    where: { id: villaId },
    select: { pricePerNight: true, cleaningFee: true },
  });
  if (!villa) throw new Error("Villa not found");

  const rates = await prisma.seasonalRate.findMany({
    where: { villaId },
    orderBy: { startDate: "asc" },
  });

  const days = eachDayOfInterval({ start: checkIn, end: new Date(checkOut.getTime() - 86400000) });
  const nights = days.length;

  let totalNightCost = 0;
  let usedSeasonal = false;

  for (const day of days) {
    const rate = rates.find(
      (r) => day >= r.startDate && day <= r.endDate
    );
    if (rate) {
      totalNightCost += rate.pricePerNight;
      usedSeasonal = true;
    } else {
      totalNightCost += villa.pricePerNight;
    }
  }

  const blendedPerNight = nights > 0 ? Math.round((totalNightCost / nights) * 100) / 100 : villa.pricePerNight;
  const totalPrice = Math.round((totalNightCost + villa.cleaningFee) * 100) / 100;

  return {
    pricePerNight: blendedPerNight,
    cleaningFee: villa.cleaningFee,
    totalPrice,
    nights,
    seasonal: usedSeasonal,
  };
}
