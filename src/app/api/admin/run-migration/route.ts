import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// One-time migration endpoint — delete after running
export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const results: string[] = [];
  const errors: string[] = [];

  async function run(label: string, sql: string) {
    try {
      await prisma.$executeRawUnsafe(sql);
      results.push(label);
    } catch (err) {
      errors.push(`${label}: ${String(err)}`);
    }
  }

  await run("seasonal_rates table", `
    CREATE TABLE IF NOT EXISTS "seasonal_rates" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "villaId" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "startDate" DATETIME NOT NULL,
      "endDate" DATETIME NOT NULL,
      "pricePerNight" REAL NOT NULL,
      "isSpecialOffer" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "seasonal_rates_villaId_fkey" FOREIGN KEY ("villaId") REFERENCES "villas" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )
  `);

  await run("email_logs table", `
    CREATE TABLE IF NOT EXISTS "email_logs" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "recipient" TEXT NOT NULL,
      "subject" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "bookingId" TEXT,
      "html" TEXT NOT NULL,
      "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await run("email_logs sentAt index", `CREATE INDEX IF NOT EXISTS "email_logs_sentAt_idx" ON "email_logs"("sentAt")`);
  await run("email_logs bookingId index", `CREATE INDEX IF NOT EXISTS "email_logs_bookingId_idx" ON "email_logs"("bookingId")`);

  return NextResponse.json({ ok: errors.length === 0, results, errors });
}
