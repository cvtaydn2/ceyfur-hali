"use client";

import React from "react";
import { AdminCard, AdminInputGroup } from "../AdminUI";
import { Input } from "@/components/ui";
import { SiteContent } from "@/types";

import { getZodError } from "@/lib/admin-utils";

interface SectionProps {
  data: SiteContent;
  onChange: (updates: Partial<SiteContent>) => void;
  errors?: any;
}

export const HeroSection = ({ data, onChange, errors }: SectionProps) => {
  const updateHero = (updates: Partial<SiteContent["hero"]>) => {
    onChange({ hero: { ...data.hero, ...updates } });
  };

  return (
    <AdminCard title="Hero Bölümü" subtitle="Ana sayfa açılış ekranı içeriği.">
      <div className="space-y-6 md:space-y-8">
        <AdminInputGroup 
          label="Ana Başlık"
          error={getZodError(errors, "title")}
        >
          <Input 
            value={data.hero.title} 
            onChange={(e) => updateHero({ title: e.target.value })}
            placeholder="Örn: Halılarınız İlk Günkü Gibi Parlasın"
          />
        </AdminInputGroup>

        <AdminInputGroup 
          label="Vurgulu Kelime" 
          helperText="Başlık içerisinde farklı renkte görünen kısımdır."
          error={getZodError(errors, "highlight")}
        >
          <Input 
            value={data.hero.highlight} 
            onChange={(e) => updateHero({ highlight: e.target.value })}
            placeholder="Örn: Tertemiz"
          />
        </AdminInputGroup>

        <AdminInputGroup 
          label="Açıklama Metni"
          error={getZodError(errors, "description")}
        >
          <textarea 
            className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 transition-all font-bold text-slate-900 min-h-[100px]"
            value={data.hero.description}
            onChange={(e) => updateHero({ description: e.target.value })}
          />
        </AdminInputGroup>

        <div className="grid md:grid-cols-2 gap-6">
          <AdminInputGroup 
            label="Birincil Buton Metni"
            error={getZodError(errors, "primaryCta")}
          >
            <Input 
              value={data.hero.primaryCta} 
              onChange={(e) => updateHero({ primaryCta: e.target.value })}
            />
          </AdminInputGroup>
          <AdminInputGroup 
            label="İkincil Buton Metni"
            error={getZodError(errors, "secondaryCta")}
          >
            <Input 
              value={data.hero.secondaryCta} 
              onChange={(e) => updateHero({ secondaryCta: e.target.value })}
            />
          </AdminInputGroup>
        </div>

        <AdminInputGroup 
          label="Arka Plan Görseli" 
          helperText="Ana sayfa en üstündeki görselin URL'si."
          error={getZodError(errors, "image")}
        >
          <Input 
            value={data.hero.image} 
            onChange={(e) => updateHero({ image: e.target.value })}
            placeholder="/images/hero-bg.jpg"
          />
        </AdminInputGroup>
      </div>
    </AdminCard>
  );
};
