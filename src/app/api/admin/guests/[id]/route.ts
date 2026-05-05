import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Params { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const guest = await prisma.guest.findUnique({ where: { id } });
  if (!guest) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const bookings = await prisma.booking.findMany({
    where: { guestEmail: guest.email },
    include: { villa: { select: { name: true, slug: true } } },
    orderBy: { checkIn: "desc" },
  });

  const totalSpend = bookings
    .filter((b) => b.status === "confirmed" || b.status === "refunded")
    .reduce((s, b) => s + b.totalPrice, 0);

  return NextResponse.json({
    ...guest,
    tags: guest.tags ? JSON.parse(guest.tags) : [],
    bookings,
    totalSpend,
  });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, phone, nationality, notes, tags, marketingOptIn } = body;

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (phone !== undefined) data.phone = phone || null;
  if (nationality !== undefined) data.nationality = nationality || null;
  if (notes !== undefined) data.notes = notes || null;
  if (tags !== undefined) data.tags = tags.length ? JSON.stringify(tags) : null;
  if (marketingOptIn !== undefined) data.marketingOptIn = marketingOptIn;

  const guest = await prisma.guest.update({ where: { id }, data });
  return NextResponse.json({ ...guest, tags: guest.tags ? JSON.parse(guest.tags) : [] });
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.guest.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
