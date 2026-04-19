import { getSiteContent } from "@/lib/content-repository";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * Public site layout — Navbar, Footer ve WhatsApp butonu sadece burada render edilir.
 * Admin ve auth sayfaları bu layout'u almaz.
 */
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await getSiteContent();

  return (
    <>
      <Navbar content={content} />
      {children}
      <Footer content={content} />
      <WhatsAppButton content={content} />
    </>
  );
}
