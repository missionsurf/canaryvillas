import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const villas = await prisma.villa.findMany({
    select: { id: true, name: true, pricePerNight: true, cleaningFee: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(villas);
}
