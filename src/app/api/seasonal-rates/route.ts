import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const villaId = searchParams.get("villaId");
  if (!villaId) return NextResponse.json({ error: "villaId required" }, { status: 400 });

  const rates = await prisma.seasonalRate.findMany({
    where: { villaId },
    orderBy: { startDate: "asc" },
  });
  return NextResponse.json(rates);
}
