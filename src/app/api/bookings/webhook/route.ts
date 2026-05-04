import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/email";
import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;

    if (bookingId) {
      const booking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
          status: "confirmed",
          stripePaymentId: session.payment_intent as string,
        },
        include: { villa: true },
      });

      // Send confirmation email
      try {
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
      } catch (emailErr) {
        console.error("Email send failed:", emailErr);
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.bookingId;
    if (bookingId) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: "cancelled" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
