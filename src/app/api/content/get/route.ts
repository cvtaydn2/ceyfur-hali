import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/content-repository";

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch content" }, { status: 500 });
  }
}
