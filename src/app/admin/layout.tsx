import { Metadata } from "next";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/admin-auth";
import { SESSION_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ceyfur Admin | İçerik Yönetim Merkezi",
  description: "Ceyfur Halı Yıkama içerik ve site yönetim paneli.",
  robots: "noindex, nofollow",
};

/**
 * Admin layout — server-side auth kontrolü.
 * Token yoksa veya geçersizse hiç client'a ulaşmadan /auth/login'e redirect.
 * Bu sayede /api/content/get hiç çağrılmaz → 401 console hatası olmaz.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_CONFIG.cookieName)?.value;

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    redirect("/auth/login");
  }

  const isValid = await validateSession(token);
  if (!isValid) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
