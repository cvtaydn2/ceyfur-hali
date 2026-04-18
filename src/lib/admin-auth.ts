import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function getSessionToken(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET not configured");
  }
  return crypto.createHmac("sha256", secret).update("ceyfur_admin_session_v1").digest("hex");
}

export async function requireAuth() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("admin_session");

  if (!sessionCookie?.value) {
    return NextResponse.json({ success: false, message: "Yetkisiz erişim" }, { status: 401 });
  }

  const expectedToken = getSessionToken();
  if (sessionCookie.value !== expectedToken) {
    return NextResponse.json({ success: false, message: "Geçersiz oturum" }, { status: 401 });
  }

  return null;
}