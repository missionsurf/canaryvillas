import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 50;
  const skip = (page - 1) * limit;

  const [emails, total] = await Promise.all([
    prisma.emailLog.findMany({
      orderBy: { sentAt: "desc" },
      skip,
      take: limit,
      select: { id: true, recipient: true, subject: true, type: true, bookingId: true, sentAt: true },
    }),
    prisma.emailLog.count(),
  ]);

  return NextResponse.json({ emails, total, page, pages: Math.ceil(total / limit) });
}
