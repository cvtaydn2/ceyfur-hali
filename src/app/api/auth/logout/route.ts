import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeSession } from "@/lib/admin-auth";
import { writeAuditLog } from "@/lib/audit-log";
import { SESSION_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_CONFIG.cookieName)?.value;

  if (sessionToken) {
    // Session'ı DB'den sil
    await revokeSession(sessionToken).catch(() => {});

    await writeAuditLog({
      action: "logout",
      entityType: "auth",
    });
  }

  cookieStore.delete(SESSION_CONFIG.cookieName);
  return NextResponse.json({ success: true });
}
