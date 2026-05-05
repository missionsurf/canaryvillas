import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendSpecialOffer, sendCustomEmail } from "@/lib/email";

interface Params { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const guest = await prisma.guest.findUnique({ where: { id } });
  if (!guest) return NextResponse.json({ error: "Guest not found" }, { status: 404 });

  const body = await req.json();
  const { type } = body;

  try {
    if (type === "offer") {
      await sendSpecialOffer({
        guestName: guest.name,
        guestEmail: guest.email,
        subject: body.subject,
        headline: body.headline,
        bodyHtml: (body.body as string).replace(/\n/g, "<br/>"),
        discountCode: body.discountCode || undefined,
        discountText: body.discountText || undefined,
        validUntil: body.validUntil || undefined,
        ctaText: body.ctaText || undefined,
        ctaUrl: body.ctaUrl || undefined,
      });
    } else if (type === "custom") {
      await sendCustomEmail(
        guest.email,
        guest.name,
        body.subject,
        (body.body as string).replace(/\n/g, "<br/>"),
      );
    } else {
      return NextResponse.json({ error: "Unknown email type" }, { status: 400 });
    }

    // Log in guest notes
    const logLine = `[${new Date().toISOString().slice(0, 10)}] Email sent: "${body.subject}"`;
    await prisma.guest.update({
      where: { id },
      data: { notes: guest.notes ? `${guest.notes}\n${logLine}` : logLine },
    });

    return NextResponse.json({ ok: true });
  } catch (e: unknown) {
    console.error("Email send error:", e);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
