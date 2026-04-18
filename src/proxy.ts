import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin and /api/content
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/content")) {
    const adminSecret = process.env.ADMIN_SECRET;
    const authCookie = request.cookies.get("admin_auth")?.value;
    const authHeader = request.headers.get("authorization");

    // Check for authorization (either cookie for page or header for API)
    if (authCookie === adminSecret || authHeader === `Bearer ${adminSecret}`) {
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
    // We'll create a simple /login page if not authorized
    if (pathname === "/admin") {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/content/:path*"],
};
