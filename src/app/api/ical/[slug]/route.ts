import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateIcal } from "@/lib/ical-sync";

// Handles /api/ical/beach-house.ics
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug: rawSlug } = await params;
  const slug = rawSlug.replace(/\.ics$/, "");

  const villa = await prisma.villa.findUnique({ where: { slug }, select: { id: true, name: true } });
  if (!villa) {
    return NextResponse.json({ error: "Villa not found" }, { status: 404 });
  }

  const icalStr = await generateIcal(villa.id, villa.name);

  return new NextResponse(icalStr, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.ics"`,
      "Cache-Control": "no-cache",
    },
  });
}
