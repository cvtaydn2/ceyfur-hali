"use client";

import { useState, useEffect, useCallback } from "react";
import { SiteContent } from "@/types";
import { ContentSection } from "@/lib/constants";
import { getAuthHeaders, clearAuthToken } from "@/lib/auth-token";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContentFetchResult {
  content: SiteContent | null;
  isFromFallback: boolean;
  fallbackReason?: string;
}

// ─── Cache ────────────────────────────────────────────────────────────────────

const CACHE_KEY = "site_content_cache";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 dakika

interface CacheEntry {
  data: SiteContent;
  timestamp: number;
  isFromFallback: boolean;
  updatedAt?: string;
}

function readCache(): CacheEntry | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_DURATION_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

function writeCache(data: SiteContent, isFromFallback: boolean, updatedAt?: string): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry = { data, timestamp: Date.now(), isFromFallback, updatedAt };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage dolu veya erişilemez
  }
}

function clearCache(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // sessizce geç
  }
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromFallback, setIsFromFallback] = useState(false);
  const [fallbackReason, setFallbackReason] = useState<string | undefined>();
  const [updatedAt, setUpdatedAt] = useState<string | undefined>();

  const fetchContent = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh) {
      const cached = readCache();
      if (cached) {
        setContent(cached.data);
        setIsFromFallback(cached.isFromFallback);
        setUpdatedAt(cached.updatedAt);
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/content/get", {
        credentials: "include",
        headers: getAuthHeaders(),
      });

      // 401 → token yok veya süresi dolmuş, login'e yönlendir
      if (res.status === 401) {
        clearAuthToken();
        setError("Oturum süresi dolmuş. Yeniden giriş yapılıyor...");
        setIsLoading(false);
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return;
      }

      const data = await res.json();

      if (data.success) {
        setContent(data.content);
        setIsFromFallback(data.isFromFallback ?? false);
        setFallbackReason(data.fallbackReason);
        setUpdatedAt(data.updatedAt);
        writeCache(data.content, data.isFromFallback ?? false, data.updatedAt);
      } else {
        setError(data.message || "İçerik yüklenemedi.");
      }
    } catch (err) {
      console.error("[use-site-content] Fetch hatası:", err);
      setError("Sunucu hatası oluştu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Tüm içeriği kaydeder (full update).
   */
  const save = async (
    newContent: SiteContent
  ): Promise<{ success: boolean; message?: string }> => {
    setIsSaving(true);
    clearCache();

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        credentials: "include",
        body: JSON.stringify(newContent),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setContent(newContent);
        setIsFromFallback(false);
        return { success: true };
      }

      return { success: false, message: data.message || "Güncelleme başarısız." };
    } catch (err) {
      console.error("[use-site-content] Save hatası:", err);
      return { success: false, message: "Ağ hatası oluştu." };
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Belirli bir bölümü kaydeder (partial update).
   * Sadece ilgili bölüm API'ye gönderilir.
   */
  const saveSection = async <K extends ContentSection>(
    section: K,
    sectionData: SiteContent[K]
  ): Promise<{ success: boolean; message?: string }> => {
    setIsSaving(true);
    clearCache();

    try {
      const res = await fetch(`/api/admin/content/${section}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        credentials: "include",
        body: JSON.stringify(sectionData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Local state'i güncelle
        setContent((prev) => (prev ? { ...prev, [section]: sectionData } : prev));
        setIsFromFallback(false);
        return { success: true, message: data.message };
      }

      return { success: false, message: data.message || "Güncelleme başarısız." };
    } catch (err) {
      console.error(`[use-site-content] saveSection(${section}) hatası:`, err);
      return { success: false, message: "Ağ hatası oluştu." };
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    setContent,
    isLoading,
    isSaving,
    error,
    isFromFallback,
    fallbackReason,
    updatedAt,
    refresh: () => fetchContent(true),
    save,
    saveSection,
  };
}
