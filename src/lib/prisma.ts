import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function resolveUrl(): { url: string; authToken?: string } {
  const raw = process.env.DATABASE_URL ?? "";

  // Remote Turso — convert libsql:// to https:// (WHATWG URL doesn't support libsql://)
  if (raw.startsWith("libsql://") || raw.startsWith("https://")) {
    return {
      url: raw.replace(/^libsql:\/\//, "https://"),
      authToken: process.env.TURSO_AUTH_TOKEN,
    };
  }

  // Local SQLite — always use an absolute file path
  const absPath = path.resolve(process.cwd(), "dev.db");
  return { url: `file:${absPath}` };
}

function createPrismaClient(): PrismaClient {
  const { url, authToken } = resolveUrl();
  const adapter = new PrismaLibSql({ url, authToken });
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
