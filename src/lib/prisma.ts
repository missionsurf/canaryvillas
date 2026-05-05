import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

function createPrismaClient(): PrismaClient {
  const rawUrl = process.env.DATABASE_URL ?? `file:${path.resolve(process.cwd(), "dev.db")}`;
  const isRemote = rawUrl.startsWith("libsql://") || rawUrl.startsWith("https://");

  if (isRemote) {
    // Use HTTP transport — works reliably in Vercel serverless
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createClient } = require("@libsql/client/http");
    const libsql = createClient({ url: rawUrl, authToken: process.env.TURSO_AUTH_TOKEN });
    const adapter = new PrismaLibSql(libsql);
    return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
  }

  // Local file-based SQLite for development
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@libsql/client");
  const libsql = createClient({ url: rawUrl });
  const adapter = new PrismaLibSql(libsql);
  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
