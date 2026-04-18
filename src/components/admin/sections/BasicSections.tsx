"use client";

import React from "react";
import { AdminCard, AdminInputGroup } from "../AdminUI";
import { Input, Button } from "@/components/ui";
import { SiteContent } from "@/types";

interface SectionProps {
  data: SiteContent;
  onChange: (updates: Partial<SiteContent>) => void;
}

export const SEOSection = ({ data, onChange }: SectionProps) => {
  const updateSEO = (updates: Partial<SiteContent["seo"]>) => {
    onChange({ seo: { ...data.seo, ...updates } });
  };

  return (
    <AdminCard title="SEO ve Meta Veriler" subtitle="Arama motoru görünürlüğü ve sosyal medya paylaşım ayarları.">
      <div className="space-y-8">
        <AdminInputGroup label="Site Başlığı" helperText="Tarayıcı sekmesinde ve Google sonuçlarında görünür.">
          <Input 
            value={data.seo.title} 
            onChange={(e) => updateSEO({ title: e.target.value })}
            placeholder="Örn: Ceyfur Halı Yıkama | Profesyonel Hizmet"
          />
        </AdminInputGroup>

        <AdminInputGroup label="Meta Açıklama" helperText="Site içeriğinin kısa bir özeti (max 160 karakter önerilir).">
          <textarea 
            className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 transition-all font-bold text-slate-900 min-h-[120px]"
            value={data.seo.description}
            onChange={(e) => updateSEO({ description: e.target.value })}
          />
        </AdminInputGroup>

        <AdminInputGroup label="Anahtar Kelimeler" helperText="Virgül ile ayırarak yazın.">
          <Input 
            value={data.seo.keywords.join(", ")} 
            onChange={(e) => updateSEO({ keywords: e.target.value.split(",").map(k => k.trim()) })}
          />
        </AdminInputGroup>
      </div>
    </AdminCard>
  );
};

export const GeneralSection = ({ data, onChange }: SectionProps) => {
  const updateBrand = (updates: Partial<SiteContent["brand"]>) => {
    onChange({ brand: { ...data.brand, ...updates } });
  };

  return (
    <AdminCard title="Genel İşletme Ayarları" subtitle="Brand kimliği ve slogan yönetimi.">
      <div className="space-y-8">
        <AdminInputGroup label="Marka İsmi">
          <Input 
            value={data.brand.name} 
            onChange={(e) => updateBrand({ name: e.target.value })}
          />
        </AdminInputGroup>

        <AdminInputGroup label="Slogan" helperText="Hero bölümünde ve logoda kullanılan ana slogan.">
          <Input 
            value={data.brand.slogan} 
            onChange={(e) => updateBrand({ slogan: e.target.value })}
          />
        </AdminInputGroup>
        
        <div className="grid md:grid-cols-2 gap-8 pt-4">
           <AdminInputGroup label="Logo URL (Opsiyonel)">
            <Input 
              value={data.brand.logo || ""} 
              onChange={(e) => updateBrand({ logo: e.target.value })}
              placeholder="/images/logo.png"
            />
          </AdminInputGroup>
        </div>
      </div>
    </AdminCard>
  );
};
