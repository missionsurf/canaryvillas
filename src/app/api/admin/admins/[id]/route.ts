import { NextRequest, NextResponse } from "next/server";
import { getAdminSession, hashPassword, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  if (session.id === id) return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });

  const count = await prisma.admin.count();
  if (count <= 1) return NextResponse.json({ error: "Cannot delete the last admin" }, { status: 400 });

  await prisma.admin.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  if (session.id !== id) return NextResponse.json({ error: "Can only change your own password" }, { status: 403 });

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) return NextResponse.json({ error: "Both fields required" }, { status: 400 });
  if (newPassword.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });

  const admin = await prisma.admin.findUnique({ where: { id } });
  if (!admin) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const valid = await verifyPassword(currentPassword, admin.password);
  if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });

  await prisma.admin.update({ where: { id }, data: { password: await hashPassword(newPassword) } });
  return NextResponse.json({ success: true });
}
