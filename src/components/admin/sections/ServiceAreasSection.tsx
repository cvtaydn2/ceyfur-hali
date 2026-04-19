"use client";

import React from "react";
import { AdminCard, AdminInputGroup } from "../AdminUI";
import { Input } from "@/components/ui";
import { SiteContent } from "@/types";
import { Plus, Trash2, MapPin } from "lucide-react";

interface SectionProps {
  data: SiteContent;
  onChange: (updates: Partial<SiteContent>) => void;
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const ServiceAreasSection = ({ data, onChange }: SectionProps) => {
  const areas = data.services.areas ?? [];

  const updateAreas = (newAreas: SiteContent["services"]["areas"]) => {
    onChange({ services: { ...data.services, areas: newAreas } });
  };

  const updateArea = (
    index: number,
    updates: Partial<SiteContent["services"]["areas"][number]>
  ) => {
    const updated = [...areas];
    updated[index] = { ...updated[index], ...updates };
    updateAreas(updated);
  };

  const addArea = () => {
    updateAreas([
      ...areas,
      { name: "Yeni Bölge", slug: `bolge-${Date.now()}` },
    ]);
  };

  const removeArea = (index: number) => {
    updateAreas(areas.filter((_, i) => i !== index));
  };

  return (
    <AdminCard
      title="Hizmet Bölgeleri"
      subtitle="Hizmet verdiğiniz ilçe ve semtler. Sitede hizmet bölgeleri kartı olarak gösterilir."
    >
      <div className="space-y-3">
        {areas.map((area, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-primary-ocean/20 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-ocean/10 flex items-center justify-center text-primary-ocean shrink-0">
              <MapPin size={16} />
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AdminInputGroup label="İlçe / Semt Adı">
                <Input
                  value={area.name}
                  onChange={(e) => {
                    updateArea(idx, {
                      name: e.target.value,
                      slug: toSlug(e.target.value),
                    });
                  }}
                  placeholder="Örn: Ümraniye"
                />
              </AdminInputGroup>
              <AdminInputGroup
                label="Slug (URL)"
                helperText="Otomatik oluşturulur, değiştirebilirsiniz."
              >
                <Input
                  value={area.slug}
                  onChange={(e) => updateArea(idx, { slug: e.target.value })}
                  placeholder="umraniye"
                />
              </AdminInputGroup>
            </div>

            <button
              onClick={() => removeArea(idx)}
              className="p-3 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors shrink-0"
              aria-label={`${area.name} bölgesini sil`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}

        {areas.length === 0 && (
          <p className="text-center py-8 text-slate-300 font-bold italic text-sm">
            Henüz hizmet bölgesi eklenmemiş.
          </p>
        )}
      </div>

      <button
        onClick={addArea}
        className="mt-6 w-full py-6 rounded-[2rem] border-2 border-dashed border-slate-100 text-slate-400 font-bold hover:border-primary-ocean/30 hover:text-primary-ocean hover:bg-primary-ocean/5 transition-all flex items-center justify-center gap-3 group"
      >
        <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors">
          <Plus size={18} />
        </div>
        Yeni Bölge Ekle
      </button>
    </AdminCard>
  );
};
