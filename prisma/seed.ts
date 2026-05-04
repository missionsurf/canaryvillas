import "dotenv/config";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import { VILLAS_SEED } from "../src/data/villas";

const dbPath = path.resolve(process.cwd(), "dev.db");
const adapter = new PrismaLibSql({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("Seeding database...");

  for (const villa of VILLAS_SEED) {
    await prisma.villa.upsert({
      where: { slug: villa.slug },
      update: {
        ...villa,
        images: JSON.stringify(villa.images),
        amenities: JSON.stringify(villa.amenities),
      },
      create: {
        ...villa,
        images: JSON.stringify(villa.images),
        amenities: JSON.stringify(villa.amenities),
      },
    });
    console.log(`  ✓ Villa: ${villa.name}`);
  }

  const adminEmail = process.env.ADMIN_EMAIL || "info@canaryvillas.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Canary Villas Admin",
    },
  });
  console.log(`  ✓ Admin: ${adminEmail}`);
  console.log("Seed complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
