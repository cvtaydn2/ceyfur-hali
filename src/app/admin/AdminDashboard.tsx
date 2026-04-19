"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Save, Settings, Search, Phone, User, Tag, LayoutGrid, Code, 
  AlertTriangle, Inbox, Archive, LayoutDashboard, LogOut, ExternalLink,
  ChevronRight, MapPin, Calendar, Briefcase, Users, DollarSign
} from "lucide-react";
import { SiteContent } from "@/types";
import { Lead, LeadArchive } from "@/lib/leads-schema";
import { AdminNav, AdminCard } from "@/components/admin/AdminUI";
import { GeneralSection, SEOSection } from "@/components/admin/sections/BasicSections";
import { ContactSection, AboutSection } from "@/components/admin/sections/ContentSections";
import { ServicesSection } from "@/components/admin/sections/ServicesSection";
import { ServiceAreasSection } from "@/components/admin/sections/ServiceAreasSection";
import { PricingSection } from "@/components/admin/sections/PricingSection";
import { CampaignsSection } from "@/components/admin/sections/CampaignsSection";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminDashboardProps {
  initialContent: SiteContent;
  onSaveContent: (data: SiteContent) => Promise<{ success: boolean; message?: string }>;
}

type SaveResult = { success: boolean; message?: string };

const TABS = [
  { id: "dashboard",    label: "Dashboard",       icon: LayoutDashboard },
  { id: "leads",        label: "Talepler",         icon: Inbox },
  { id: "archive",      label: "Arşiv",            icon: Archive },
  { id: "general",      label: "Genel",            icon: Settings },
  { id: "seo",          label: "SEO",              icon: Search },
  { id: "contact",      label: "İletişim",         icon: Phone },
  { id: "about",        label: "Hakkımızda",       icon: User },
  { id: "services",     label: "Hizmetler",        icon: LayoutGrid },
  { id: "areas",        label: "Hizmet Bölgeleri", icon: MapPin },
  { id: "pricing",      label: "Fiyatlar",         icon: DollarSign },
  { id: "campaigns",    label: "Kampanyalar",      icon: Tag },
  { id: "advanced",     label: "Gelişmiş",         icon: Code },
];

export const AdminDashboard = ({ initialContent, onSaveContent }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [content, setContent] = useState<SiteContent>(initialContent);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Leads data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [archive, setArchive] = useState<LeadArchive[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");
  
  const router = useRouter();

  // Load Leads/Archive
  const loadLeadsData = useCallback(async () => {
    setIsLoadingLeads(true);
    try {
      const [leadsRes, archiveRes] = await Promise.all([
        fetch("/api/admin/leads").then(r => r.json()),
        fetch("/api/admin/leads?type=archive").then(r => r.json())
      ]);
      if (leadsRes.success) setLeads(leadsRes.data);
      if (archiveRes.success) setArchive(archiveRes.data);
    } catch (err) {
      toast.error("Veriler yüklenirken hata oluştu.");
    } finally {
      setIsLoadingLeads(false);
    }
  }, []);

  useEffect(() => {
    loadLeadsData();
  }, [loadLeadsData]);

  // Content change handler
  const handleContentChange = (updates: Partial<SiteContent>) => {
    setContent(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  // Save Content
  const handleSave = async () => {
    setIsSaving(true);
    const result = await onSaveContent(content);
    if (result.success) {
      setIsDirty(false);
      toast.success("Değişiklikler kaydedildi.");
    } else {
      toast.error(result.message || "Hata oluştu.");
    }
    setIsSaving(false);
  };

  // Lead Actions
  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Durum güncellendi.");
        loadLeadsData();
      }
    } catch (err) {
      toast.error("Güncelleme başarısız.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* Navbar Container */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-slate-200">C</div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-black text-slate-900 leading-none tracking-tight">Ceyfur Admin</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Management Suite v3.0</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AnimatePresence>
              {isDirty && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="hidden lg:flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black uppercase tracking-widest"
                >
                  <AlertTriangle size={14} /> Kaydedilmemiş Değişiklikler
                </motion.div>
              )}
            </AnimatePresence>

            <Button onClick={handleSave} isLoading={isSaving} disabled={!isDirty || isSaving} variant={isDirty ? "primary" : "outline"} className="rounded-xl sm:rounded-2xl h-10 sm:h-12 px-4 sm:px-8 shadow-xl shadow-slate-200">
              <Save size={18} className="mr-1 sm:mr-2" /> 
              <span className="hidden sm:inline">Değişiklikleri Kaydet</span>
              <span className="sm:hidden text-xs">Kaydet</span>
            </Button>
            
            <button onClick={handleLogout} className="p-2 sm:p-3 bg-slate-50 rounded-xl sm:rounded-2xl text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all border border-slate-100">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1600px] mx-auto p-4 sm:p-6 md:p-10 flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Navigation Sidebar */}
        <aside className="w-full lg:w-80 shrink-0">
          <div className="lg:sticky lg:top-28 space-y-6 lg:space-y-8">
            <AdminNav activeTab={activeTab} onTabChange={setActiveTab} tabs={TABS} />
            
            <div className="hidden lg:block p-8 rounded-[2.5rem] bg-slate-900 text-white shadow-2xl shadow-slate-200 overflow-hidden relative group">
              <div className="relative z-10">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic opacity-80">Sistem Bilgisi</h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 block">Bekleyen İşler</span>
                    <span className="text-3xl font-black">{leads.length}</span>
                  </div>
                  <button onClick={() => setActiveTab("leads")} className="w-full py-3 bg-white/10 rounded-xl font-bold text-xs hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                    Taleplere Git <ExternalLink size={14} />
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-ocean/40 blur-[60px] -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-1000" />
            </div>
          </div>
        </aside>

        {/* Dynamic Workspace Area */}
        <main className="flex-grow min-w-0 pb-32">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
              
              {/* DASHBOARD TAB */}
              {activeTab === "dashboard" && (
                <div className="space-y-8 lg:space-y-10">
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                    {[
                      { label: "Toplam Talepler", value: leads.length, icon: Inbox, color: "text-primary-ocean" },
                      { label: "Tamamlanan İşler", value: archive.length, icon: Archive, color: "text-emerald-500" },
                      { label: "Aktif Hizmetler", value: content.services.items.length, icon: Briefcase, color: "text-amber-500" },
                      { label: "Mutlu Müşteriler", value: content.stats[0]?.value || 0, icon: Users, color: "text-purple-500" },
                    ].map((stat, i) => (
                      <AdminCard key={i} className="hover:scale-[1.02] transition-transform cursor-pointer">
                        <div className={cn("inline-flex p-4 rounded-2xl bg-slate-50 mb-6", stat.color)}>
                          <stat.icon size={28} />
                        </div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</h4>
                        <p className="text-4xl font-black mt-2 tracking-tight">{stat.value}</p>
                      </AdminCard>
                    ))}
                  </div>

                  <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
                    <AdminCard title="Son Talepler" subtitle="İlgi bekleyen en yeni müşteri kayıtları.">
                      <div className="space-y-4">
                        {leads.slice(0, 5).map((lead) => (
                          <div key={lead.id} className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-primary-ocean/20 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 font-black">
                                {lead.fullName[0].toUpperCase()}
                              </div>
                              <div>
                                <h5 className="font-black text-sm">{lead.fullName}</h5>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mt-1">
                                  <MapPin size={10} /> {lead.district} | {lead.serviceId}
                                </div>
                              </div>
                            </div>
                            <button onClick={() => setActiveTab("leads")} className="p-2 opacity-0 group-hover:opacity-100 text-primary-ocean transition-all">
                              <ChevronRight size={18} />
                            </button>
                          </div>
                        ))}
                        {leads.length === 0 && <p className="text-center py-10 text-slate-300 font-bold italic">Yeni talep bulunmuyor.</p>}
                      </div>
                    </AdminCard>

                    <div className="p-10 rounded-[2.5rem] bg-emerald-500 text-white shadow-2xl shadow-emerald-200/50 flex flex-col justify-between relative overflow-hidden group">
                      <div className="relative z-10">
                        <h3 className="text-3xl font-black italic mb-4 leading-tight">Müşteri Memnuniyeti Her Şeyden Öte</h3>
                        <p className="font-medium text-emerald-50 max-w-sm italic opacity-90">Halılar tertemiz, yuvalar huzurlu. Sisteminizi her zaman güncel tutun.</p>
                      </div>
                      <div className="relative z-10 mt-12 bg-white/20 p-6 rounded-3xl backdrop-blur-md border border-white/20">
                         <div className="flex justify-between items-center">
                            <span className="text-xs font-black uppercase tracking-widest">Başarı Oranı</span>
                            <span className="font-black text-xl italic">%98.4</span>
                         </div>
                      </div>
                      <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] -mr-32 -mt-32 group-hover:bg-white/30 transition-all duration-1000" />
                    </div>
                  </div>
                </div>
              )}

              {/* LEADS TAB */}
              {activeTab === "leads" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-black tracking-tight italic">Aktif Müşteri Talepleri</h2>
                    <div className="relative w-72">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input 
                        className="w-full pl-12 pr-6 py-3 rounded-2xl bg-white border border-slate-100 text-xs font-bold outline-none focus:border-primary-ocean transition-all"
                        placeholder="İsim veya ilçe ile ara..."
                        value={leadSearch}
                        onChange={(e) => setLeadSearch(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {leads
                      .filter(l => l.fullName.toLowerCase().includes(leadSearch.toLowerCase()) || l.district.toLowerCase().includes(leadSearch.toLowerCase()))
                      .map((lead) => (
                      <AdminCard key={lead.id} className="!p-0 overflow-hidden relative group">
                        <div className={cn("absolute left-0 top-0 w-2 h-full", 
                          lead.status === 'new' ? "bg-emerald-500" : "bg-primary-ocean"
                        )} />
                        <div className="p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                          <div className="space-y-4 flex-1">
                            <div className="flex items-center gap-4">
                              <h3 className="text-xl font-black italic">{lead.fullName}</h3>
                              <span className="px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {lead.status === 'new' ? 'YENİ TALEP' : 'İŞLEMDE'}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                               <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Phone size={14} className="text-slate-300" /> {lead.phone}</div>
                               <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><MapPin size={14} className="text-slate-300" /> {lead.district}</div>
                               <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Briefcase size={14} className="text-slate-300" /> {lead.serviceId}</div>
                               <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><Calendar size={14} className="text-slate-300" /> {lead.preferredDate}</div>
                            </div>
                            {lead.notes && <div className="mt-4 p-4 rounded-2xl bg-slate-50/50 italic text-slate-400 text-[11px] font-medium">&ldquo;{lead.notes}&rdquo;</div>}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full lg:w-auto">
                            <select 
                              onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                              value={lead.status}
                              className="w-full sm:w-auto px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 text-[10px] sm:text-xs font-black uppercase tracking-widest outline-none hover:bg-white hover:border-primary-ocean transition-all cursor-pointer appearance-none min-w-[200px] text-center"
                            >
                              <option value="new">Durum: Yeni</option>
                              <option value="called">Durum: Arandı</option>
                              <option value="quoted">Durum: Teklif Verildi</option>
                              <option value="booked">Durum: Randevu Alındı</option>
                              <option disabled>──────────</option>
                              <option value="completed" className="text-emerald-500 font-black italic">✓ TAMAMLA VE ARŞİVLE</option>
                              <option value="cancelled" className="text-rose-500 font-black italic">✕ İPTAL ET VE ARŞİVLE</option>
                            </select>
                            <Button onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g,'')}`)} variant="outline" className="w-full sm:w-12 rounded-xl sm:rounded-2xl h-[48px] sm:h-[52px] p-0 flex items-center justify-center">
                              <Phone size={18} className="text-emerald-500" />
                              <span className="ml-2 sm:hidden text-xs font-bold text-emerald-500">WhatsApp'tan Ulaş</span>
                            </Button>
                          </div>
                        </div>
                      </AdminCard>
                    ))}
                  </div>
                </div>
              )}

               {/* ARCHIVE TAB */}
              {activeTab === "archive" && (
                <div className="space-y-6">
                   <h2 className="text-2xl font-black tracking-tight italic mb-6">İş Arşivi</h2>
                   <div className="overflow-x-auto rounded-[1.5rem] md:rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/20 pb-4">
                      <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Müşteri / İletişim</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hizmet Detayı</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Sonuç</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Tarih</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {archive.map((job) => (
                            <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="px-8 py-6">
                                <span className="font-black text-sm block italic">{job.fullName}</span>
                                <span className="text-[10px] font-bold text-slate-400">{job.phone}</span>
                              </td>
                              <td className="px-8 py-6">
                                <span className="text-[11px] font-bold text-slate-600 block">{job.serviceId}</span>
                                <span className="text-[9px] font-black text-primary-ocean uppercase italic tracking-widest">{job.district}</span>
                              </td>
                              <td className="px-8 py-6 text-center">
                                <span className={cn("inline-flex px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-tighter", 
                                  job.finalStatus === 'completed' ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
                                )}>
                                  {job.finalStatus === 'completed' ? 'Tamamlandı' : 'İptal'}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-right text-[11px] font-bold text-slate-400 italic">
                                {new Date(job.completedAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {archive.length === 0 && <div className="p-20 text-center text-slate-300 font-bold italic">Arşiv boş.</div>}
                   </div>
                </div>
              )}

              {/* CONTENT TABS */}
              {activeTab === "general" && <GeneralSection data={content} onChange={handleContentChange} />}
              {activeTab === "seo" && <SEOSection data={content} onChange={handleContentChange} />}
              {activeTab === "contact" && <ContactSection data={content} onChange={handleContentChange} />}
              {activeTab === "about" && <AboutSection data={content} onChange={handleContentChange} />}
              {activeTab === "services" && <ServicesSection data={content} onChange={handleContentChange} />}
              {activeTab === "areas" && <ServiceAreasSection data={content} onChange={handleContentChange} />}
              {activeTab === "pricing" && <PricingSection data={content} onChange={handleContentChange} />}
              {activeTab === "campaigns" && <CampaignsSection data={content} onChange={handleContentChange} />}
              
              {activeTab === "advanced" && (
                <AdminCard title="Gelişmiş Veri Editörü" subtitle="DİKKAT: JSON formatını bozarsanız site çalışmayabilir.">
                  <div className="p-4 sm:p-6 bg-slate-900 rounded-[1.5rem] md:rounded-3xl overflow-hidden">
                    <textarea 
                      className="w-full h-[400px] md:h-[600px] bg-transparent text-emerald-400 font-mono text-[10px] sm:text-xs outline-none leading-relaxed resize-none overflow-y-auto min-w-[100%]"
                      spellCheck={false}
                      value={JSON.stringify(content, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value);
                          setContent(parsed);
                          setIsDirty(true);
                        } catch (err) {}
                      }}
                    />
                  </div>
                </AdminCard>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
