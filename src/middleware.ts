import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin, /api/admin, and /api/content
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin") || pathname.startsWith("/api/content")) {
    const adminSecret = process.env.ADMIN_SECRET || "ceyfur_premium_secret_2024";
    const sessionCookie = request.cookies.get("admin_session")?.value;
    const authHeader = request.headers.get("authorization");

    // Recalculate the expected token to verify authenticity
    const expectedToken = crypto
      .createHmac("sha256", adminSecret)
      .update("ceyfur_admin_session_v1")
      .digest("hex");

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
