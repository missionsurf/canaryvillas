import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ALLOWED_KEYS = [
  "defaultPaymentMethod",
  "bankName", "bankAccountName", "bankIban", "bankBic",
  "bankGbpName", "bankGbpAccountName", "bankGbpSortCode", "bankGbpAccountNumber",
  "paypalMe",
];

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await prisma.setting.findMany({
    where: { key: { in: ALLOWED_KEYS } },
  });

  const settings: Record<string, string> = {};
  rows.forEach(r => { settings[r.key] = r.value; });
  return NextResponse.json(settings);
}

export async function PATCH(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body: Record<string, string> = await req.json();

  for (const [key, value] of Object.entries(body)) {
    if (!ALLOWED_KEYS.includes(key)) continue;
    await prisma.setting.upsert({
      where: { key },
      update: { value, updatedAt: new Date() },
      create: { key, value },
    });
  }

  return NextResponse.json({ ok: true });
}
