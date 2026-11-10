import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { differenceInDays } from "date-fns";
import { getEffectivePriceForStay } from "@/lib/pricing";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id }, include: { villa: true } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const {
    guestName, guestEmail, guestPhone,
    checkIn, checkOut, guests,
    pricePerNight, cleaningFee, totalPrice,
    status, sendConfirmation, recalcPricing,
  } = body;

  const checkInDate = checkIn ? new Date(checkIn) : booking.checkIn;
  const checkOutDate = checkOut ? new Date(checkOut) : booking.checkOut;
  const nights = differenceInDays(checkOutDate, checkInDate);
  if (nights < 1) return NextResponse.json({ error: "Check-out must be after check-in" }, { status: 400 });

  let resolvedPPN: number;
  let resolvedCF: number;
  let resolvedTotal: number;

  if (recalcPricing) {
    // Dates changed and admin wants auto-pricing from seasonal rates
    const pricing = await getEffectivePriceForStay(booking.villaId, checkInDate, checkOutDate);
    resolvedPPN = pricing.pricePerNight;
    resolvedCF = pricing.cleaningFee;
    resolvedTotal = pricing.totalPrice;
  } else {
    // Use whatever the client sent (or fall back to existing values)
    resolvedPPN = pricePerNight != null ? Number(pricePerNight) : booking.pricePerNight;
    resolvedCF = cleaningFee != null ? Number(cleaningFee) : booking.cleaningFee;
    resolvedTotal = totalPrice != null ? Number(totalPrice) : booking.totalPrice;
  }

  const updated = await prisma.booking.update({
    where: { id },
    include: { villa: true },
    data: {
      guestName: guestName ?? booking.guestName,
      guestEmail: guestEmail ?? booking.guestEmail,
      guestPhone: guestPhone !== undefined ? (guestPhone || null) : booking.guestPhone,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: guests != null ? Number(guests) : booking.guests,
      pricePerNight: resolvedPPN,
      cleaningFee: resolvedCF,
      totalPrice: resolvedTotal,
      status: status ?? booking.status,
      notes: [
        booking.notes,
        `[${new Date().toISOString()}] Admin edited booking: ${[
          guestName && guestName !== booking.guestName ? `name → ${guestName}` : "",
          guestEmail && guestEmail !== booking.guestEmail ? `email → ${guestEmail}` : "",
          checkIn || checkOut ? `dates → ${checkInDate.toISOString().slice(0, 10)} – ${checkOutDate.toISOString().slice(0, 10)}` : "",
          status && status !== booking.status ? `status → ${status}` : "",
        ].filter(Boolean).join(", ")}`,
      ].filter(Boolean).join("\n"),
    },
  });

  if (sendConfirmation) {
    try {
      const { sendBookingConfirmation } = await import("@/lib/email");
      await sendBookingConfirmation({
        guestName: updated.guestName,
        guestEmail: updated.guestEmail,
        villaName: updated.villa.name,
        checkIn: updated.checkIn,
        checkOut: updated.checkOut,
        nights: updated.nights,
        guests: updated.guests,
        totalPrice: updated.totalPrice,
        depositAmount: updated.depositAmount ?? undefined,
        balanceAmount: updated.balanceAmount ?? undefined,
        balanceDueDate: updated.balanceDueDate,
        bookingId: updated.id,
      });
    } catch (e) {
      console.error("Could not send confirmation:", e);
    }
  }

  return NextResponse.json(updated);
  } catch (err) {
    console.error("Booking PATCH error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
  }
}
