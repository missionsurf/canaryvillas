import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendArrivalInstructions, sendCustomEmail, sendBookingConfirmation } from "@/lib/email";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { type, subject, htmlBody, arrivalData } = body;

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { villa: true },
  });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  try {
    if (type === "confirmation") {
      await sendBookingConfirmation({
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        villaName: booking.villa.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights: booking.nights,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        bookingId: booking.id,
      });
    } else if (type === "arrival") {
      await sendArrivalInstructions({
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        villaName: booking.villa.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights: booking.nights,
        bookingId: booking.id,
        ...arrivalData,
      });
    } else if (type === "custom") {
      if (!subject || !htmlBody) return NextResponse.json({ error: "subject and htmlBody required" }, { status: 400 });
      await sendCustomEmail(booking.guestEmail, booking.guestName, subject, htmlBody);
    } else {
      return NextResponse.json({ error: "Invalid email type" }, { status: 400 });
    }

    // Log the email in notes
    await prisma.booking.update({
      where: { id },
      data: {
        notes: [
          booking.notes,
          `[${new Date().toISOString()}] Admin sent email: ${type}${subject ? ` — "${subject}"` : ""}`,
        ].filter(Boolean).join("\n"),
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
