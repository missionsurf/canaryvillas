import { NextRequest, NextResponse } from "next/server";
import { getBookedDates } from "@/lib/villas";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const villaId = searchParams.get("villaId");
  const slug = searchParams.get("slug");

  let resolvedVillaId = villaId;

  if (!resolvedVillaId && slug) {
    const villa = await prisma.villa.findUnique({ where: { slug }, select: { id: true } });
    resolvedVillaId = villa?.id ?? null;
  }

  if (!resolvedVillaId) {
    return NextResponse.json({ error: "villaId or slug required" }, { status: 400 });
  }

  const dates = await getBookedDates(resolvedVillaId);
  return NextResponse.json({ bookedDates: dates.map((d) => d.toISOString()) });
}
