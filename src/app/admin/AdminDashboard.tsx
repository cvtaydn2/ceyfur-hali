"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings, Search, Phone, User, Tag, LayoutGrid, Code,
  AlertTriangle, Inbox, Archive, LayoutDashboard, LogOut, ExternalLink,
  MapPin, Briefcase, Users, DollarSign, History, CheckCircle2, ShieldCheck,
} from "lucide-react";
import { SiteContent } from "@/types";
import { Lead, LeadArchive } from "@/lib/leads-schema";
import { ContentSection } from "@/lib/constants";
import { AdminNav, AdminCard } from "@/components/admin/AdminUI";
import { FallbackBanner } from "@/components/admin/FallbackBanner";
import { GeneralSection, SEOSection } from "@/components/admin/sections/BasicSections";
import { ContactSection, AboutSection } from "@/components/admin/sections/ContentSections";
import { ServicesSection } from "@/components/admin/sections/ServicesSection";
import { ServiceAreasSection } from "@/components/admin/sections/ServiceAreasSection";
import { PricingSection } from "@/components/admin/sections/PricingSection";
import { CampaignsSection } from "@/components/admin/sections/CampaignsSection";
import { cn } from "@/lib/utils";
import { AuditLogSection } from "@/components/admin/sections/AuditLogSection";
import { SecuritySection } from "@/components/admin/sections/SecuritySection";
import { Button } from "@/components/ui";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getAuthHeaders, clearAuthToken } from "@/lib/auth-token";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminDashboardProps {
  initialContent: SiteContent;
  isFromFallback: boolean;
  fallbackReason?: string;
  updatedAt?: string;
  onSaveSection: (
    section: ContentSection,
    data: SiteContent[ContentSection]
  ) => Promise<{ success: boolean; message?: string }>;
  onRefresh: () => void;
}

type TabId =
  | "dashboard" | "leads" | "archive" | "general" | "seo"
  | "contact" | "about" | "services" | "areas" | "pricing"
  | "campaigns" | "advanced" | "logs" | "security";

// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "dashboard",  label: "Dashboard",        icon: LayoutDashboard },
  { id: "leads",      label: "Talepler",          icon: Inbox },
  { id: "archive",    label: "Arşiv",             icon: Archive },
  { id: "general",    label: "Genel",             icon: Settings },
  { id: "seo",        label: "SEO",               icon: Search },
  { id: "contact",    label: "İletişim",          icon: Phone },
  { id: "about",      label: "Hakkımızda",        icon: User },
  { id: "services",   label: "Hizmetler",         icon: LayoutGrid },
  { id: "areas",      label: "Hizmet Bölgeleri",  icon: MapPin },
  { id: "pricing",    label: "Fiyatlar",          icon: DollarSign },
  { id: "campaigns",  label: "Kampanyalar",       icon: Tag },
  { id: "advanced",   label: "Gelişmiş",          icon: Code },
  { id: "logs",       label: "Geçmiş",            icon: History },
  { id: "security",   label: "Güvenlik",          icon: ShieldCheck },
];

/** Her tab hangi content section'ına karşılık gelir */
const TAB_SECTION_MAP: Partial<Record<TabId, ContentSection>> = {
  general:   "brand",
  seo:       "seo",
  contact:   "contact",
  about:     "about",
  services:  "services",
  areas:     "services",
  pricing:   "pricing",
  campaigns: "campaigns",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const AdminDashboard = ({
  initialContent,
  isFromFallback,
  fallbackReason,
  updatedAt,
  onSaveSection,
  onRefresh,
}: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [content, setContent] = useState<SiteContent>(initialContent);

  // Dirty tracking: hangi section'lar değişti
  const [dirtySections, setDirtySections] = useState<Set<ContentSection>>(new Set());
  const [savingSection, setSavingSection] = useState<ContentSection | null>(null);

  // Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [archive, setArchive] = useState<LeadArchive[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [leadSearch, setLeadSearch] = useState("");

  const router = useRouter();

  // ─── Leads ──────────────────────────────────────────────────────────────────

  const loadLeadsData = useCallback(async () => {
    setIsLoadingLeads(true);
    try {
      const [leadsRes, archiveRes] = await Promise.all([
        fetch("/api/admin/leads", { credentials: "include", headers: getAuthHeaders() }).then((r) => r.json()),
        fetch("/api/admin/leads?type=archive", { credentials: "include", headers: getAuthHeaders() }).then((r) => r.json()),
      ]);
      if (leadsRes.success) setLeads(leadsRes.data);
      if (archiveRes.success) setArchive(archiveRes.data);
    } catch {
      toast.error("Veriler yüklenirken hata oluştu.");
    } finally {
      setIsLoadingLeads(false);
    }
  }, []);

  useEffect(() => {
    loadLeadsData();
  }, [loadLeadsData]);

  // ─── Content Change ──────────────────────────────────────────────────────────

  const handleContentChange = useCallback(
    (updates: Partial<SiteContent>) => {
      setContent((prev) => ({ ...prev, ...updates }));

      // Hangi section'ların dirty olduğunu takip et
      const changedSections = Object.keys(updates) as ContentSection[];
      setDirtySections((prev) => {
        const next = new Set(prev);
        changedSections.forEach((s) => next.add(s));
        return next;
      });
    },
    []
  );

  // ─── Section Save ────────────────────────────────────────────────────────────

  const handleSaveSection = async (section: ContentSection) => {
    setSavingSection(section);
    const result = await onSaveSection(section, content[section]);

    if (result.success) {
      setDirtySections((prev) => {
        const next = new Set(prev);
        next.delete(section);
        // services ve areas aynı section'ı paylaşır
        if (section === "services") next.delete("services");
        return next;
      });
      toast.success(result.message ?? "Kaydedildi.");
    } else {
      toast.error(result.message ?? "Hata oluştu.");
    }

    setSavingSection(null);
  };

  // ─── Tab Change Guard ────────────────────────────────────────────────────────

  const handleTabChange = (id: TabId) => {
    const currentSection = TAB_SECTION_MAP[activeTab];
    if (currentSection && dirtySections.has(currentSection)) {
      const confirmed = window.confirm(
        "Kaydedilmemiş değişiklikleriniz var. Çıkmak istediğinize emin misiniz?"
      );
      if (!confirmed) return;
      // Değişiklikleri geri al
      setContent(initialContent);
      setDirtySections(new Set());
    }
    setActiveTab(id);
  };

  // ─── Lead Actions ────────────────────────────────────────────────────────────

  const handleLeadStatusChange = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Durum güncellendi.");
        await loadLeadsData();
      } else {
        toast.error(data.message ?? "Güncelleme başarısız.");
      }
    } catch {
      toast.error("Ağ hatası oluştu.");
    }
  };

  // ─── Logout ──────────────────────────────────────────────────────────────────

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include", headers: getAuthHeaders() });
    clearAuthToken();
    router.push("/auth/login");
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  const currentSection = TAB_SECTION_MAP[activeTab];
  const isCurrentDirty = currentSection ? dirtySections.has(currentSection) : false;
  const isCurrentSaving = currentSection ? savingSection === currentSection : false;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-4 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary-ocean flex items-center justify-center">
            <span className="text-white font-black text-xs">C</span>
          </div>
          <span className="font-black text-slate-900 tracking-tight">Ceyfur Admin</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Siteyi Gör</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 p-4 lg:p-8 max-w-[1600px] mx-auto">
        {/* Sidebar */}
        <aside className="lg:w-56 shrink-0">
          <FallbackBanner
            isVisible={isFromFallback}
            reason={fallbackReason}
            updatedAt={updatedAt}
            onRefresh={onRefresh}
          />
          <AdminNav
            activeTab={activeTab}
            onTabChange={(id) => handleTabChange(id as TabId)}
            tabs={TABS}
            dirtySections={dirtySections}
            tabSectionMap={TAB_SECTION_MAP}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Section Save Bar */}
          <AnimatePresence>
            {isCurrentDirty && currentSection && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-4 flex items-center justify-between px-5 py-3 rounded-2xl bg-primary-ocean/5 border border-primary-ocean/20"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-primary-ocean">
                  <AlertTriangle size={16} />
                  Kaydedilmemiş değişiklikler var
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  isLoading={isCurrentSaving}
                  onClick={() => handleSaveSection(currentSection)}
                >
                  {isCurrentSaving ? "Kaydediliyor..." : "Kaydet"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === "dashboard" && (
                <DashboardTab
                  content={content}
                  leads={leads}
                  archive={archive}
                  isLoading={isLoadingLeads}
                />
              )}
              {activeTab === "leads" && (
                <LeadsTab
                  leads={leads}
                  search={leadSearch}
                  onSearchChange={setLeadSearch}
                  onStatusChange={handleLeadStatusChange}
                  isLoading={isLoadingLeads}
                  onRefresh={loadLeadsData}
                />
              )}
              {activeTab === "archive" && (
                <ArchiveTab archive={archive} isLoading={isLoadingLeads} />
              )}
              {activeTab === "general" && (
                <GeneralSection data={content} onChange={handleContentChange} />
              )}
              {activeTab === "seo" && (
                <SEOSection data={content} onChange={handleContentChange} />
              )}
              {activeTab === "contact" && (
                <ContactSection data={content} onChange={handleContentChange} />
              )}
              {activeTab === "about" && (
                <AboutSection data={content} onChange={handleContentChange} />
              )}
              {activeTab === "services" && (
                <ServicesSection data={content} onChange={handleContentChange} />
              )}
              {activeTab === "areas" && (
                <ServiceAreasSection data={content} onChange={handleContentChange} />
              )}
              {activeTab === "pricing" && (
                <PricingSection data={content} onChange={handleContentChange} />
              )}
              {activeTab === "campaigns" && (
                <CampaignsSection data={content} onChange={handleContentChange} />
              )}
              {activeTab === "advanced" && (
                <AdvancedTab
                  content={content}
                  onSave={() => handleSaveSection("brand")}
                />
              )}
              {activeTab === "logs" && <AuditLogSection />}
              {activeTab === "security" && <SecuritySection />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

// ─── Sub-Tabs ─────────────────────────────────────────────────────────────────

function DashboardTab({
  content,
  leads,
  archive,
  isLoading,
}: {
  content: SiteContent;
  leads: Lead[];
  archive: LeadArchive[];
  isLoading: boolean;
}) {
  const newLeads = leads.filter((l) => l.status === "new").length;
  const bookedLeads = leads.filter((l) => l.status === "booked").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">
          {content.brand.name} — Yönetim Paneli
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Yeni Talep" value={newLeads} icon={Inbox} color="blue" />
        <StatCard label="Randevulu" value={bookedLeads} icon={Briefcase} color="green" />
        <StatCard label="Toplam Talep" value={leads.length} icon={Users} color="purple" />
        <StatCard label="Arşiv" value={archive.length} icon={Archive} color="slate" />
      </div>

      {leads.length > 0 && (
        <AdminCard title="Son Talepler" subtitle="En son 5 müşteri talebi">
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
              >
                <div>
                  <p className="font-bold text-slate-900 text-sm">{lead.fullName}</p>
                  <p className="text-xs text-slate-400">{lead.phone} · {lead.district}</p>
                </div>
                <LeadStatusBadge status={lead.status} />
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {isLoading && (
        <div className="text-center py-8 text-slate-300 font-bold text-sm">
          Yükleniyor...
        </div>
      )}
    </div>
  );
}

function LeadsTab({
  leads,
  search,
  onSearchChange,
  onStatusChange,
  isLoading,
  onRefresh,
}: {
  leads: Lead[];
  search: string;
  onSearchChange: (v: string) => void;
  onStatusChange: (id: string, status: string) => void;
  isLoading: boolean;
  onRefresh: () => void;
}) {
  const filtered = leads.filter(
    (l) =>
      l.fullName.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      l.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Talepler</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">{leads.length} aktif talep</p>
        </div>
        <Button size="sm" variant="outline" onClick={onRefresh} isLoading={isLoading}>
          Yenile
        </Button>
      </div>

      <input
        type="search"
        placeholder="İsim, telefon veya ilçe ara..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-5 py-3 rounded-2xl bg-white border border-slate-100 outline-none focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5 font-medium text-slate-900 placeholder:text-slate-300 text-sm"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-300 font-bold">
          {search ? "Arama sonucu bulunamadı." : "Henüz talep yok."}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <LeadCard key={lead.id} lead={lead} onStatusChange={onStatusChange} />
          ))}
        </div>
      )}
    </div>
  );
}

function ArchiveTab({
  archive,
  isLoading,
}: {
  archive: LeadArchive[];
  isLoading: boolean;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Arşiv</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">
          {archive.length} tamamlanmış / iptal edilmiş talep
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-16 text-slate-300 font-bold text-sm">Yükleniyor...</div>
      ) : archive.length === 0 ? (
        <div className="text-center py-16 text-slate-300 font-bold">Arşiv boş.</div>
      ) : (
        <div className="space-y-3">
          {archive.map((item) => (
            <AdminCard key={item.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900">{item.fullName}</p>
                  <p className="text-sm text-slate-400">{item.phone} · {item.district}</p>
                  <p className="text-xs text-slate-300 mt-1">
                    {new Date(item.completedAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    item.finalStatus === "completed"
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-600"
                  )}
                >
                  {item.finalStatus === "completed" ? "Tamamlandı" : "İptal"}
                </span>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}

function AdvancedTab({
  content,
  onSave,
}: {
  content: SiteContent;
  onSave: () => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gelişmiş</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">Ham JSON görünümü</p>
      </div>
      <AdminCard title="Ham İçerik (Salt Okunur)">
        <pre className="text-xs text-slate-500 bg-slate-50 rounded-2xl p-6 overflow-auto max-h-[600px] font-mono">
          {JSON.stringify(content, null, 2)}
        </pre>
      </AdminCard>
    </div>
  );
}

// ─── Small Components ─────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: "blue" | "green" | "purple" | "slate";
}) {
  const colors = {
    blue:   "bg-blue-50 text-blue-600",
    green:  "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600",
    slate:  "bg-slate-100 text-slate-600",
  };

  return (
    <AdminCard>
      <div className="flex items-center gap-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colors[color])}>
          <Icon size={18} />
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900">{value}</p>
          <p className="text-xs font-bold text-slate-400">{label}</p>
        </div>
      </div>
    </AdminCard>
  );
}

function LeadCard({
  lead,
  onStatusChange,
}: {
  lead: Lead;
  onStatusChange: (id: string, status: string) => void;
}) {
  const statusOptions = [
    { value: "new",       label: "Yeni" },
    { value: "called",    label: "Arandı" },
    { value: "quoted",    label: "Teklif Verildi" },
    { value: "booked",    label: "Randevu Alındı" },
    { value: "completed", label: "Tamamlandı" },
    { value: "cancelled", label: "İptal" },
  ];

  return (
    <AdminCard>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-bold text-slate-900">{lead.fullName}</p>
            <LeadStatusBadge status={lead.status} />
          </div>
          <p className="text-sm text-slate-500">
            📞 {lead.phone} · 📍 {lead.district}
          </p>
          {lead.notes && (
            <p className="text-xs text-slate-400 italic">"{lead.notes}"</p>
          )}
          <p className="text-xs text-slate-300">
            {new Date(lead.createdAt).toLocaleDateString("tr-TR", {
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <select
          value={lead.status}
          onChange={(e) => onStatusChange(lead.id, e.target.value)}
          className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-700 outline-none focus:border-primary-ocean cursor-pointer"
          aria-label={`${lead.fullName} talebinin durumunu değiştir`}
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </AdminCard>
  );
}

function LeadStatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; className: string }> = {
    new:       { label: "Yeni",             className: "bg-blue-50 text-blue-600" },
    called:    { label: "Arandı",           className: "bg-amber-50 text-amber-600" },
    quoted:    { label: "Teklif Verildi",   className: "bg-violet-50 text-violet-600" },
    booked:    { label: "Randevu Alındı",   className: "bg-emerald-50 text-emerald-600" },
    completed: { label: "Tamamlandı",       className: "bg-emerald-50 text-emerald-700" },
    cancelled: { label: "İptal",            className: "bg-rose-50 text-rose-600" },
  };

  const { label, className } = config[status] ?? { label: status, className: "bg-slate-50 text-slate-600" };

  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-bold", className)}>
      {label}
    </span>
  );
}
