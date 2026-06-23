import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const publicDir = path.join(process.cwd(), "public", "demo");
    const imagesDir = path.join(publicDir, "images");
    const videosDir = path.join(publicDir, "video");
    const pdfDir = path.join(publicDir, "pdf");

    const extensions = {
      images: ["jpg", "jpeg", "png", "webp", "gif", "svg"],
      videos: ["mp4", "webm", "mov"],
      pdfs: ["pdf"]
    };

    const getFiles = async (dir: string, extList: string[]) => {
      try {
        await fs.access(dir);
        const files = await fs.readdir(dir);
        return files.filter((file) => {
          const ext = path.extname(file).toLowerCase().substring(1);
          return extList.includes(ext);
        });
      } catch {
        return [];
      }
    };

    const images = await getFiles(imagesDir, extensions.images);
    const videos = await getFiles(videosDir, extensions.videos);
    const pdfs = await getFiles(pdfDir, extensions.pdfs);

    return NextResponse.json({
      images,
      videos,
      pdfs
    });
  } catch (err: any) {
    console.error("Scan API error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
export const dynamic = "force-dynamic";
