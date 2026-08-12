import { cookies } from "next/headers";
import { prisma } from "./prisma";
import crypto from "crypto";

const COOKIE = "guest_session";
const SESSION_DAYS = 30;

export function generateOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export async function createGuestToken(email: string): Promise<string> {
  const token = generateOtp();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await prisma.guestToken.deleteMany({ where: { email } });
  await prisma.guestToken.create({ data: { email, token, expiresAt } });

  return token;
}

export async function verifyGuestToken(email: string, token: string): Promise<boolean> {
  const record = await prisma.guestToken.findFirst({
    where: { email, token, expiresAt: { gt: new Date() } },
  });
  if (!record) return false;
  await prisma.guestToken.delete({ where: { id: record.id } });
  return true;
}

export async function setGuestSession(email: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE, email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * SESSION_DAYS,
    path: "/",
  });
}

export async function getGuestSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const val = cookieStore.get(COOKIE)?.value;
  return val ?? null;
}

export async function clearGuestSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE);
}
