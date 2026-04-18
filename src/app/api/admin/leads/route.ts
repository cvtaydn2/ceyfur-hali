import { NextResponse } from "next/server";
import { getLeads, getArchive } from "@/lib/leads-repository";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // "active" or "archive"

    if (type === "archive") {
      const archive = await getArchive();
      return NextResponse.json({ success: true, data: archive });
    }

    const leads = await getLeads();
    return NextResponse.json({ success: true, data: leads });

  } catch (error: any) {
    console.error("Admin Lead API Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Veriler yüklenirken bir hata oluştu." 
    }, { status: 500 });
  }
}
