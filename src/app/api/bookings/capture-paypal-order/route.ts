import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingConfirmation } from "@/lib/email";

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
    const { bookingId, paypalOrderId } = await req.json();

    if (!bookingId || !paypalOrderId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { accessToken, base } = await getPayPalAccessToken();

    const captureRes = await fetch(`${base}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const capture = await captureRes.json();

    if (capture.status !== "COMPLETED") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: "confirmed",
        depositPaid: true,
        paypalOrderId,
      },
      include: { villa: true },
    });

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
        paymentMethod: "paypal",
        bookingId: booking.id,
      });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
    }

    return NextResponse.json({ success: true, bookingId: booking.id });
  } catch (err) {
    console.error("PayPal capture error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
