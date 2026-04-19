import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/content-repository";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json({ success: true, content });
  } catch (error) {
    console.error("Content GET hatası:", error);
    return NextResponse.json(
      { success: false, message: "İçerik alınamadı." },
      { status: 500 }
    );
  }
}
