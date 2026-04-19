import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "admin_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  const isContentApi = pathname.startsWith("/api/content");

  if (!isAdminPage && !isAdminApi && !isContentApi) {
    return NextResponse.next();
  }

  const sessionToken = request.cookies.get(COOKIE_NAME)?.value;

  if (!sessionToken) {
    if (isAdminPage) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
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
