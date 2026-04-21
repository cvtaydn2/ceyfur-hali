import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ceyfur Admin | İçerik Yönetim Merkezi",
  description: "Ceyfur Halı Yıkama içerik ve site yönetim paneli.",
  robots: "noindex, nofollow",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
