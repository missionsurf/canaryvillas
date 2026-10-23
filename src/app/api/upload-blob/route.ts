import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  const filename = formData.get("filename") as string;
  if (!file || !filename) return NextResponse.json({ error: "Missing file or filename" }, { status: 400 });
  const blob = await put(filename, file, { access: "public" });
  return NextResponse.json({ url: blob.url });
}
