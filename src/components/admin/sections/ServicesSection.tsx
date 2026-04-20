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

export const ServicesSection = ({ data, onChange }: SectionProps) => {
  const updateServices = (updates: Partial<SiteContent["services"]>) => {
    onChange({ services: { ...data.services, ...updates } });
  };

  const updateItem = (
    index: number,
    updates: Partial<SiteContent["services"]["items"][number]>
  ) => {
    const newItems = [...data.services.items];
    newItems[index] = { ...newItems[index], ...updates };
    updateServices({ items: newItems });
  };

  const addItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      slug: "yeni-hizmet",
      title: "Yeni Hizmet",
      description: "Hizmet açıklaması",
      icon: "Brush",
      image: "/images/service-placeholder.png",
      features: ["Özellik 1"],
    };
    updateServices({ items: [...data.services.items, newItem] });
  };

  const removeItem = (index: number) => {
    updateServices({ items: data.services.items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      <AdminCard title="Hizmetler Bölümü Başlıkları">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <AdminInputGroup label="Bölüm Başlığı">
            <Input
              value={data.services.title}
              onChange={(e) => updateServices({ title: e.target.value })}
            />
          </AdminInputGroup>
          <AdminInputGroup label="Alt Başlık">
            <Input
              value={data.services.subtitle}
              onChange={(e) => updateServices({ subtitle: e.target.value })}
            />
          </AdminInputGroup>
        </div>
      </AdminCard>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-black text-slate-900 tracking-tight">Hizmet Listesi</h4>
          <span className="text-xs font-bold text-slate-400">
            {data.services.items.length} Hizmet Kayıtlı
          </span>
        </div>

        {data.services.items.map((item, idx) => (
          <AdminCard key={item.id} className="relative">
            <button
              onClick={() => removeItem(idx)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
              aria-label={`${item.title} hizmetini sil`}
            >
              <Trash2 size={16} />
            </button>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-4 md:space-y-6">
                <AdminInputGroup label="Hizmet Adı">
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem(idx, { title: e.target.value })}
                  />
                </AdminInputGroup>
                <AdminInputGroup label="URL Slugu" helperText="Sadece küçük harf, rakam ve tire.">
                  <Input
                    value={item.slug}
                    onChange={(e) => updateItem(idx, { slug: e.target.value })}
                  />
                </AdminInputGroup>
                <AdminInputGroup label="İkon İsmi" helperText="Lucide-react ikon ismi.">
                  <Input
                    value={item.icon}
                    onChange={(e) => updateItem(idx, { icon: e.target.value })}
                  />
                </AdminInputGroup>
                <AdminInputGroup label="Görsel URL">
                  <Input
                    value={item.image}
                    onChange={(e) => updateItem(idx, { image: e.target.value })}
                  />
                </AdminInputGroup>
              </div>
              <div className="space-y-4 md:space-y-6">
                <AdminInputGroup label="Kısa Açıklama">
                  <textarea
                    className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 transition-all font-bold text-slate-900 min-h-[80px] md:min-h-[100px]"
                    value={item.description}
                    onChange={(e) => updateItem(idx, { description: e.target.value })}
                  />
                </AdminInputGroup>
                <AdminInputGroup label="Öne Çıkan Özellikler" helperText="Virgül ile ayırın.">
                  <Input
                    value={item.features.join(", ")}
                    onChange={(e) =>
                      updateItem(idx, {
                        features: e.target.value.split(",").map((f) => f.trim()),
                      })
                    }
                  />
                </AdminInputGroup>
              </div>
            </div>
          </AdminCard>
        ))}

        <button
          onClick={addItem}
          className="w-full py-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-slate-400 font-bold hover:border-primary-ocean/30 hover:text-primary-ocean hover:bg-primary-ocean/5 transition-all flex items-center justify-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
            <Plus size={20} />
          </div>
          Yeni Hizmet Ekle
        </button>
      </div>
    </div>
  );
};
