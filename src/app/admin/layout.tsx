import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ceyfur Admin | İçerik Yönetim Merkezi",
  description: "Ceyfur Halı Yıkama içerik ve site yönetim paneli.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
