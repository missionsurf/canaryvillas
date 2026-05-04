import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { differenceInDays, parseISO } from "date-fns";

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

    // Check for conflicts
    const conflicting = await prisma.booking.findFirst({
      where: {
        villaId,
        status: { in: ["pending", "confirmed"] },
        OR: [
          { checkIn: { lt: checkOutDate }, checkOut: { gt: checkInDate } },
        ],
      },
    });
    if (conflicting) {
      return NextResponse.json({ error: "Selected dates are not available" }, { status: 409 });
    }

    const pricePerNight = villa.pricePerNight;
    const cleaningFee = villa.cleaningFee;
    const totalPrice = nights * pricePerNight + cleaningFee;

    // Create a pending booking record
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
        notes: notes || null,
        status: "pending",
        source: "direct",
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: guestEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${villa.name} — ${nights} night${nights > 1 ? "s" : ""}`,
              description: `Check-in: ${checkIn.split("T")[0]} · Check-out: ${checkOut.split("T")[0]}`,
              images: [JSON.parse(villa.images)[0]],
            },
            unit_amount: Math.round(nights * pricePerNight * 100),
          },
          quantity: 1,
        },
        ...(cleaningFee > 0
          ? [
              {
                price_data: {
                  currency: "eur",
                  product_data: { name: "Cleaning fee" },
                  unit_amount: Math.round(cleaningFee * 100),
                },
                quantity: 1,
              },
            ]
          : []),
      ],
      metadata: { bookingId: booking.id },
      success_url: `${baseUrl}/booking/success?bookingId=${booking.id}`,
      cancel_url: `${baseUrl}/villas/${villa.slug}?cancelled=true`,
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
