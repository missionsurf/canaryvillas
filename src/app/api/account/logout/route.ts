import { NextResponse } from "next/server";
import { clearGuestSession } from "@/lib/guest-auth";

export async function POST() {
  await clearGuestSession();
  return NextResponse.json({ ok: true });
}
