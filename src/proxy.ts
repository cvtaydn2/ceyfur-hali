import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge Runtime uyumlu HMAC token üretimi (Web Crypto API)
async function generateExpectedToken(secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode("ceyfur_admin_session_v1")
  );
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isContentApi = pathname.startsWith("/api/content");

  if (!isAdminPage && !isAdminApi && !isContentApi) {
    return NextResponse.next();
  }

  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    // Sunucu yapılandırma hatası — API için 500, sayfa için login'e yönlendir
    if (isAdminPage) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json(
      { success: false, message: "Sunucu yapılandırma hatası." },
      { status: 500 }
    );
  }

  const sessionCookie = request.cookies.get("admin_session")?.value;
  const expectedToken = await generateExpectedToken(adminSecret);
  const isAuthenticated = sessionCookie === expectedToken;

  if (!isAuthenticated) {
    if (isAdminPage) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.json(
      { success: false, message: "Yetkisiz erişim." },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/content/:path*"],
};
