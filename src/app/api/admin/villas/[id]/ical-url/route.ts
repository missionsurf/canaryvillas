import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { syncAirbnbCalendar } from "@/lib/ical-sync";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { airbnbIcalUrl } = await req.json();

  const villa = await prisma.villa.update({
    where: { id },
    data: { airbnbIcalUrl: airbnbIcalUrl || null },
  });

  // Immediately sync if a URL was provided
  if (airbnbIcalUrl) {
    await syncAirbnbCalendar(villa.id, airbnbIcalUrl);
  }

  return NextResponse.json({ success: true });
}
