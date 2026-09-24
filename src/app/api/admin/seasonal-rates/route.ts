import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import { parseISO } from "date-fns";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rates = await prisma.seasonalRate.findMany({
    include: { villa: { select: { name: true } } },
    orderBy: [{ villaId: "asc" }, { startDate: "asc" }],
  });
  return NextResponse.json(rates);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { villaId, name, startDate, endDate, pricePerNight } = await req.json();
  if (!villaId || !name || !startDate || !endDate || !pricePerNight) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const rate = await prisma.seasonalRate.create({
    data: {
      villaId,
      name,
      startDate: parseISO(startDate),
      endDate: parseISO(endDate),
      pricePerNight: Number(pricePerNight),
    },
  });
  return NextResponse.json(rate);
}

export async function DELETE(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await prisma.seasonalRate.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
