import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendBankTransferInstructions } from "@/lib/email";
import { addDays } from "date-fns";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { villa: true },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (booking.status !== "enquiry") {
    return NextResponse.json({ error: "Booking is not an enquiry" }, { status: 400 });
  }

  const depositAmount = booking.depositAmount ?? Math.round(booking.totalPrice / 2 * 100) / 100;
  const balanceAmount = booking.balanceAmount ?? booking.totalPrice - depositAmount;
  const balanceDueDate = booking.balanceDueDate ?? addDays(booking.checkIn, -42);

  await prisma.booking.update({
    where: { id },
    data: {
      status: "confirmed",
      notes: [
        booking.notes,
        `[${new Date().toISOString()}] Admin confirmed enquiry — bank transfer instructions sent to guest`,
      ].filter(Boolean).join("\n"),
    },
  });

  await sendBankTransferInstructions({
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    villaName: booking.villa.name,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    nights: booking.nights,
    guests: booking.guests,
    totalPrice: booking.totalPrice,
    depositAmount,
    balanceAmount,
    balanceDueDate,
    bookingId: booking.id,
  });

  return NextResponse.json({ ok: true });
}
