"use client";

import { useState, useEffect, useCallback } from "react";
import { SiteContent } from "@/types";

const CACHE_KEY = "site_content_cache";
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 dakika

interface CacheEntry {
  data: SiteContent;
  timestamp: number;
}

function readCache(): SiteContent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_DURATION_MS) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function writeCache(data: SiteContent): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage dolu veya erişilemez — sessizce geç
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

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async (forceRefresh = false) => {
    // Cache kontrolü (force refresh değilse)
    if (!forceRefresh) {
      const cached = readCache();
      if (cached) {
        setContent(cached);
        setIsLoading(false);
        return;
      }
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/content/get");
      const data = await res.json();
      if (data.success) {
        setContent(data.content);
        writeCache(data.content);
      } else {
        setError(data.message || "İçerik yüklenemedi.");
      }
    } catch (err) {
      console.error("İçerik fetch hatası:", err);
      setError("Sunucu hatası oluştu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveContent = async (
    newContent: SiteContent
  ): Promise<{ success: boolean; message?: string }> => {
    setIsSaving(true);
    clearCache();
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setContent(newContent);
        return { success: true };
      }

      return {
        success: false,
        message: data.message || "Güncelleme başarısız.",
      };
    } catch (err) {
      console.error("İçerik kaydetme hatası:", err);
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
    refresh: () => fetchContent(true),
    save: saveContent,
  };
}
