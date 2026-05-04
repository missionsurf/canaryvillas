import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { syncAirbnbCalendar } from "@/lib/ical-sync";

export async function POST() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const villas = await prisma.villa.findMany({
    where: { airbnbIcalUrl: { not: null } },
    select: { id: true, name: true, airbnbIcalUrl: true },
  });

  const results = [];
  for (const villa of villas) {
    if (villa.airbnbIcalUrl) {
      const result = await syncAirbnbCalendar(villa.id, villa.airbnbIcalUrl);
      results.push({ villa: villa.name, ...result });
    }
  }

  return NextResponse.json({ results });
}
