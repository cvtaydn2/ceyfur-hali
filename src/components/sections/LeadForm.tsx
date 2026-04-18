"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { Send, Phone, User, MapPin, Calendar, MessageSquare, CheckCircle2 } from "lucide-react";
import { useSiteContent } from "@/hooks/use-site-content";
import { toast } from "react-hot-toast";

export const LeadForm = () => {
  const { content } = useSiteContent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    serviceId: "",
    district: "",
    preferredDate: "",
    notes: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsSuccess(true);
        toast.success(result.message);
        
        // WhatsApp Redirect Option (Optional)
        const waMsg = `Merhaba, Ceyfur Halı web sitesinden randevu talebi oluşturdum.\nAd: ${formData.fullName}\nHizmet: ${formData.serviceId}\nİlçe: ${formData.district}`;
        const waUrl = `https://wa.me/${content.contact.whatsapp.replace(/\s+/g, '')}?text=${encodeURIComponent(waMsg)}`;
        
        setTimeout(() => {
          window.open(waUrl, '_blank');
        }, 2000);
      } else {
        toast.error(result.message || "Bir hata oluştu.");
      }
    } catch (error) {
      console.error("LeadForm submission error:", error);
      toast.error("Lütfen bağlantınızı kontrol edin.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitting || !content) {
    return (
      <div className="max-w-4xl mx-auto p-20 text-center bg-slate-50 rounded-[3.5rem] border border-slate-100 animate-pulse">
        <div className="w-12 h-12 border-4 border-primary-ocean border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 font-bold italic">Form Hazırlanıyor...</p>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 rounded-[3.5rem] bg-white border border-emerald-100 text-center space-y-6 shadow-2xl shadow-emerald-500/5"
      >
        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-3xl font-black text-slate-900 italic">Talebiniz Alındı!</h3>
        <p className="text-slate-500 font-medium max-w-sm mx-auto italic">
          Ekibimiz en kısa sürede sizi arayacaktır. Şimdi WhatsApp'a yönlendiriliyorsunuz...
        </p>
        <Button onClick={() => window.location.reload()} variant="outline" className="rounded-full">Yeni Form Gönder</Button>
      </motion.div>
    );
  }

  return (
    <motion.section 
      id="contact"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="container mx-auto px-4 md:px-6 py-16 md:py-20"
    >
      <div className="max-w-4xl mx-auto rounded-[3rem] md:rounded-[4rem] bg-slate-900 p-1 md:p-2 shadow-2xl shadow-primary-ocean/20">
        <div className="bg-white rounded-[2.8rem] md:rounded-[3.5rem] p-6 sm:p-8 md:p-16 space-y-8 md:space-y-12">
          <div className="text-center space-y-4">
            <span className="text-[10px] font-black text-primary-ocean uppercase tracking-[0.3em] bg-primary-ocean/5 px-6 py-2 rounded-full">Hızlı Teklif Sistemi</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 italic tracking-tight">Hemen Randevu Alın</h2>
            <p className="text-sm md:text-base text-slate-400 font-medium max-w-md mx-auto italic">Formu doldurun, uzman ekibimiz sizi 15 dakika içinde arasın.</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Adınız Soyadınız</label>
                <div className="relative group">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-ocean transition-colors" size={20} />
                  <input 
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Örn: Ahmet Yılmaz"
                    className="w-full pl-14 pr-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-primary-ocean transition-all font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Telefon Numaranız</label>
                <div className="relative group">
                  <Phone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-ocean transition-colors" size={20} />
                  <input 
                    id="phone"
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="05XX XXX XX XX"
                    className="w-full pl-14 pr-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-primary-ocean transition-all font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="serviceId" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">İstediğiniz Hizmet</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-ocean transition-colors" size={20} />
                  <select 
                    id="serviceId"
                    required
                    value={formData.serviceId}
                    onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                    className="w-full pl-14 pr-12 py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-primary-ocean transition-all font-bold text-slate-700 appearance-none cursor-pointer"
                  >
                    <option value="">Hizmet Seçin...</option>
                    {content && content.services.items.map(s => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <label htmlFor="district" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">İlçe / Semt</label>
                <div className="relative group">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-ocean transition-colors" size={20} />
                  <input 
                    id="district"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({...formData, district: e.target.value})}
                    placeholder="Örn: Başakşehir"
                    className="w-full pl-14 pr-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-primary-ocean transition-all font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="preferredDate" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tercih Edilen Tarih</label>
                <div className="relative group">
                  <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-ocean transition-colors" size={20} />
                  <input 
                    id="preferredDate"
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                    className="w-full pl-14 pr-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-primary-ocean transition-all font-bold text-slate-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="notes" className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ek Notlar</label>
                <div className="relative group">
                  <MessageSquare className="absolute left-6 top-6 text-slate-300 group-focus-within:text-primary-ocean transition-colors" size={20} />
                  <textarea 
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    placeholder="M² bilgisi veya özel notunuz..."
                    rows={1}
                    className="w-full pl-14 pr-8 py-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:bg-white focus:border-primary-ocean transition-all font-bold text-slate-700 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="md:col-span-2 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-6 md:py-8 text-base md:text-lg rounded-[1.5rem] md:rounded-[2rem] bg-slate-900 text-white hover:bg-primary-ocean"
                leftIcon={<Send size={24} />}
              >
                {isSubmitting ? "Gönderiliyor..." : "Teklif Talebini İlet"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.section>
  );
};
