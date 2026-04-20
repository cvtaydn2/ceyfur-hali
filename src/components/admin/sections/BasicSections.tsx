"use client";

import React from "react";
import { AdminCard, AdminInputGroup } from "../AdminUI";
import { Input, Button } from "@/components/ui";
import { SiteContent } from "@/types";

import { getZodError } from "@/lib/admin-utils";

interface SectionProps {
  data: SiteContent;
  onChange: (updates: Partial<SiteContent>) => void;
  errors?: any;
}

export const SEOSection = ({ data, onChange, errors }: SectionProps) => {
  const updateSEO = (updates: Partial<SiteContent["seo"]>) => {
    onChange({ seo: { ...data.seo, ...updates } });
  };

  return (
    <AdminCard title="SEO ve Meta Veriler" subtitle="Arama motoru görünürlüğü ve sosyal medya paylaşım ayarları.">
      <div className="space-y-6 md:space-y-8">
        <AdminInputGroup 
          label="Site Başlığı" 
          helperText="Tarayıcı sekmesinde ve Google sonuçlarında görünür."
          error={getZodError(errors, "title")}
        >
          <Input 
            value={data.seo.title} 
            onChange={(e) => updateSEO({ title: e.target.value })}
            placeholder="Örn: Ceyfur Halı Yıkama | Profesyonel Hizmet"
          />
        </AdminInputGroup>

        <AdminInputGroup 
          label="Meta Açıklama" 
          helperText="Site içeriğinin kısa bir özeti (max 160 karakter önerilir)."
          error={getZodError(errors, "description")}
        >
          <textarea 
            className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 transition-all font-bold text-slate-900 min-h-[100px] md:min-h-[120px]"
            value={data.seo.description}
            onChange={(e) => updateSEO({ description: e.target.value })}
          />
        </AdminInputGroup>

        <AdminInputGroup 
          label="Anahtar Kelimeler" 
          helperText="Virgül ile ayırarak yazın."
          error={getZodError(errors, "keywords")}
        >
          <Input 
            value={data.seo.keywords.join(", ")} 
            onChange={(e) => updateSEO({ keywords: e.target.value.split(",").map(k => k.trim()) })}
          />
        </AdminInputGroup>
      </div>
    </AdminCard>
  );
};

export const GeneralSection = ({ data, onChange, errors }: SectionProps) => {
  const updateBrand = (updates: Partial<SiteContent["brand"]>) => {
    onChange({ brand: { ...data.brand, ...updates } });
  };

  return (
    <AdminCard title="Genel İşletme Ayarları" subtitle="Brand kimliği ve slogan yönetimi.">
      <div className="space-y-6 md:space-y-8">
        <AdminInputGroup 
          label="Marka İsmi"
          error={getZodError(errors, "name")}
        >
          <Input 
            value={data.brand.name} 
            onChange={(e) => updateBrand({ name: e.target.value })}
          />
        </AdminInputGroup>

        <AdminInputGroup 
          label="Slogan" 
          helperText="Hero bölümünde ve logoda kullanılan ana slogan."
          error={getZodError(errors, "slogan")}
        >
          <Input 
            value={data.brand.slogan} 
            onChange={(e) => updateBrand({ slogan: e.target.value })}
          />
        </AdminInputGroup>
        
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 pt-4">
           <AdminInputGroup 
             label="Logo URL (Opsiyonel)"
             error={getZodError(errors, "logo")}
           >
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
