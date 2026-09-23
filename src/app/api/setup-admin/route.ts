import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    return NextResponse.json({ error: "ADMIN_EMAIL or ADMIN_PASSWORD not set" }, { status: 500 });
  }

  const existing = await prisma.admin.findUnique({ where: { email } });
  if (existing) {
    const hashed = await hashPassword(password);
    await prisma.admin.update({ where: { email }, data: { password: hashed } });
    return NextResponse.json({ message: "Admin password updated", email, passwordLength: password.length });
  }

  const hashed = await hashPassword(password);
  await prisma.admin.create({
    data: { email, password: hashed, name: "Admin" },
  });

  return NextResponse.json({ message: "Admin account created", email, passwordLength: password.length });
}
