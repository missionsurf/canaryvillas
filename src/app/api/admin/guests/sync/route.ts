import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Imports all unique guests from existing bookings into the Guest table
export async function POST(_req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    select: { guestEmail: true, guestName: true, guestPhone: true },
    distinct: ["guestEmail"],
    orderBy: { createdAt: "asc" },
  });

  let created = 0;
  let skipped = 0;

  for (const b of bookings) {
    try {
      await prisma.guest.upsert({
        where: { email: b.guestEmail },
        update: {},
        create: {
          email: b.guestEmail,
          name: b.guestName,
          phone: b.guestPhone || null,
        },
      });
      created++;
    } catch {
      skipped++;
    }
  }

  return NextResponse.json({ created, skipped, total: bookings.length });
}
