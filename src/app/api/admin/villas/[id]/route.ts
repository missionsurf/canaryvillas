import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  const villa = await prisma.villa.findUnique({ where: { id } });
  if (!villa) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(villa);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const allowed = ["name", "description", "shortDesc", "location", "bedrooms", "bathrooms", "beds", "maxGuests", "amenities"];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  try {
    const villa = await prisma.villa.update({ where: { id }, data });
    return NextResponse.json(villa);
  } catch (err) {
    console.error("[villa patch]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
