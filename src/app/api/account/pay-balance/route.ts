import { NextRequest, NextResponse } from "next/server";
import { getGuestSession } from "@/lib/guest-auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const email = await getGuestSession();
  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { bookingId } = await req.json();
    if (!bookingId) return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { villa: true },
    });

    if (!booking || booking.guestEmail.toLowerCase() !== email.toLowerCase()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (booking.balancePaid) {
      return NextResponse.json({ error: "Balance already paid" }, { status: 400 });
    }

    const balanceAmount = booking.balanceAmount ?? booking.totalPrice;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: booking.guestEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${booking.villa.name} — Balance Payment`,
              description: `Remaining balance for ${booking.checkIn.toISOString().split("T")[0]} to ${booking.checkOut.toISOString().split("T")[0]}`,
              images: [JSON.parse(booking.villa.images)[0]],
            },
            unit_amount: Math.round(balanceAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { bookingId: booking.id, paymentType: "balance" },
      success_url: `${baseUrl}/account/booking/${booking.id}?paid=true`,
      cancel_url: `${baseUrl}/account/booking/${booking.id}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Account pay-balance error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
