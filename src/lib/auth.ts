import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token");
  if (!token) return null;

  const admin = await prisma.admin.findUnique({
    where: { email: token.value },
    select: { id: true, email: true, name: true },
  });
  return admin;
}
