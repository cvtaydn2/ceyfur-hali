import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Polyfill/Helper for Edge Runtime HMAC generation using Web Crypto
async function generateExpectedToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode("ceyfur_admin_session_v1");
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  
  const signature = await crypto.subtle.sign("HMAC", key, msgData);
  // Convert ArrayBuffer to Hex string
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin, /api/admin, and /api/content
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin") || pathname.startsWith("/api/content")) {
    const adminSecret = process.env.ADMIN_SECRET || "ceyfur_premium_secret_2024";
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const authHeader = request.headers.get("authorization");

    // Recalculate using Web Crypto API
    const expectedToken = await generateExpectedToken(adminSecret);

    const isValidSession = sessionCookie === expectedToken;
    const isValidHeader = authHeader === `Bearer ${adminSecret}`;

    if (isValidSession || isValidHeader) {
      return NextResponse.next();
    }

    // For API routes, return 401
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    // For /admin page, redirect to a simple login page (or just return 401)
    if (pathname === "/admin" || pathname.startsWith("/admin/")) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/content/:path*"],
};
