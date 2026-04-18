"use client";

import React, { useState } from "react";
import { 
  Save, LayoutDashboard, Settings, FileText, LogOut, Info, Share2, 
  Tag, Briefcase, ChevronRight, AlertCircle, CheckCircle2, 
  Plus, Trash2, PhoneCall, TrendingUp, Users, ShoppingBag, DollarSign,
  Clock as ClockIcon, Activity, Inbox, Archive, Search, Filter, 
  MoreVertical, Clock, Phone, User, MapPin, Calendar
} from "lucide-react";
import { Lead, LeadArchive } from "@/lib/leads-schema";
import { toast as hotToast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

// Global Best Practices: Modular UI Components
import { Button, Input, Toast } from "@/components/ui";
// Global Best Practices: Custom Hooks for Data Logic
import { useSiteContent } from "@/hooks/use-site-content";

export default function AdminPage() {
  const { content, setContent, isLoading, isSaving, save, error: fetchError } = useSiteContent();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [activeTab, setActiveTab] = useState<"dashboard" | "general" | "services" | "campaigns" | "about" | "contact" | "raw" | "leads" | "archive">("dashboard");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [archive, setArchive] = useState<LeadArchive[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const router = useRouter();

  const handleSave = async () => {
    if (!content) return;
    setStatus("idle");
    const result: any = await save(content);
    if (result.success) {
      setStatus("success");
      hotToast.success("Tüm değişiklikler başarıyla buluta işlendi.");
    } else {
      setStatus("error");
      hotToast.error(result.message || "Bir hata oluştu.");
    }
  };


  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
      router.refresh();
    } catch (err) {
      router.push("/auth/login");
    }
  };

  const fetchLeads = async () => {
    setIsLoadingLeads(true);
    try {
      const res = await fetch("/api/admin/leads?type=active");
      const data = await res.json();
      if (data.success) setLeads(data.data);
    } catch (error) {
      hotToast.error("Talepler yüklenemedi.");
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const fetchArchive = async () => {
    try {
      const res = await fetch("/api/admin/leads?type=archive");
      const data = await res.json();
      if (data.success) setArchive(data.data);
    } catch (error) {
      console.error("Archive fetch error");
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        hotToast.success("Durum güncellendi.");
        fetchLeads();
        fetchArchive();
      }
    } catch (error) {
      hotToast.error("Güncelleme başarısız.");
    }
  };

  React.useEffect(() => {
    if (activeTab === "leads") fetchLeads();
    if (activeTab === "archive") fetchArchive();
    if (activeTab === "dashboard") {
      fetchLeads();
      fetchArchive();
    }
  }, [activeTab]);

  if (isLoading || !content) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-primary-ocean border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 font-bold italic animate-pulse">Panel Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // List Management Helpers
  const addCampaign = () => {
    const newItem = {
      id: `c${Date.now()}`,
      badge: "Yeni",
      title: "Yeni Kampanya",
      ctaLabel: "Teklif Al",
      features: ["Özellik 1"],
      priceNote: "İndirim Oranı",
      description: "Kampanya açıklaması"
    };
    setContent({
      ...content!, 
      campaigns: {
        ...content!.campaigns, 
        items: [...content!.campaigns.items, newItem]
      }
    });
  };

  const removeCampaign = (id: string) => {
    setContent({
      ...content!, 
      campaigns: {
        ...content!.campaigns, 
        items: content!.campaigns.items.filter((item: any) => item.id !== id)
      }
    });
  };


  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-24 px-4 overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-72 space-y-3">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-ocean/10 rounded-xl flex items-center justify-center text-primary-ocean">
                <LayoutDashboard size={20} />
              </div>
              <div>
                <span className="font-black block leading-none">Ceyfur Admin</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Panel v2.1</span>
              </div>
            </div>
            
            <nav className="space-y-2">
                {[
                  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
                  { id: "leads", label: "Talepler", icon: Inbox, count: leads.length },
                  { id: "archive", label: "İş Arşivi", icon: Archive },
                  { id: "general", label: "Genel Ayarlar", icon: Settings },
                  { id: "services", label: "Hizmetler", icon: Briefcase },
                  { id: "campaigns", label: "Kampanyalar", icon: Tag },
                  { id: "about", label: "Hakkımızda", icon: Info },
                  { id: "contact", label: "İletişim & Sosyal", icon: Share2 },
                  { id: "raw", label: "Gelişmiş JSON", icon: FileText },
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black transition-all duration-300 ${
                      activeTab === tab.id 
                      ? "bg-slate-900 text-white shadow-xl shadow-slate-200" 
                      : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <tab.icon size={18} />
                      {tab.label}
                      {tab.count !== undefined && tab.count > 0 && (
                        <span className="ml-2 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full ring-4 ring-white">
                          {tab.count}
                        </span>
                      )}
                    </div>
                    {activeTab === tab.id && <ChevronRight size={16} />}
                  </button>
                ))}
            </nav>

            <div className="pt-6 mt-6 border-t border-slate-200">
              <Button variant="danger" className="w-full" onClick={handleLogout} leftIcon={<LogOut size={18} />}>
                Güvenli Çıkış
              </Button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            <div className="bg-white p-8 lg:p-12 rounded-[3.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 min-h-[700px] flex flex-col">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight capitalize">{activeTab}</h1>
                  <p className="text-slate-500 mt-1 font-medium italic">Seçili bölümün ayarlarını buradan yönetin.</p>
                </div>
                
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={handleSave} 
                  isLoading={isSaving}
                  leftIcon={<Save size={20} />}
                >
                  Değişiklikleri Kaydet
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {status === "success" && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-emerald-50 text-emerald-700 rounded-3xl font-bold mb-8 border border-emerald-100 flex items-center gap-3">
                    <CheckCircle2 size={20} /> İçerik başarıyla güncellendi!
                  </motion.div>
                )}
                {status === "error" && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-5 bg-rose-50 text-rose-700 rounded-3xl font-bold mb-8 border border-rose-100 flex items-center gap-3">
                    <AlertCircle size={20} /> Bir hata oluştu, lütfen formu kontrol edin.
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex-1">
                {activeTab === "dashboard" && (
                  <div className="space-y-10">
                    {/* Stats Cards - REAL DATA */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { label: "Aktif Hizmetler", value: content.services.items.length, icon: Briefcase, color: "text-primary-ocean" },
                        { label: "Bekleyen Talepler", value: leads.length, icon: Inbox, color: "text-emerald-500" },
                        { label: "Müşteri Yorumları", value: content.testimonials.items.length, icon: Users, color: "text-turquoise" },
                        { label: "Tamamlanan İşler", value: archive.length, icon: Archive, color: "text-amber-500" },
                      ].map((stat, i) => (
                        <motion.div 
                          key={i}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100/50 hover:bg-white transition-all group shadow-sm hover:shadow-xl"
                        >
                          <div className={cn("w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform", stat.color)}>
                            <stat.icon size={24} />
                          </div>
                          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</h4>
                          <p className="text-4xl font-black text-slate-900 mt-1">{stat.value}</p>
                        </motion.div>
                      ))}
                    </div>

                    {/* Quick System Info */}
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="p-10 rounded-[3rem] bg-slate-900 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                          <h3 className="text-2xl font-black mb-2 italic">Hoş Geldiniz, Yönetici</h3>
                          <p className="text-slate-400 font-medium max-w-md italic">Ceyfur Halı Yıkama içerik yönetim sistemindesiniz. Tüm değişiklikler anında yayına alınır.</p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-ocean/20 blur-[100px] -mr-32 -mt-32 group-hover:bg-primary-ocean/30 transition-all duration-1000" />
                      </div>

                      <div className="p-10 rounded-[3rem] bg-emerald-500 text-white relative overflow-hidden group cursor-pointer" onClick={() => setActiveTab("leads")}>
                        <div className="relative z-10">
                          <h3 className="text-2xl font-black mb-2 italic">Yeni Talepleriniz Var</h3>
                          <p className="text-emerald-100 font-medium max-w-md italic">{leads.filter(l => l.status === 'new').length} adet yeni müşteri talebi ilgi bekliyor.</p>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] -mr-32 -mt-32 group-hover:bg-white/30 transition-all duration-1000" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "leads" && (
                  <div className="space-y-8">
                    {/* Header & Filters */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 p-8 rounded-[3rem] border border-slate-100/50">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 italic">Aktif Talepler</h2>
                        <p className="text-slate-400 font-medium italic text-xs">Müşteri randevu ve teklif isteklerini buradan yönetin.</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="relative group">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-ocean transition-colors" size={16} />
                          <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Müşteri veya ilçe ara..."
                            className="pl-12 pr-6 py-3 rounded-2xl bg-white border border-slate-200 outline-none text-xs font-bold w-64"
                          />
                        </div>
                        <select 
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-6 py-3 rounded-2xl bg-white border border-slate-200 outline-none text-xs font-bold appearance-none cursor-pointer"
                        >
                          <option value="all">Tüm Durumlar</option>
                          <option value="new">Yeni</option>
                          <option value="called">Arandı</option>
                          <option value="quoted">Teklif Verildi</option>
                          <option value="booked">Randevu Alındı</option>
                        </select>
                      </div>
                    </div>

                    {/* Leads Table */}
                    <div className="space-y-4">
                      {leads
                        .filter(l => (statusFilter === 'all' || l.status === statusFilter) && 
                                    (l.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                     l.district.toLowerCase().includes(searchQuery.toLowerCase())))
                        .map((lead, i) => (
                        <motion.div 
                          key={lead.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 hover:border-primary-ocean/20 transition-all shadow-sm hover:shadow-xl relative overflow-hidden"
                        >
                          <div className={cn("absolute top-0 left-0 w-1.5 h-full transition-colors", 
                            lead.status === 'new' ? "bg-emerald-500" : 
                            lead.status === 'called' ? "bg-blue-500" :
                            lead.status === 'quoted' ? "bg-amber-500" : "bg-primary-ocean"
                          )} />
                          
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                            <div className="space-y-4 flex-1">
                              <div className="flex items-center gap-4">
                                <h3 className="text-xl font-black text-slate-900 italic tracking-tight">{lead.fullName}</h3>
                                <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full",
                                  lead.status === 'new' ? "bg-emerald-50 text-emerald-500" : 
                                  lead.status === 'called' ? "bg-blue-50 text-blue-500" :
                                  lead.status === 'quoted' ? "bg-amber-50 text-amber-500" : "bg-primary-ocean/5 text-primary-ocean"
                                )}>
                                  {lead.status === 'new' ? "Yeni Talep" : 
                                   lead.status === 'called' ? "Arandı" :
                                   lead.status === 'quoted' ? "Teklif Verildi" : "Randevu Alındı"}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="flex items-center gap-3 text-slate-500 font-bold text-xs italic">
                                  <Phone size={14} className="text-slate-300" /> {lead.phone}
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 font-bold text-xs italic">
                                  <Briefcase size={14} className="text-slate-300" /> {lead.serviceId}
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 font-bold text-xs italic">
                                  <MapPin size={14} className="text-slate-300" /> {lead.district}
                                </div>
                                <div className="flex items-center gap-3 text-slate-500 font-bold text-xs italic">
                                  <Calendar size={14} className="text-slate-300" /> {lead.preferredDate ? new Date(lead.preferredDate).toLocaleDateString('tr-TR') : 'Belirtilmedi'}
                                </div>
                              </div>
                              
                              {lead.notes && (
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/50 text-slate-400 text-xs font-medium italic">
                                  &ldquo;{lead.notes}&rdquo;
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                               <select 
                                onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                                value={lead.status}
                                className="px-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 outline-none text-xs font-black uppercase tracking-widest hover:bg-white hover:border-primary-ocean transition-all cursor-pointer appearance-none text-center"
                              >
                                <option value="new">Durum: Yeni</option>
                                <option value="called">Durum: Arandı</option>
                                <option value="quoted">Durum: Teklif Verildi</option>
                                <option value="booked">Durum: Randevu Alındı</option>
                                <option disabled>──────────</option>
                                <option value="completed" className="text-emerald-500">✓ TAMAMLA (ARŞİVLE)</option>
                                <option value="cancelled" className="text-rose-500">✕ İPTAL ET (ARŞİVLE)</option>
                              </select>
                              
                              <Button 
                                onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\s+/g, '')}`, '_blank')}
                                size="sm" 
                                variant="outline"
                                className="rounded-2xl h-[52px]"
                              >
                                WhatsApp
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {leads.length === 0 && (
                        <div className="p-20 text-center space-y-4 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                           <Inbox size={48} className="mx-auto text-slate-200" />
                           <p className="text-slate-400 font-bold italic">Henüz aktif bir talep bulunmuyor.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "archive" && (
                  <div className="space-y-8">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50 p-8 rounded-[3rem] border border-slate-100/50">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 italic">İş Arşivi</h2>
                        <p className="text-slate-400 font-medium italic text-xs">Tamamlanan veya iptal edilen geçmiş kayıtlar.</p>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-[3rem] border border-slate-100 shadow-sm">
                      <table className="w-full text-left bg-white">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Müşteri</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hizmet / Bölge</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Durum</th>
                            <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tamamlama Tarihi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {archive.map((job) => (
                            <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-8 py-6">
                                <div className="font-bold text-slate-900 italic">{job.fullName}</div>
                                <div className="text-[10px] text-slate-400 font-medium">{job.phone}</div>
                              </td>
                              <td className="px-8 py-6">
                                <div className="text-xs font-bold text-slate-600 tracking-tight">{job.serviceId}</div>
                                <div className="text-[10px] text-primary-ocean font-black uppercase italic">{job.district}</div>
                              </td>
                              <td className="px-8 py-6">
                                <span className={cn("text-[9px] font-black uppercase tracking-tighter px-3 py-1 rounded-full",
                                  job.finalStatus === 'completed' ? "bg-emerald-50 text-emerald-500" : "bg-slate-100 text-slate-400"
                                )}>
                                  {job.finalStatus === 'completed' ? "Tamamlandı" : "İptal Edildi"}
                                </span>
                              </td>
                              <td className="px-8 py-6 text-[11px] font-bold text-slate-400 italic">
                                {new Date(job.completedAt).toLocaleDateString('tr-TR')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {archive.length === 0 && (
                        <div className="p-20 text-center bg-white">
                          <p className="text-slate-300 font-bold italic">Arşiv henüz boş.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {activeTab === "general" && (
                  <div className="grid gap-8">
                    <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-6">
                       <h3 className="text-lg font-black text-slate-900 border-b pb-4">Marka & Slogan</h3>
                       <div className="grid md:grid-cols-2 gap-6">
                        <Input 
                          label="Marka Adı" 
                          value={content.brand.name} 
                          onChange={(e) => setContent({...content, brand: {...content.brand, name: e.target.value}})} 
                        />
                        <Input 
                          label="Slogan" 
                          value={content.brand.slogan} 
                          onChange={(e) => setContent({...content, brand: {...content.brand, slogan: e.target.value}})} 
                        />
                       </div>
                    </div>
                    <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 space-y-6">
                       <h3 className="text-lg font-black text-slate-900 border-b pb-4">SEO & Arayüz Yapılandırması</h3>
                      <div className="space-y-4">
                        <Input 
                          label="Site Başlığı (Metatitle)" 
                          value={content.seo.title} 
                          onChange={(e) => setContent({...content, seo: {...content.seo, title: e.target.value}})} 
                        />
                        <Input 
                          label="Sosyal Medya Paylaşım Görseli (OG Image URL)" 
                          value={content.seo.ogImage || ""} 
                          onChange={(e) => setContent({...content, seo: {...content.seo, ogImage: e.target.value}})} 
                          placeholder="/images/og-image.jpg"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Meta Açıklama</label>
                        <textarea 
                          value={content.seo.description}
                          onChange={(e) => setContent({...content, seo: {...content.seo, description: e.target.value}})}
                          className="w-full px-6 py-4 rounded-2xl bg-white border border-slate-100 outline-none focus:border-primary-ocean transition-all font-medium text-sm min-h-[100px]"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === "services" && (
                  <div className="space-y-8">
                    {content.services.items.map((service, index) => (
                      <div key={index} className="p-10 rounded-[3rem] border border-slate-100 bg-slate-50/50 space-y-8">
                        <div className="flex justify-between items-center">
                          <label className="text-[10px] font-black text-primary-ocean uppercase tracking-widest bg-primary-ocean/10 px-4 py-2 rounded-full">Hizmet Modülü: {service.title}</label>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                          <Input 
                            value={service.title} 
                            onChange={(e) => {
                              const newItems = [...content.services.items];
                              newItems[index].title = e.target.value;
                              setContent({...content, services: {...content.services, items: newItems}});
                            }}
                            label="Hizmet Adı"
                          />
                          <Input 
                            value={service.image} 
                            onChange={(e) => {
                              const newItems = [...content.services.items];
                              newItems[index].image = e.target.value;
                              setContent({...content, services: {...content.services, items: newItems}});
                            }}
                            label="Görsel Yolu / URL"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kısa Açıklama</label>
                          <textarea 
                            value={service.description} 
                            onChange={(e) => {
                              const newItems = [...content.services.items];
                              newItems[index].description = e.target.value;
                              setContent({...content, services: {...content.services, items: newItems}});
                            }}
                            className="w-full px-8 py-6 rounded-[2rem] bg-white border border-slate-100 outline-none text-sm font-medium resize-none focus:border-primary-ocean transition-all shadow-sm"
                            rows={3}
                          />
                        </div>
                        
                        <div className="space-y-4">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Öne Çıkan Özellikler</label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {service.features.map((feature, fIdx) => (
                              <div key={fIdx} className="relative">
                                <input 
                                  value={feature}
                                  onChange={(e) => {
                                    const newItems = [...content.services.items];
                                    newItems[index].features[fIdx] = e.target.value;
                                    setContent({...content, services: {...content.services, items: newItems}});
                                  }}
                                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-white border border-slate-100 text-xs font-bold outline-none focus:border-primary-ocean"
                                />
                                <button 
                                  onClick={() => {
                                    const newItems = [...content.services.items];
                                    newItems[index].features = newItems[index].features.filter((_, i) => i !== fIdx);
                                    setContent({...content, services: {...content.services, items: newItems}});
                                  }}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-400 hover:text-rose-600"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            ))}
                            <button 
                              onClick={() => {
                                const newItems = [...content.services.items];
                                newItems[index].features.push("Yeni Özellik");
                                setContent({...content, services: {...content.services, items: newItems}});
                              }}
                              className="px-4 py-3 rounded-xl border border-dashed border-slate-300 text-[10px] font-black uppercase text-slate-400 hover:border-primary-ocean hover:text-primary-ocean transition-all"
                            >
                              + Özellik Ekle
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "campaigns" && (
                  <div className="space-y-10">
                    <div className="flex justify-between items-center bg-slate-50 p-6 rounded-[2rem] border border-slate-100/50">
                      <p className="text-slate-500 font-bold italic text-sm italic">Aktif kampanyaları ve indirimleri buradan güncelleyin.</p>
                      <Button onClick={addCampaign} size="sm" leftIcon={<Plus size={18} />}>Yeni Kampanya</Button>
                    </div>
                    
                    <div className="space-y-8">
                      {content.campaigns.items.map((campaign, index) => (
                        <div key={campaign.id} className="p-10 rounded-[3rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/20 relative group">
                          <Button 
                            variant="danger" 
                            size="sm"
                            className="absolute -top-3 -right-3 rounded-full w-10 h-10 p-0 opacity-0 group-hover:opacity-100 transition-opacity" 
                            onClick={() => removeCampaign(campaign.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                          
                          <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <Input 
                              label="Kart Etiketi (Badge)" 
                              value={campaign.badge} 
                              onChange={(e) => {
                                const items = [...content.campaigns.items];
                                items[index].badge = e.target.value;
                                setContent({...content, campaigns: {...content.campaigns, items}});
                              }}
                            />
                            <div className="md:col-span-2">
                              <Input 
                                label="Kampanya Başlığı" 
                                value={campaign.title} 
                                onChange={(e) => {
                                  const items = [...content.campaigns.items];
                                  items[index].title = e.target.value;
                                  setContent({...content, campaigns: {...content.campaigns, items}});
                                }}
                              />
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-2">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kampanya Detayı</label>
                              <textarea 
                                value={campaign.description} 
                                onChange={(e) => {
                                  const items = [...content.campaigns.items];
                                  items[index].description = e.target.value;
                                  setContent({...content, campaigns: {...content.campaigns, items}});
                                }}
                                className="w-full px-8 py-6 rounded-[2rem] bg-slate-50 border border-slate-100 outline-none text-sm font-medium focus:bg-white focus:border-primary-ocean transition-all"
                                rows={2}
                              />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                               <Input 
                                label="Fiyat / İndirim Notu" 
                                value={campaign.priceNote || ""} 
                                onChange={(e) => {
                                  const items = [...content.campaigns.items];
                                  items[index].priceNote = e.target.value;
                                  setContent({...content, campaigns: {...content.campaigns, items}});
                                }}
                                placeholder="Örn: %20 İndirim"
                              />
                              <Input 
                                label="Buton Yazısı" 
                                value={campaign.ctaLabel} 
                                onChange={(e) => {
                                  const items = [...content.campaigns.items];
                                  items[index].ctaLabel = e.target.value;
                                  setContent({...content, campaigns: {...content.campaigns, items}});
                                }}
                              />
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Kampanya Maddeleri</label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {campaign.features.map((feature, fIdx) => (
                                  <div key={fIdx} className="flex gap-2">
                                    <input 
                                      value={feature}
                                      onChange={(e) => {
                                        const items = [...content.campaigns.items];
                                        items[index].features[fIdx] = e.target.value;
                                        setContent({...content, campaigns: {...content.campaigns, items}});
                                      }}
                                      className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-bold outline-none focus:bg-white focus:border-primary-ocean"
                                    />
                                    <button 
                                      onClick={() => {
                                        const items = [...content.campaigns.items];
                                        items[index].features = items[index].features.filter((_, i) => i !== fIdx);
                                        setContent({...content, campaigns: {...content.campaigns, items}});
                                      }}
                                      className="p-3 text-rose-400 hover:text-rose-600"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                ))}
                                <button 
                                  onClick={() => {
                                    const items = [...content.campaigns.items];
                                    items[index].features.push("Yeni Madde");
                                    setContent({...content, campaigns: {...content.campaigns, items}});
                                  }}
                                  className="px-4 py-3 rounded-xl border border-dashed border-slate-300 text-[10px] font-black uppercase text-slate-400 hover:border-primary-ocean hover:text-primary-ocean transition-all"
                                >
                                  + Madde Ekle
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "about" && (
                  <div className="space-y-8">
                    <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 space-y-8">
                      <div className="grid md:grid-cols-2 gap-8">
                        <Input 
                          label="Bölüm Başlığı" 
                          value={content.about.title} 
                          onChange={(e) => setContent({...content, about: {...content.about, title: e.target.value}})} 
                        />
                        <Input 
                          label="Alt Başlık" 
                          value={content.about.subtitle} 
                          onChange={(e) => setContent({...content, about: {...content.about, subtitle: e.target.value}})} 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ana Hikaye İçeriği</label>
                        <textarea
                          rows={8}
                          value={content.about.content}
                          onChange={(e) => setContent({...content, about: {...content.about, content: e.target.value}})}
                          className="w-full px-8 py-8 rounded-[2.5rem] bg-white border border-slate-100 outline-none font-medium text-slate-600 leading-relaxed resize-none transition-all focus:border-primary-ocean shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "contact" && (
                  <div className="grid gap-10">
                    <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 space-y-8">
                      <h3 className="text-lg font-black text-slate-900 border-b pb-4">İletişim Kanalları</h3>
                      <div className="grid md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Telefon Numaraları</label>
                          <div className="space-y-3">
                            {content.contact.phone.map((num, idx) => (
                              <div key={idx} className="flex gap-2 group">
                                <Input 
                                  value={num} 
                                  onChange={(e) => {
                                    const phones = [...content.contact.phone];
                                    phones[idx] = e.target.value;
                                    setContent({...content, contact: {...content.contact, phone: phones}});
                                  }} 
                                  placeholder="0212..."
                                  className="flex-1"
                                />
                                {content.contact.phone.length > 1 && (
                                  <button 
                                    onClick={() => {
                                      const phones = content.contact.phone.filter((_, i) => i !== idx);
                                      setContent({...content, contact: {...content.contact, phone: phones}});
                                    }}
                                    className="p-4 text-rose-400 hover:text-rose-600 transition-colors"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => {
                            setContent({...content, contact: {...content.contact, phone: [...content.contact.phone, ""]}});
                          }} className="w-full border-dashed">+ Yeni Numara</Button>
                        </div>
                        
                        <div className="space-y-6">
                           <Input 
                            label="WhatsApp No (Lokal Format)" 
                            value={content.contact.whatsapp} 
                            onChange={(e) => setContent({...content, contact: {...content.contact, whatsapp: e.target.value}})} 
                          />
                          <Input 
                            label="E-Posta Adresi" 
                            value={content.contact.email} 
                            onChange={(e) => setContent({...content, contact: {...content.contact, email: e.target.value}})} 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 space-y-6">
                      <h3 className="text-lg font-black text-slate-900 border-b pb-4">Adres & Çalışma Saatleri</h3>
                      <div className="grid md:grid-cols-3 gap-6">
                         <Input 
                            label="İlçe" 
                            value={content.contact.district} 
                            onChange={(e) => setContent({...content, contact: {...content.contact, district: e.target.value}})} 
                          />
                          <Input 
                            label="Şehir" 
                            value={content.contact.city} 
                            onChange={(e) => setContent({...content, contact: {...content.contact, city: e.target.value}})} 
                          />
                          <Input 
                            label="Çalışma Saatleri" 
                            value={content.contact.workingHours} 
                            onChange={(e) => setContent({...content, contact: {...content.contact, workingHours: e.target.value}})} 
                          />
                      </div>
                      <Input 
                        label="Tam Adres" 
                        value={content.contact.address} 
                        onChange={(e) => setContent({...content, contact: {...content.contact, address: e.target.value}})} 
                      />
                    </div>
                  </div>
                )}

                {activeTab === "raw" && (
                  <div className="h-full">
                    <textarea
                      value={JSON.stringify(content, null, 2)}
                      onChange={(e) => {
                        try {
                          setContent(JSON.parse(e.target.value));
                        } catch (err) {}
                      }}
                      className="w-full h-[600px] p-8 rounded-[2.5rem] bg-slate-900 text-turquoise font-mono text-sm border-none outline-none shadow-inner"
                    />
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
