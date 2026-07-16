import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { differenceInDays, parseISO, subWeeks } from "date-fns";

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;
  const base = process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

  const res = await fetch(`${base}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });
  const data = await res.json();
  return { accessToken: data.access_token as string, base };
}

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
        paymentMethod: "paypal",
        notes: notes || null,
        status: "pending",
        source: "direct",
      },
    });

    const { accessToken, base } = await getPayPalAccessToken();

    const orderRes = await fetch(`${base}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: booking.id,
            description: `${villa.name} — 50% deposit (${nights} nights)`,
            amount: {
              currency_code: "EUR",
              value: depositAmount.toFixed(2),
            },
          },
        ],
      }),
    });

    const order = await orderRes.json();

    await prisma.booking.update({
      where: { id: booking.id },
      data: { paypalOrderId: order.id },
    });

    return NextResponse.json({ bookingId: booking.id, paypalOrderId: order.id });
  } catch (err) {
    console.error("PayPal order creation error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
