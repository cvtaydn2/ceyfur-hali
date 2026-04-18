"use client";

import React from "react";
import { AdminCard, AdminInputGroup } from "../AdminUI";
import { Input } from "@/components/ui";
import { SiteContent } from "@/types";
import { Plus, Trash2 } from "lucide-react";

interface SectionProps {
  data: SiteContent;
  onChange: (updates: Partial<SiteContent>) => void;
}

export const ContactSection = ({ data, onChange }: SectionProps) => {
  const updateContact = (updates: Partial<SiteContent["contact"]>) => {
    onChange({ contact: { ...data.contact, ...updates } });
  };

  const updatePhone = (index: number, value: string) => {
    const newPhones = [...data.contact.phone];
    newPhones[index] = value;
    updateContact({ phone: newPhones });
  };

  const addPhone = () => {
    updateContact({ phone: [...data.contact.phone, ""] });
  };

  const removePhone = (index: number) => {
    updateContact({ phone: data.contact.phone.filter((_, i) => i !== index) });
  };

  return (
    <AdminCard title="İletişim Bilgileri" subtitle="Müşterilerinizin size ulaşacağı kanallar.">
      <div className="space-y-6 md:space-y-8">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <AdminInputGroup label="WhatsApp Hattı" helperText="Sadece rakam (Örn: 90532...)">
            <Input 
              value={data.contact.whatsapp} 
              onChange={(e) => updateContact({ whatsapp: e.target.value })}
            />
          </AdminInputGroup>
          <AdminInputGroup label="E-Posta Adresi">
            <Input 
              value={data.contact.email} 
              onChange={(e) => updateContact({ email: e.target.value })}
            />
          </AdminInputGroup>
        </div>

        <AdminInputGroup label="Telefon Numaraları" helperText="Birden fazla numara ekleyebilirsiniz.">
          <div className="space-y-3">
            {data.contact.phone.map((phone, idx) => (
              <div key={idx} className="flex gap-2">
                <Input 
                  value={phone} 
                  onChange={(e) => updatePhone(idx, e.target.value)}
                  className="flex-grow"
                />
                <button 
                  onClick={() => removePhone(idx)}
                  className="p-4 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
            <button 
              onClick={addPhone}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 font-bold text-sm hover:border-primary-ocean/30 hover:text-primary-ocean transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Telefon Ekle
            </button>
          </div>
        </AdminInputGroup>

        <AdminInputGroup label="Açık Adres">
          <textarea 
            className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 transition-all font-bold text-slate-900 min-h-[80px] md:min-h-[100px]"
            value={data.contact.address}
            onChange={(e) => updateContact({ address: e.target.value })}
          />
        </AdminInputGroup>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <AdminInputGroup label="İlçe">
            <Input value={data.contact.district} onChange={(e) => updateContact({ district: e.target.value })} />
          </AdminInputGroup>
          <AdminInputGroup label="Şehir">
            <Input value={data.contact.city} onChange={(e) => updateContact({ city: e.target.value })} />
          </AdminInputGroup>
        </div>
      </div>
    </AdminCard>
  );
};

export const AboutSection = ({ data, onChange }: SectionProps) => {
  const updateAbout = (updates: Partial<SiteContent["about"]>) => {
    onChange({ about: { ...data.about, ...updates } });
  };

  return (
    <AdminCard title="Hakkımızda Bölümü" subtitle="İşletme hikayeniz ve öne çıkan özellikleriniz.">
      <div className="space-y-6 md:space-y-8">
        <AdminInputGroup label="Bölüm Başlığı">
          <Input value={data.about.title} onChange={(e) => updateAbout({ title: e.target.value })} />
        </AdminInputGroup>
        <AdminInputGroup label="Alt Başlık (Slogan)">
          <Input value={data.about.subtitle} onChange={(e) => updateAbout({ subtitle: e.target.value })} />
        </AdminInputGroup>
        <AdminInputGroup label="Ana İçerik Metni">
          <textarea 
            className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 transition-all font-bold text-slate-900 min-h-[150px] md:min-h-[200px]"
            value={data.about.content}
            onChange={(e) => updateAbout({ content: e.target.value })}
          />
        </AdminInputGroup>
        <AdminInputGroup label="Görsel URL">
          <Input value={data.about.image || ""} onChange={(e) => updateAbout({ image: e.target.value })} placeholder="/images/about.png" />
        </AdminInputGroup>
      </div>
    </AdminCard>
  );
};
