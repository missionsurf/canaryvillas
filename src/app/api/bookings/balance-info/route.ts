import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const bookingId = req.nextUrl.searchParams.get("bookingId");
  if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { villa: true },
  });

  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.status !== "confirmed") return NextResponse.json({ error: "Booking not confirmed" }, { status: 400 });

  return NextResponse.json({
    id: booking.id,
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    villaName: booking.villa.name,
    checkIn: booking.checkIn.toISOString(),
    checkOut: booking.checkOut.toISOString(),
    nights: booking.nights,
    totalPrice: booking.totalPrice,
    depositAmount: booking.depositAmount ?? booking.totalPrice / 2,
    balanceAmount: booking.balanceAmount ?? booking.totalPrice / 2,
    balanceDueDate: booking.balanceDueDate?.toISOString() ?? null,
    balancePaid: booking.balancePaid,
  });
}
