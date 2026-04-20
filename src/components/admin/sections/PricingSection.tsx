"use client";

import React from "react";
import { AdminCard, AdminInputGroup } from "../AdminUI";
import { Input } from "@/components/ui";
import { SiteContent } from "@/types";
import { Plus, Trash2 } from "lucide-react";

import { getZodError, createEmptyPricingItem } from "@/lib/admin-utils";

interface SectionProps {
  data: SiteContent;
  onChange: (updates: Partial<SiteContent>) => void;
  errors?: any;
}

export const PricingSection = ({ data, onChange, errors }: SectionProps) => {
  const updatePricing = (updates: Partial<SiteContent["pricing"]>) => {
    onChange({ pricing: { ...data.pricing, ...updates } });
  };

  const updateItem = (
    index: number,
    updates: Partial<SiteContent["pricing"]["items"][number]>
  ) => {
    const newItems = [...data.pricing.items];
    newItems[index] = { ...newItems[index], ...updates };
    updatePricing({ items: newItems });
  };

  const addItem = () => {
    updatePricing({ items: [...data.pricing.items, createEmptyPricingItem()] });
  };

  const removeItem = (index: number) => {
    updatePricing({ items: data.pricing.items.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      {/* Bölüm Başlıkları */}
      <AdminCard title="Fiyatlar Bölümü Başlıkları">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <AdminInputGroup 
              label="Bölüm Başlığı"
              error={getZodError(errors, "title")}
            >
              <Input
                value={data.pricing.title}
                onChange={(e) => updatePricing({ title: e.target.value })}
              />
            </AdminInputGroup>
            <AdminInputGroup 
              label="Alt Başlık"
              error={getZodError(errors, "subtitle")}
            >
              <Input
                value={data.pricing.subtitle}
                onChange={(e) => updatePricing({ subtitle: e.target.value })}
              />
            </AdminInputGroup>
          </div>
          <AdminInputGroup
            label="Dipnot"
            helperText="Tablonun altında küçük yazıyla gösterilir."
            error={getZodError(errors, "note")}
          >
            <Input
              value={data.pricing.note ?? ""}
              onChange={(e) => updatePricing({ note: e.target.value })}
              placeholder="Örn: Fiyatlar m² başına geçerlidir. KDV dahildir."
            />
          </AdminInputGroup>
        </div>
      </AdminCard>

      {/* Fiyat Listesi */}
      <AdminCard
        title="Fiyat Listesi"
        subtitle={`${data.pricing.items.length} ürün kayıtlı`}
      >
        {/* Tablo başlığı */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-3 border-b border-slate-100 mb-2">
          <span className="col-span-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Halı / Ürün Tipi
          </span>
          <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
            Fiyat (₺)
          </span>
          <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
            Birim
          </span>
          <span className="col-span-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Not
          </span>
          <span className="col-span-1" />
        </div>

        <div className="space-y-3">
          {data.pricing.items.map((item, idx) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-primary-ocean/20 transition-colors"
            >
              {/* Tip */}
              <div className="md:col-span-5">
                <AdminInputGroup 
                  label="Halı / Ürün Tipi" 
                  error={getZodError(errors, "items", idx, "type")}
                >
                  <Input
                    value={item.type}
                    onChange={(e) => updateItem(idx, { type: e.target.value })}
                    placeholder="Örn: BAMBU"
                  />
                </AdminInputGroup>
              </div>

              {/* Fiyat */}
              <div className="md:col-span-2">
                <AdminInputGroup 
                  label="Fiyat (₺)" 
                  error={getZodError(errors, "items", idx, "price")}
                >
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.price}
                    onChange={(e) =>
                      updateItem(idx, { price: parseFloat(e.target.value) || 0 })
                    }
                    className="text-center"
                  />
                </AdminInputGroup>
              </div>

              {/* Birim */}
              <div className="md:col-span-2">
                <AdminInputGroup 
                  label="Birim" 
                  error={getZodError(errors, "items", idx, "unit")}
                >
                  <Input
                    value={item.unit ?? ""}
                    onChange={(e) => updateItem(idx, { unit: e.target.value })}
                    placeholder="m², adet..."
                    className="text-center"
                  />
                </AdminInputGroup>
              </div>

              {/* Not */}
              <div className="md:col-span-2">
                <AdminInputGroup 
                  label="Not" 
                  error={getZodError(errors, "items", idx, "note")}
                >
                  <Input
                    value={item.note ?? ""}
                    onChange={(e) => updateItem(idx, { note: e.target.value })}
                    placeholder="Opsiyonel not"
                  />
                </AdminInputGroup>
              </div>

              {/* Sil */}
              <div className="md:col-span-1 flex justify-end">
                <button
                  onClick={() => removeItem(idx)}
                  className="p-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                  aria-label={`${item.type} fiyatını sil`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addItem}
          className="mt-6 w-full py-6 rounded-[2rem] border-2 border-dashed border-slate-100 text-slate-400 font-bold hover:border-primary-ocean/30 hover:text-primary-ocean hover:bg-primary-ocean/5 transition-all flex items-center justify-center gap-3 group"
        >
          <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
            <Plus size={18} />
          </div>
          Yeni Fiyat Ekle
        </button>
      </AdminCard>
    </div>
  );
};
