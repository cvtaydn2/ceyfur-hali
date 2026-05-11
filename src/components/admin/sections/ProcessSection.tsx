"use client";

import React from "react";
import { AdminCard, AdminInputGroup } from "../AdminUI";
import { Input } from "@/components/ui";
import { SiteContent, WashingStep } from "@/types";

import { getZodError } from "@/lib/admin-utils";
import { Play, Trash2, Plus } from "lucide-react";

interface SectionProps {
  data: SiteContent;
  onChange: (updates: Partial<SiteContent>) => void;
  errors?: any;
}

export const ProcessSection = ({ data, onChange, errors }: SectionProps) => {
  const process = data.process || { title: "", subtitle: "", steps: [] };

  const updateProcess = (updates: Partial<typeof process>) => {
    onChange({ process: { ...process, ...updates } });
  };

  const updateStep = (index: number, updates: Partial<WashingStep>) => {
    const newSteps = [...process.steps];
    newSteps[index] = { ...newSteps[index], ...updates };
    updateProcess({ steps: newSteps });
  };

  const addStep = () => {
    updateProcess({
      steps: [
        ...process.steps,
        { title: "", description: "", videoUrl: "" },
      ],
    });
  };

  const removeStep = (index: number) => {
    updateProcess({
      steps: process.steps.filter((_, i) => i !== index),
    });
  };

  return (
    <AdminCard title="Yıkama Süreci" subtitle="Her aşama için başlık, açıklama ve video ekleyebilirsiniz.">
      <div className="space-y-6 md:space-y-8">
        <AdminInputGroup label="Bölüm Başlığı">
          <Input
            value={process.title}
            onChange={(e) => updateProcess({ title: e.target.value })}
            placeholder="Örn: Yıkama Sürecimiz"
          />
        </AdminInputGroup>

        <AdminInputGroup label="Alt Başlık">
          <Input
            value={process.subtitle}
            onChange={(e) => updateProcess({ subtitle: e.target.value })}
            placeholder="Örn: Her aşamada profesyonel hijyen"
          />
        </AdminInputGroup>

        <div className="border-t border-slate-100 pt-6">
          <h4 className="font-bold text-slate-900 mb-4">Aşamalar</h4>
          
          <div className="space-y-4">
            {process.steps.map((step, index) => (
              <div
                key={index}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                    Aşama {index + 1}
                  </span>
                  <button
                    onClick={() => removeStep(index)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <AdminInputGroup label="Başlık">
                  <Input
                    value={step.title}
                    onChange={(e) => updateStep(index, { title: e.target.value })}
                    placeholder={`Örn: ${["Toz Alma", "Yıkama", "Durulama", "Kurutma", "Kalite Kontrol"][index] || "Aşama"}`}
                  />
                </AdminInputGroup>

                <AdminInputGroup label="Açıklama">
                  <textarea
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-100 outline-none focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 transition-all font-bold text-slate-900 text-sm min-h-[80px]"
                    value={step.description}
                    onChange={(e) => updateStep(index, { description: e.target.value })}
                    placeholder="Aşama açıklaması..."
                  />
                </AdminInputGroup>

                <AdminInputGroup 
                  label="Video URL (Google Drive)"
                  helperText="drive.google.com formatında video linki"
                >
                  <Input
                    value={step.videoUrl || ""}
                    onChange={(e) => updateStep(index, { videoUrl: e.target.value })}
                    placeholder="https://drive.google.com/file/d/..."
                  />
                </AdminInputGroup>

                {step.videoUrl && (
                  <div className="mt-2 p-3 rounded-xl bg-white border border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2">
                      <Play size={12} className="text-primary-ocean" />
                      Video Önizleme
                    </div>
                    <iframe
                      src={step.videoUrl.replace("/view", "/preview").replace("file/d/", "file/d/")}
                      className="w-full aspect-video rounded-lg"
                      allow="autoplay"
                      title={`Video ${index + 1}`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addStep}
            className="w-full mt-4 py-4 rounded-2xl border-2 border-dashed border-slate-100 text-slate-400 font-bold text-sm hover:border-primary-ocean/30 hover:text-primary-ocean transition-all flex items-center justify-center gap-2"
            type="button"
          >
            <Plus size={16} /> Yeni Aşama Ekle
          </button>
        </div>
      </div>
    </AdminCard>
  );
};