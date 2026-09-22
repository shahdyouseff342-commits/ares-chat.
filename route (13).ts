import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || "application/octet-stream";
    const base64Data = `data:${mimeType};base64,${buffer.toString("base64")}`;

    // Format file size
    let formattedSize = `${(file.size / 1024).toFixed(1)} KB`;
    if (file.size > 1024 * 1024) {
      formattedSize = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    // Determine type
    let type: "image" | "video" | "voice" | "file" = "file";
    if (mimeType.startsWith("image/")) {
      type = "image";
    } else if (mimeType.startsWith("video/")) {
      type = "video";
    } else if (mimeType.startsWith("audio/")) {
      type = "voice";
    }

    return NextResponse.json({
      success: true,
      url: base64Data,
      fileName: file.name,
      fileSize: formattedSize,
      mimeType,
      type,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error uploading file";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
