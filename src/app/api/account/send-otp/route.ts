import { NextRequest, NextResponse } from "next/server";
import { createGuestToken } from "@/lib/guest-auth";
import { sendGuestOtp } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const normalised = email.trim().toLowerCase();

    const booking = await prisma.booking.findFirst({
      where: { guestEmail: normalised },
    });
    if (!booking) {
      // Don't reveal whether the email exists
      return NextResponse.json({ ok: true });
    }

    const otp = await createGuestToken(normalised);
    await sendGuestOtp(normalised, otp);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
