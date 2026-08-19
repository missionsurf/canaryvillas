import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const admins = await prisma.admin.findMany({
    select: { id: true, email: true, name: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });
  return NextResponse.json(admins);
}

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { name, email, password } = await req.json();
  if (!name || !email || !password) return NextResponse.json({ error: "All fields required" }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

  const exists = await prisma.admin.findFirst({ where: { email: email.toLowerCase() } });
  if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

  const admin = await prisma.admin.create({
    data: { name, email: email.toLowerCase(), password: await hashPassword(password) },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  return NextResponse.json(admin);
}
