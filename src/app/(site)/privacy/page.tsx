import React from "react";
import { getSiteContent } from "@/lib/content-repository";

export default async function PrivacyPage() {
  const content = await getSiteContent();

  return (
    <main className="pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto glass p-12 rounded-[2.5rem]">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Gizlilik Politikası</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
          <p>
            {content.brand.name} olarak, web sitemizi ziyaret eden kullanıcılarımızın gizliliğini korumak önceliğimizdir. Bu politika, hangi verileri topladığımızı ve bunları nasıl kullandığımızı açıklar.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-800 pt-4">1. Toplanan Veriler</h2>
          <p>
            WhatsApp butonuna tıkladığınızda veya bizi aradığınızda, yalnızca sizinle iletişim kurmak için gerekli olan bilgileri (telefon numarası, isim) işleriz.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 pt-4">2. Verilerin Kullanımı</h2>
          <p>
            Toplanan bilgiler sadece hizmet randevusu oluşturmak ve temizlik hizmetlerimiz hakkında sizi bilgilendirmek amacıyla kullanılır. Verileriniz asla üçüncü taraflarla paylaşılmaz.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 pt-4">3. Çerezler</h2>
          <p>
            Sitemiz, kullanıcı deneyimini iyileştirmek için temel çerezler kullanabilir. Bu çerezler kişisel veri toplamaz.
          </p>
          
          <p className="pt-8 text-sm italic">
            Son güncelleme: 18 Nisan 2024
          </p>
        </div>
      </div>
    </main>
  );
}
