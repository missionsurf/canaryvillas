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

  // --- seasonal_rates ---
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

  // --- guest_tokens ---
  await run("guest_tokens table", `
    CREATE TABLE IF NOT EXISTS "guest_tokens" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL,
      "token" TEXT NOT NULL,
      "expiresAt" DATETIME NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await run("guest_tokens email index", `CREATE INDEX IF NOT EXISTS "guest_tokens_email_idx" ON "guest_tokens"("email")`);

  // --- settings ---
  await run("settings table", `
    CREATE TABLE IF NOT EXISTS "settings" (
      "key" TEXT NOT NULL PRIMARY KEY,
      "value" TEXT NOT NULL,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // --- guests ---
  await run("guests table", `
    CREATE TABLE IF NOT EXISTS "guests" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "email" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "phone" TEXT,
      "nationality" TEXT,
      "notes" TEXT,
      "tags" TEXT,
      "marketingOptIn" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await run("guests email unique index", `CREATE UNIQUE INDEX IF NOT EXISTS "guests_email_key" ON "guests"("email")`);

  // --- email_logs ---
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
  // rename old "to" column if it still exists (reserved keyword workaround)
  await run("email_logs rename to->recipient", `ALTER TABLE "email_logs" RENAME COLUMN "to" TO "recipient"`);
  await run("email_logs sentAt index", `CREATE INDEX IF NOT EXISTS "email_logs_sentAt_idx" ON "email_logs"("sentAt")`);
  await run("email_logs bookingId index", `CREATE INDEX IF NOT EXISTS "email_logs_bookingId_idx" ON "email_logs"("bookingId")`);

  // --- column additions ---
  await run("villas.beds column", `ALTER TABLE "villas" ADD COLUMN "beds" TEXT`);
  await run("villas.imageGroups column", `ALTER TABLE "villas" ADD COLUMN "imageGroups" TEXT`);
  await run("bookings.depositAmount column", `ALTER TABLE "bookings" ADD COLUMN "depositAmount" REAL`);
  await run("bookings.depositPaid column", `ALTER TABLE "bookings" ADD COLUMN "depositPaid" BOOLEAN NOT NULL DEFAULT false`);
  await run("bookings.balanceAmount column", `ALTER TABLE "bookings" ADD COLUMN "balanceAmount" REAL`);
  await run("bookings.balancePaid column", `ALTER TABLE "bookings" ADD COLUMN "balancePaid" BOOLEAN NOT NULL DEFAULT false`);
  await run("bookings.balanceDueDate column", `ALTER TABLE "bookings" ADD COLUMN "balanceDueDate" DATETIME`);
  await run("bookings.paymentMethod column", `ALTER TABLE "bookings" ADD COLUMN "paymentMethod" TEXT NOT NULL DEFAULT 'stripe'`);
  await run("bookings.paypalOrderId column", `ALTER TABLE "bookings" ADD COLUMN "paypalOrderId" TEXT`);

  return NextResponse.json({ ok: errors.length === 0, results, errors });
}
