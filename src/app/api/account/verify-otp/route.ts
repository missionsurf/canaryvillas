import { NextRequest, NextResponse } from "next/server";
import { verifyGuestToken, setGuestSession } from "@/lib/guest-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: "Email and code required" }, { status: 400 });
    }

    const normalised = email.trim().toLowerCase();
    const valid = await verifyGuestToken(normalised, otp.trim());

    if (!valid) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
    }

    await setGuestSession(normalised);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
