import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ceyfur Admin | Giriş",
  description: "Ceyfur Halı Yıkama yönetim paneli giriş sayfası.",
  robots: "noindex, nofollow",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-slate-50">{children}</div>;
}
