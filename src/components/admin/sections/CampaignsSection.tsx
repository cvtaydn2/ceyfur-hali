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

export const CampaignsSection = ({ data, onChange }: SectionProps) => {
  const updateCampaigns = (updates: Partial<SiteContent["campaigns"]>) => {
    onChange({ campaigns: { ...data.campaigns, ...updates } });
  };

  const updateItem = (
    index: number,
    updates: Partial<SiteContent["campaigns"]["items"][number]>
  ) => {
    const newItems = [...data.campaigns.items];
    newItems[index] = { ...newItems[index], ...updates };
    updateCampaigns({ items: newItems });
  };

  const addItem = () => {
    const newItem = {
      id: crypto.randomUUID(),
      title: "Yeni Kampanya",
      description: "Kampanya açıklaması",
      badge: "Yeni",
      priceNote: "İndirim Oranı",
      features: ["Özellik 1"],
      ctaLabel: "Teklif Al",
    };
    updateCampaigns({ items: [...data.campaigns.items, newItem] });
  };

  const removeItem = (index: number) => {
    updateCampaigns({ items: data.campaigns.items.filter((_, i) => i !== index) });
  };

  const updateFeature = (itemIndex: number, featureIndex: number, value: string) => {
    const newItems = [...data.campaigns.items];
    const newFeatures = [...newItems[itemIndex].features];
    newFeatures[featureIndex] = value;
    newItems[itemIndex] = { ...newItems[itemIndex], features: newFeatures };
    updateCampaigns({ items: newItems });
  };

  const addFeature = (itemIndex: number) => {
    const newItems = [...data.campaigns.items];
    newItems[itemIndex] = {
      ...newItems[itemIndex],
      features: [...newItems[itemIndex].features, "Yeni Madde"],
    };
    updateCampaigns({ items: newItems });
  };

  const removeFeature = (itemIndex: number, featureIndex: number) => {
    const newItems = [...data.campaigns.items];
    newItems[itemIndex] = {
      ...newItems[itemIndex],
      features: newItems[itemIndex].features.filter((_, i) => i !== featureIndex),
    };
    updateCampaigns({ items: newItems });
  };

  return (
    <div className="space-y-8">
      <AdminCard title="Kampanyalar Bölümü Başlıkları">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          <AdminInputGroup label="Bölüm Başlığı">
            <Input
              value={data.campaigns.title}
              onChange={(e) => updateCampaigns({ title: e.target.value })}
            />
          </AdminInputGroup>
          <AdminInputGroup label="Alt Başlık">
            <Input
              value={data.campaigns.subtitle}
              onChange={(e) => updateCampaigns({ subtitle: e.target.value })}
            />
          </AdminInputGroup>
        </div>
      </AdminCard>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="text-lg font-black text-slate-900 tracking-tight">Kampanya Listesi</h4>
          <span className="text-xs font-bold text-slate-400">
            {data.campaigns.items.length} Kampanya Kayıtlı
          </span>
        </div>

        {data.campaigns.items.map((item, idx) => (
          <AdminCard key={item.id} className="relative">
            <button
              onClick={() => removeItem(idx)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
              aria-label={`${item.title} kampanyasını sil`}
            >
              <Trash2 size={16} />
            </button>

            <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8">
              <AdminInputGroup label="Etiket (Badge)">
                <Input
                  value={item.badge}
                  onChange={(e) => updateItem(idx, { badge: e.target.value })}
                />
              </AdminInputGroup>
              <div className="md:col-span-2">
                <AdminInputGroup label="Kampanya Başlığı">
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem(idx, { title: e.target.value })}
                  />
                </AdminInputGroup>
              </div>
            </div>

            <AdminInputGroup label="Kampanya Detayı" className="mb-6 md:mb-8">
              <textarea
                className="w-full px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 transition-all font-bold text-slate-900 min-h-[80px] md:min-h-[100px]"
                value={item.description}
                onChange={(e) => updateItem(idx, { description: e.target.value })}
              />
            </AdminInputGroup>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8">
              <AdminInputGroup
                label="Fiyat / İndirim Notu"
                helperText="Örn: %20'ye Varan İndirim"
              >
                <Input
                  value={item.priceNote ?? ""}
                  onChange={(e) => updateItem(idx, { priceNote: e.target.value })}
                />
              </AdminInputGroup>
              <AdminInputGroup label="Buton Yazısı">
                <Input
                  value={item.ctaLabel}
                  onChange={(e) => updateItem(idx, { ctaLabel: e.target.value })}
                />
              </AdminInputGroup>
            </div>

            <AdminInputGroup label="Kampanya Maddeleri">
              <div className="space-y-3">
                {item.features.map((feature, fIdx) => (
                  <div key={fIdx} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(idx, fIdx, e.target.value)}
                      className="flex-grow"
                    />
                    <button
                      onClick={() => removeFeature(idx, fIdx)}
                      className="p-4 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                      aria-label="Maddeyi sil"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => addFeature(idx)}
                  className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 font-bold text-sm hover:border-primary-ocean/30 hover:text-primary-ocean transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Madde Ekle
                </button>
              </div>
            </AdminInputGroup>
          </AdminCard>
        ))}

        <button
          onClick={addItem}
          className="w-full py-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-slate-400 font-bold hover:border-primary-ocean/30 hover:text-primary-ocean hover:bg-primary-ocean/5 transition-all flex items-center justify-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
            <Plus size={20} />
          </div>
          Yeni Kampanya Ekle
        </button>
      </div>
    </div>
  );
};
