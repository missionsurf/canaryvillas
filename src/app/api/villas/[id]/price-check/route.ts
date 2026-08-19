import { NextRequest, NextResponse } from "next/server";
import { getEffectivePriceForStay } from "@/lib/pricing";
import { parseISO } from "date-fns";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = req.nextUrl;
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  if (!checkIn || !checkOut) return NextResponse.json({ error: "checkIn and checkOut required" }, { status: 400 });

  try {
    const pricing = await getEffectivePriceForStay(id, parseISO(checkIn), parseISO(checkOut));
    return NextResponse.json(pricing);
  } catch {
    return NextResponse.json({ error: "Villa not found" }, { status: 404 });
  }
}
