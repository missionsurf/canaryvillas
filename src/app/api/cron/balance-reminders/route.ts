import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBalanceReminder } from "@/lib/email";
import { addDays } from "date-fns";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const tomorrow = addDays(now, 1);

  // Find bookings where balance is due within 24 hours, not yet paid
  const bookings = await prisma.booking.findMany({
    where: {
      status: "confirmed",
      depositPaid: true,
      balancePaid: false,
      balanceDueDate: { gte: now, lte: tomorrow },
    },
    include: { villa: true },
  });

  const results: string[] = [];

  for (const booking of bookings) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://canaryvillas.vercel.app";
      await sendBalanceReminder({
        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        villaName: booking.villa.name,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        nights: booking.nights,
        guests: booking.guests,
        totalPrice: booking.totalPrice,
        balanceAmount: booking.balanceAmount ?? booking.totalPrice,
        balanceDueDate: booking.balanceDueDate!,
        payUrl: `${baseUrl}/booking/pay-balance/${booking.id}`,
        bookingId: booking.id,
      });
      results.push(`Sent reminder to ${booking.guestEmail} (booking ${booking.id})`);
    } catch (err) {
      console.error(`Failed to send reminder for booking ${booking.id}:`, err);
      results.push(`Failed: ${booking.id}`);
    }
  }

  return NextResponse.json({ processed: bookings.length, results });
}
