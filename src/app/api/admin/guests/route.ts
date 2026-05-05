import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() ?? "";
  const tag = searchParams.get("tag") ?? "";
  const marketing = searchParams.get("marketing");

  const guests = await prisma.guest.findMany({
    where: {
      ...(q ? {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { nationality: { contains: q } },
        ],
      } : {}),
      ...(marketing === "true" ? { marketingOptIn: true } : {}),
      ...(marketing === "false" ? { marketingOptIn: false } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  // Attach booking stats
  const bookings = await prisma.booking.findMany({
    where: { guestEmail: { in: guests.map((g) => g.email) } },
    select: { guestEmail: true, totalPrice: true, status: true, checkIn: true },
  });

  const statsMap = new Map<string, { bookingCount: number; totalSpend: number; lastStay: Date | null }>();
  for (const b of bookings) {
    const s = statsMap.get(b.guestEmail) ?? { bookingCount: 0, totalSpend: 0, lastStay: null };
    if (b.status === "confirmed" || b.status === "refunded") {
      s.bookingCount++;
      s.totalSpend += b.totalPrice;
      if (!s.lastStay || b.checkIn > s.lastStay) s.lastStay = b.checkIn;
    }
    statsMap.set(b.guestEmail, s);
  }

  const result = guests
    .filter((g) => !tag || (g.tags && JSON.parse(g.tags).includes(tag)))
    .map((g) => ({
      ...g,
      tags: g.tags ? JSON.parse(g.tags) : [],
      ...(statsMap.get(g.email) ?? { bookingCount: 0, totalSpend: 0, lastStay: null }),
    }));

  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { email, name, phone, nationality, notes, tags, marketingOptIn } = await req.json();
  if (!email || !name) return NextResponse.json({ error: "email and name required" }, { status: 400 });

  const guest = await prisma.guest.upsert({
    where: { email },
    update: { name, phone: phone || null, nationality: nationality || null, notes: notes || null, tags: tags ? JSON.stringify(tags) : null, marketingOptIn: marketingOptIn ?? true },
    create: { email, name, phone: phone || null, nationality: nationality || null, notes: notes || null, tags: tags ? JSON.stringify(tags) : null, marketingOptIn: marketingOptIn ?? true },
  });

  return NextResponse.json({ ...guest, tags: guest.tags ? JSON.parse(guest.tags) : [] });
}
