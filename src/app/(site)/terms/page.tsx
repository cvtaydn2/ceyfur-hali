import React from "react";
import { Metadata } from "next";
import { getSiteContent } from "@/lib/content-repository";
import { APP_CONFIG } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const title = `Kullanım Koşulları | ${content.brand.name}`;
  const description = `${content.brand.name} kullanım koşulları. Web sitemizi ve hizmetlerimizi kullanırken geçerli olan şartlar ve koşullar.`;
  return {
    title,
    description,
    alternates: { canonical: `${APP_CONFIG.url}/terms` },
    robots: { index: false, follow: false },
    openGraph: { title, description, url: `${APP_CONFIG.url}/terms`, type: "website" },
  };
}

export default async function TermsPage() {
  const content = await getSiteContent();

  return (
    <main className="pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto glass p-12 rounded-[2.5rem]">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Kullanım Koşulları</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
          <p>
            {content.brand.name} web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-800 pt-4">1. Hizmet Tanımı</h2>
          <p>
            {content.brand.name}, halı, koltuk, perde ve benzeri tekstil ürünlerinin profesyonel temizlik hizmetlerini sunar. Sitede yer alan bilgiler genel bilgilendirme amaçlıdır.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 pt-4">2. Randevu ve İptal</h2>
          <p>
            WhatsApp veya telefon üzerinden oluşturulan randevular, karşılıklı teyit edildikten sonra geçerlilik kazanır. Beklenmedik durumlarda randevu saati değişikliği yapma hakkımız saklıdır.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 pt-4">3. Sorumluluk Reddi</h2>
          <p>
            Ürünlerin aşırı yıpranmış olması veya üzerinde kalıcı lekeler bulunması durumunda, temizleme garantisi sınırlıdır. Hassas dokular öncesinde kontrol edilir ve müşteri bilgilendirilir.
          </p>
          
          <p className="pt-8 text-sm italic">
            Son güncelleme: 18 Nisan 2024
          </p>
        </div>
      </div>
    </main>
  );
}
