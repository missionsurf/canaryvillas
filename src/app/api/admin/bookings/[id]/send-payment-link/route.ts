import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendBankTransferInstructions, sendPaypalPaymentLink } from "@/lib/email";
import { addWeeks } from "date-fns";

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

  const body: { method: "paypal" | "bank"; amountType: "deposit" | "balance" | "custom"; customAmount?: number } = await req.json();
  const { method, amountType, customAmount } = body;

  const depositAmount = booking.depositAmount ?? Math.round(booking.totalPrice / 2 * 100) / 100;
  const balanceAmount = booking.balanceAmount ?? Math.round(booking.totalPrice / 2 * 100) / 100;

  let amount: number;
  let label: string;
  if (amountType === "deposit") { amount = depositAmount; label = "50% Deposit"; }
  else if (amountType === "balance") { amount = balanceAmount; label = "Balance Payment"; }
  else {
    if (!customAmount || customAmount <= 0) return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    amount = customAmount;
    label = "Payment";
  }

  try {
    if (method === "bank") {
      const balanceDueDate = booking.balanceDueDate ?? addWeeks(booking.checkIn, -6);
      await sendBankTransferInstructions({
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        villaName: booking.villa.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights: booking.nights,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        depositAmount: amount,
        balanceAmount,
        balanceDueDate,
        bookingId: booking.id,
      });
    } else {
      const paypalMeSetting = await prisma.setting.findUnique({ where: { key: "paypalMe" } }).catch(() => null);
      const paypalMe = paypalMeSetting?.value || process.env.PAYPAL_ME || "";
      if (!paypalMe) return NextResponse.json({ error: "PayPal.me handle not configured — add it in Settings" }, { status: 400 });

      const paypalUrl = `https://www.paypal.com/paypalme/${paypalMe}/${amount.toFixed(2)}`;
      await sendPaypalPaymentLink({
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        villaName: booking.villa.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        amount,
        label,
        paypalUrl,
        bookingId: booking.id,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("send-payment-link error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to send" }, { status: 500 });
  }
}
