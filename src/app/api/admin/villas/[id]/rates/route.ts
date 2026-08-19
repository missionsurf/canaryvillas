import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseISO } from "date-fns";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const { id } = await params;
  const rates = await prisma.seasonalRate.findMany({
    where: { villaId: id },
    orderBy: { startDate: "asc" },
  });
  return NextResponse.json(rates);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const { id } = await params;
  const { name, startDate, endDate, pricePerNight } = await req.json();
  if (!name || !startDate || !endDate || typeof pricePerNight !== "number") {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  if (end <= start) return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });

  const rate = await prisma.seasonalRate.create({
    data: { villaId: id, name, startDate: start, endDate: end, pricePerNight },
  });
  return NextResponse.json(rate);
}
