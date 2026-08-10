import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { differenceInDays, parseISO, subWeeks } from "date-fns";
import { sendBankTransferInstructions } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { villaId, guestName, guestEmail, guestPhone, checkIn, checkOut, guests, notes } = body;

    if (!villaId || !guestName || !guestEmail || !checkIn || !checkOut) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const villa = await prisma.villa.findUnique({ where: { id: villaId } });
    if (!villa) return NextResponse.json({ error: "Villa not found" }, { status: 404 });

    const checkInDate = parseISO(checkIn);
    const checkOutDate = parseISO(checkOut);
    const nights = differenceInDays(checkOutDate, checkInDate);

    if (nights < 1) {
      return NextResponse.json({ error: "Minimum stay is 1 night" }, { status: 400 });
    }

    const conflicting = await prisma.booking.findFirst({
      where: {
        villaId,
        status: { in: ["pending", "confirmed"] },
        OR: [{ checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } }],
      },
    });
    if (conflicting) {
      return NextResponse.json({ error: "Selected dates are not available" }, { status: 409 });
    }

    const pricePerNight = villa.pricePerNight;
    const cleaningFee = villa.cleaningFee;
    const totalPrice = nights * pricePerNight + cleaningFee;
    const depositAmount = Math.round(totalPrice / 2 * 100) / 100;
    const balanceAmount = Math.round((totalPrice - depositAmount) * 100) / 100;
    const balanceDueDate = subWeeks(checkInDate, 6);

    const booking = await prisma.booking.create({
      data: {
        villaId,
        guestName,
        guestEmail,
        guestPhone: guestPhone || null,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: Number(guests) || 1,
        nights,
        pricePerNight,
        cleaningFee,
        totalPrice,
        depositAmount,
        balanceAmount,
        balanceDueDate,
        paymentMethod: "bank_transfer",
        notes: notes || null,
        status: "pending",
        source: "direct",
      },
    });

    try { await sendBankTransferInstructions({
      guestName,
      guestEmail,
      villaName: villa.name,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      nights,
      guests: Number(guests) || 1,
      totalPrice,
      depositAmount,
      balanceAmount,
      balanceDueDate,
      bookingId: booking.id,
    }); } catch (emailErr) { console.error("Bank transfer email failed:", emailErr); }

    return NextResponse.json({ bookingId: booking.id });
  } catch (err) {
    console.error("Bank transfer booking error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
