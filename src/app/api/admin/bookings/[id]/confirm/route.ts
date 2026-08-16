import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { sendPaymentRequest } from "@/lib/email";

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://canaryvillas.com";
  const depositAmount = booking.depositAmount ?? Math.round(booking.totalPrice / 2 * 100) / 100;

  // Create a Stripe Payment Link the guest can use
  const session2 = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: booking.guestEmail,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${booking.villa.name} — 50% Deposit`,
            description: `Check-in: ${booking.checkIn.toISOString().split("T")[0]} · Check-out: ${booking.checkOut.toISOString().split("T")[0]}`,
          },
          unit_amount: Math.round(depositAmount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { bookingId: booking.id, paymentType: "deposit" },
    success_url: `${baseUrl}/booking/success?bookingId=${booking.id}`,
    cancel_url: `${baseUrl}/account/booking/${booking.id}`,
  });

  // Update booking to confirmed, store stripe session
  await prisma.booking.update({
    where: { id },
    data: {
      status: "confirmed",
      stripeSessionId: session2.id,
      notes: [
        booking.notes,
        `[${new Date().toISOString()}] Admin confirmed enquiry — payment link sent to guest`,
      ].filter(Boolean).join("\n"),
    },
  });

  // Email the guest their payment link
  await sendPaymentRequest({
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    villaName: booking.villa.name,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    nights: booking.nights,
    guests: booking.guests,
    totalPrice: booking.totalPrice,
    depositAmount,
    balanceAmount: booking.balanceAmount ?? booking.totalPrice - depositAmount,
    balanceDueDate: booking.balanceDueDate,
    paymentMethod: booking.paymentMethod,
    bookingId: booking.id,
    stripeUrl: session2.url!,
  });

  return NextResponse.json({ ok: true });
}
