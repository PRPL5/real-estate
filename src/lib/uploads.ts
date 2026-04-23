import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

const uploadDir = path.join(process.cwd(), "public", "uploads");
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml"]);

function extensionFor(type: string) {
  switch (type) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/svg+xml":
      return "svg";
    default:
      return "bin";
  }
}

export async function saveUploadedImages(files: File[]) {
  await mkdir(uploadDir, { recursive: true });

  const uploads = [];

  for (const file of files) {
    if (!file.size) continue;
    if (!allowedTypes.has(file.type)) {
      throw new Error("Only JPG, PNG, WEBP, and SVG images are allowed.");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${randomUUID()}.${extensionFor(file.type)}`;
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
    uploads.push({
      url: `/uploads/${filename}`,
      altText: file.name.replace(/\.[^.]+$/, ""),
    });
  }

  return uploads;
}

export async function deleteLocalImages(urls: string[]) {
  await Promise.all(
    urls
      .filter((url) => url.startsWith("/uploads/"))
      .map(async (url) => {
        const filePath = path.join(process.cwd(), "public", url);
        try {
          await unlink(filePath);
        } catch {
          return;
        }
      }),
  );
}
