import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const BLOB = "https://pnkxfbsjd3gpupqs.public.blob.vercel-storage.com";
const WP = "https://canaryvillas.com/wp-content/uploads";

export async function GET() {
  const villas = await prisma.villa.findMany({ select: { id: true, name: true, images: true } });
  const results = [];

  for (const villa of villas) {
    const oldImages = JSON.parse(villa.images as unknown as string || "[]") as string[];
    const newImages = oldImages.map((url: string) =>
      url.replace(`${WP}/2019/03/`, `${BLOB}/villas/2019/03/`)
         .replace(`${WP}/2024/11/`, `${BLOB}/villas/2024/11/`)
         .replace(`${WP}/2024/12/`, `${BLOB}/villas/2024/12/`)
    );
    const changed = newImages.filter((u, i) => u !== oldImages[i]).length;
    if (changed > 0) {
      await prisma.villa.update({ where: { id: villa.id }, data: { images: JSON.stringify(newImages) } });
    }
    results.push({ name: villa.name, changed });
  }

  return NextResponse.json({ ok: true, results });
}
