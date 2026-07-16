import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation, sendBalancePaidConfirmation } from "@/lib/email";
import { syncAirbnbCalendar } from "@/lib/ical-sync";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

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
    const paymentType = session.metadata?.paymentType ?? "deposit";

    if (bookingId) {
      if (paymentType === "balance") {
        const booking = await prisma.booking.update({
          where: { id: bookingId },
          data: { balancePaid: true },
          include: { villa: true },
        });
        try {
          await sendBalancePaidConfirmation({
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
        } catch (err) {
          console.error("Balance confirmation email failed:", err);
        }
      } else {
        const booking = await prisma.booking.update({
          where: { id: bookingId },
          data: {
            status: "confirmed",
            depositPaid: true,
            stripePaymentId: session.payment_intent as string,
          },
          include: { villa: true },
        });
        // Re-sync Airbnb calendar so new booking blocks dates there too
        try {
          const villa = await prisma.villa.findUnique({ where: { id: booking.villaId }, select: { airbnbIcalUrl: true } });
          if (villa?.airbnbIcalUrl) await syncAirbnbCalendar(booking.villaId, villa.airbnbIcalUrl);
        } catch (syncErr) {
          console.error("Post-booking sync failed:", syncErr);
        }

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
            depositAmount: booking.depositAmount ?? booking.totalPrice,
            balanceAmount: booking.balanceAmount ?? 0,
            balanceDueDate: booking.balanceDueDate,
            paymentMethod: "stripe",
            bookingId: booking.id,
          });
        } catch (emailErr) {
          console.error("Email send failed:", emailErr);
        }
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
