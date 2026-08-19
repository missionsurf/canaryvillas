import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { differenceInDays } from "date-fns";
import { getEffectivePriceForStay } from "@/lib/pricing";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { villaId, guestName, guestEmail, guestPhone, checkIn, checkOut, guests, notes, sendConfirmation } = body;

  if (!villaId || !guestName || !guestEmail || !checkIn || !checkOut || !guests) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const villa = await prisma.villa.findUnique({ where: { id: villaId } });
  if (!villa) return NextResponse.json({ error: "Villa not found" }, { status: 404 });

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = differenceInDays(checkOutDate, checkInDate);
  if (nights < 1) return NextResponse.json({ error: "Check-out must be after check-in" }, { status: 400 });

  // Check for conflicts
  const conflict = await prisma.booking.findFirst({
    where: {
      villaId,
      status: { in: ["pending", "confirmed"] },
      OR: [
        { checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } },
      ],
    },
  });
  if (conflict) return NextResponse.json({ error: "Dates conflict with an existing booking" }, { status: 409 });

  const { pricePerNight, cleaningFee, totalPrice } = await getEffectivePriceForStay(villaId, checkInDate, checkOutDate);

  const booking = await prisma.booking.create({
    data: {
      villaId,
      guestName,
      guestEmail,
      guestPhone: guestPhone || null,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: Number(guests),
      nights,
      pricePerNight,
      cleaningFee,
      totalPrice,
      status: "confirmed",
      source: "direct",
      notes: notes || null,
    },
  });

  if (sendConfirmation) {
    try {
      const { sendBookingConfirmation } = await import("@/lib/email");
      await sendBookingConfirmation({
        guestName,
        guestEmail,
        villaName: villa.name,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        guests: Number(guests),
        totalPrice,
        bookingId: booking.id,
      });
    } catch (e) {
      console.error("Could not send confirmation email:", e);
    }
  }

  return NextResponse.json({ bookingId: booking.id });
}
