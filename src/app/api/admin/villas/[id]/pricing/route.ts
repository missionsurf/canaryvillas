import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  const { pricePerNight, cleaningFee } = await req.json();

  if (typeof pricePerNight !== "number" || typeof cleaningFee !== "number") {
    return NextResponse.json({ error: "Invalid values" }, { status: 400 });
  }

  const villa = await prisma.villa.update({
    where: { id },
    data: { pricePerNight, cleaningFee },
    select: { id: true, name: true, pricePerNight: true, cleaningFee: true },
  });

  return NextResponse.json(villa);
}
