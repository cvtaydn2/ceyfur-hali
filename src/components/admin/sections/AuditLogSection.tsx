"use client";

import React, { useState, useEffect } from "react";
import { AdminCard } from "../AdminUI";
import { AuditLogEntry } from "@/lib/audit-log";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const ACTION_LABELS: Record<string, { label: string; className: string }> = {
  content_update: { label: "İçerik Güncellendi",  className: "bg-blue-50 text-blue-600" },
  section_update: { label: "Bölüm Güncellendi",   className: "bg-violet-50 text-violet-600" },
  login:          { label: "Giriş Yapıldı",        className: "bg-emerald-50 text-emerald-600" },
  logout:         { label: "Çıkış Yapıldı",        className: "bg-slate-100 text-slate-500" },
  login_failed:   { label: "Başarısız Giriş",      className: "bg-rose-50 text-rose-600" },
};

const SECTION_LABELS: Record<string, string> = {
  brand:        "Genel Ayarlar",
  seo:          "SEO",
  hero:         "Hero",
  about:        "Hakkımızda",
  services:     "Hizmetler",
  pricing:      "Fiyatlar",
  campaigns:    "Kampanyalar",
  stats:        "İstatistikler",
  testimonials: "Yorumlar",
  contact:      "İletişim",
  navigation:   "Navigasyon",
  footer:       "Footer",
};

export const AuditLogSection = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/audit-logs?limit=100");
      const data = await res.json();
      if (data.success) {
        setLogs(data.data);
      } else {
        setError(data.message ?? "Loglar yüklenemedi.");
      }
    } catch {
      setError("Ağ hatası oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Geçmiş</h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Son 100 admin işlemi
          </p>
        </div>
        <button
          onClick={fetchLogs}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-100 text-sm font-bold text-slate-500 hover:text-slate-900 hover:border-slate-200 transition-colors disabled:opacity-50"
          aria-label="Logları yenile"
        >
          <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          Yenile
        </button>
      </div>

      {error && (
        <div className="px-5 py-4 rounded-2xl bg-rose-50 border border-rose-100 text-sm font-bold text-rose-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-16 text-slate-300 font-bold text-sm">
          Yükleniyor...
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 text-slate-300 font-bold">
          Henüz log kaydı yok.
        </div>
      ) : (
        <AdminCard>
          <div className="space-y-0 divide-y divide-slate-50">
            {logs.map((log) => {
              const action = ACTION_LABELS[log.action_type] ?? {
                label: log.action_type,
                className: "bg-slate-100 text-slate-500",
              };
              const sectionLabel =
                log.entity_id ? (SECTION_LABELS[log.entity_id] ?? log.entity_id) : null;

              return (
                <div key={log.id} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="shrink-0 pt-0.5">
                    <span
                      className={cn(
                        "inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                        action.className
                      )}
                    >
                      {action.label}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    {sectionLabel && (
                      <p className="text-sm font-bold text-slate-700">{sectionLabel}</p>
                    )}
                    {log.metadata && Object.keys(log.metadata).length > 0 && (
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {Object.entries(log.metadata)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(" · ")}
                      </p>
                    )}
                  </div>
                  <time
                    className="text-xs text-slate-300 font-medium shrink-0"
                    dateTime={log.created_at}
                  >
                    {new Date(log.created_at).toLocaleString("tr-TR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
              );
            })}
          </div>
        </AdminCard>
      )}
    </div>
  );
};
