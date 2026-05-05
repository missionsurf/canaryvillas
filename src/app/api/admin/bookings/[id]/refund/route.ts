import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const booking = await prisma.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (!booking.stripePaymentId) return NextResponse.json({ error: "No payment to refund" }, { status: 400 });
  if (booking.status === "refunded") return NextResponse.json({ error: "Already refunded" }, { status: 400 });

  const refund = await stripe.refunds.create({ payment_intent: booking.stripePaymentId });

  await prisma.booking.update({
    where: { id },
    data: {
      status: "refunded",
      notes: [booking.notes, `[${new Date().toISOString()}] Refunded via Stripe (${refund.id})`].filter(Boolean).join("\n"),
    },
  });

  return NextResponse.json({ ok: true, refundId: refund.id });
}
