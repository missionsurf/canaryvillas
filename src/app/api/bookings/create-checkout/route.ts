import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { parseISO, subWeeks } from "date-fns";
import { getEffectivePriceForStay } from "@/lib/pricing";

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

    // Check for conflicts
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

    const pricing = await getEffectivePriceForStay(villaId, checkInDate, checkOutDate);
    const { pricePerNight, cleaningFee, totalPrice, nights } = pricing;

    if (nights < 1) {
      return NextResponse.json({ error: "Minimum stay is 1 night" }, { status: 400 });
    }

    const depositAmount = Math.round(totalPrice / 2 * 100) / 100;
    const balanceAmount = Math.round((totalPrice - depositAmount) * 100) / 100;
    const balanceDueDate = subWeeks(checkInDate, 6);

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
        depositAmount,
        balanceAmount,
        balanceDueDate,
        paymentMethod: "stripe",
        notes: notes || null,
        status: "pending",
        source: "direct",
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Create Stripe Checkout Session for 50% deposit
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: guestEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${villa.name} — 50% Deposit (${nights} night${nights > 1 ? "s" : ""})`,
              description: `Check-in: ${checkIn.split("T")[0]} · Check-out: ${checkOut.split("T")[0]} · Balance of €${balanceAmount.toFixed(2)} due 6 weeks before arrival`,
              images: [JSON.parse(villa.images)[0]],
            },
            unit_amount: Math.round(depositAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: { bookingId: booking.id, paymentType: "deposit" },
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
