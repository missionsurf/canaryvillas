import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// One-time migration endpoint — delete after running
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "email_logs" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "to" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "type" TEXT NOT NULL,
        "bookingId" TEXT,
        "html" TEXT NOT NULL,
        "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "email_logs_sentAt_idx" ON "email_logs"("sentAt")`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "email_logs_bookingId_idx" ON "email_logs"("bookingId")`);
    return NextResponse.json({ ok: true, message: "email_logs table created" });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
