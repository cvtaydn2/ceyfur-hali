import React from "react";
import { siteContent } from "@/data/siteContent";

export default function KVKKPage() {
  return (
    <main className="pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto glass p-12 rounded-[2.5rem]">
        <h1 className="text-4xl font-black text-slate-900 mb-8">KVKK Aydınlatma Metni</h1>
        <div className="prose prose-slate max-w-none space-y-6 text-slate-600">
          <p>
            6698 Sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, {siteContent.brand.name} olarak veri sorumlusu sıfatıyla sizi bilgilendirmek istiyoruz.
          </p>
          
          <h2 className="text-2xl font-bold text-slate-800 pt-4">1. Kişisel Verilerin İşlenme Amacı</h2>
          <p>
            Kişisel verileriniz (ad, soyad, telefon); iletişim faaliyetlerinin yürütülmesi, hizmet satış süreçlerinin yönetilmesi ve müşteri talep/şikayetlerinin takibi amaçlarıyla sınırlı olarak işlenmektedir.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 pt-4">2. Veri Sahibi Hakları</h2>
          <p>
            KVKK'nın 11. maddesi uyarınca; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, verilerin düzeltilmesini veya silinmesini isteme hakkına sahipsiniz.
          </p>

          <h2 className="text-2xl font-bold text-slate-800 pt-4">3. Başvuru</h2>
          <p>
            Haklarınızı kullanmak için {siteContent.contact.email} adresine e-posta gönderebilirsiniz.
          </p>
          
          <p className="pt-8 text-sm italic">
            Son güncelleme: 18 Nisan 2024
          </p>
        </div>
      </div>
    </main>
  );
}
