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
      console.log("send-otp: no booking found for", normalised);
      // Don't reveal whether the email exists
      return NextResponse.json({ ok: true });
    }

    console.log("send-otp: found booking", booking.id, "sending OTP to", normalised);
    const otp = await createGuestToken(normalised);
    await sendGuestOtp(normalised, otp);
    console.log("send-otp: OTP sent successfully to", normalised);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("send-otp error:", err);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
