import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_CONFIG } from "./lib/constants";

/**
 * Middleware — Edge Runtime'da çalışır.
 *
 * Korunan rotalar:
 * - /admin/*       → admin sayfaları
 * - /api/admin/*   → admin API'leri
 * - /api/content/* → içerik API'leri
 *
 * Session token varlığını kontrol eder.
 * Gerçek doğrulama (DB kontrolü) API route'larında requireAuth() ile yapılır.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isContentApi = pathname.startsWith("/api/content");

  if (!isAdminPage && !isAdminApi && !isContentApi) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(SESSION_CONFIG.cookieName)?.value;

  if (!sessionToken) {
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

  // Token var — gerçek doğrulama API route'larında yapılır
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/content/:path*"],
};
