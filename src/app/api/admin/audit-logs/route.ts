import { NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/audit-log";
import { requireAuth } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authError = await requireAuth();
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 200);

    const logs = await getAuditLogs(limit);
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error("[admin/audit-logs] GET hatası:", error);
    return NextResponse.json(
      { success: false, message: "Loglar alınamadı." },
      { status: 500 }
    );
  }
}
