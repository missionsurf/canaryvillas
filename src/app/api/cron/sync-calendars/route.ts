import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { syncAirbnbCalendar } from "@/lib/ical-sync";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

  return NextResponse.json({ synced: results.length, results });
}
