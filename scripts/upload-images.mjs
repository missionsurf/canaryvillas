import { put } from "@vercel/blob";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

const BLOB_READ_WRITE_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;
const IMAGE_DIR = "/Users/roger/Projects/canaryvillas/image-backup";

// All image filenames referenced in villas.ts
const images = [
  { file: "bed1-1.jpg", path: "2024/11/bed1-1.jpg", mime: "image/jpeg" },
  { file: "bed2.jpg", path: "2024/11/bed2.jpg", mime: "image/jpeg" },
  { file: "bed4.jpg", path: "2024/11/bed4.jpg", mime: "image/jpeg" },
  { file: "bed6.jpg", path: "2024/11/bed6.jpg", mime: "image/jpeg" },
  { file: "tv1.jpg", path: "2024/11/tv1.jpg", mime: "image/jpeg" },
  { file: "room4.jpeg", path: "2024/11/room4.jpeg", mime: "image/jpeg" },
  { file: "full-gallery-image-121.jpg", path: "2024/11/full-gallery-image-121.jpg", mime: "image/jpeg" },
  { file: "full-gallery-image-122.jpg", path: "2024/11/full-gallery-image-122.jpg", mime: "image/jpeg" },
  { file: "full-gallery-image-123.jpg", path: "2024/11/full-gallery-image-123.jpg", mime: "image/jpeg" },
  { file: "full-gallery-image-124.jpg", path: "2024/11/full-gallery-image-124.jpg", mime: "image/jpeg" },
  { file: "full-gallery-image-125.jpg", path: "2024/11/full-gallery-image-125.jpg", mime: "image/jpeg" },
  { file: "full-gallery-image-127.jpg", path: "2024/11/full-gallery-image-127.jpg", mime: "image/jpeg" },
  { file: "full-gallery-image-128.jpg", path: "2024/11/full-gallery-image-128.jpg", mime: "image/jpeg" },
  { file: "full-gallery-image-130.jpg", path: "2024/11/full-gallery-image-130.jpg", mime: "image/jpeg" },
  { file: "full-gallery-image-132.jpg", path: "2024/11/full-gallery-image-132.jpg", mime: "image/jpeg" },
  { file: "full-gallery-image-145.jpg", path: "2024/11/full-gallery-image-145.jpg", mime: "image/jpeg" },
  { file: "20241125_095924.jpg", path: "2024/12/20241125_095924.jpg", mime: "image/jpeg" },
  // These were resized versions in original URLs - check for them
  { file: "IMG_9137-1024x768.jpg", path: "2024/11/IMG_9137-1024x768.jpg", mime: "image/jpeg" },
  { file: "IMG_9140-605x465.jpg", path: "2024/11/IMG_9140-605x465.jpg", mime: "image/jpeg" },
  { file: "IMG_9148-605x465.jpg", path: "2024/11/IMG_9148-605x465.jpg", mime: "image/jpeg" },
  { file: "IMG_9152-605x465.jpg", path: "2024/11/IMG_9152-605x465.jpg", mime: "image/jpeg" },
  { file: "IMG_9154-605x465.jpg", path: "2024/11/IMG_9154-605x465.jpg", mime: "image/jpeg" },
];

const results = { uploaded: [], missing: [], failed: [] };

for (const img of images) {
  const localPath = join(IMAGE_DIR, img.file);
  if (!existsSync(localPath)) {
    console.log(`MISSING: ${img.file}`);
    results.missing.push(img.file);
    continue;
  }
  try {
    const buffer = readFileSync(localPath);
    const blob = await put(`villas/${img.path}`, buffer, {
      access: "public",
      contentType: img.mime,
      token: BLOB_READ_WRITE_TOKEN,
    });
    console.log(`✓ ${img.file} → ${blob.url}`);
    results.uploaded.push({ file: img.file, url: blob.url });
  } catch (e) {
    console.error(`✗ ${img.file}: ${e.message}`);
    results.failed.push(img.file);
  }
}

console.log("\n--- RESULTS ---");
console.log(`Uploaded: ${results.uploaded.length}`);
console.log(`Missing:  ${results.missing.length} — ${results.missing.join(", ")}`);
console.log(`Failed:   ${results.failed.length}`);

if (results.uploaded.length > 0) {
  console.log("\n--- URL MAPPING ---");
  for (const r of results.uploaded) {
    console.log(`${r.file}: ${r.url}`);
  }
}
