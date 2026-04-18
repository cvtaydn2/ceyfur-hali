import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = path.join(process.cwd(), "src/data/siteContent.json");
    
    // In a real production app, you would use a database.
    // This is a local development helper for the user.
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to save content" }, { status: 500 });
  }
}
