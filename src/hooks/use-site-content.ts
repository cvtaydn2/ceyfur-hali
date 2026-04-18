"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { SiteContent } from "@/types";

const CACHE_KEY = "site_content_cache";
const CACHE_DURATION = 5 * 60 * 1000;

interface CacheEntry {
  data: SiteContent;
  timestamp: number;
}

function getFromCache(): SiteContent | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const entry: CacheEntry = JSON.parse(cached);
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

function setToCache(data: SiteContent): void {
  if (typeof window === "undefined") return;
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {}
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initialized = useRef(false);

  const fetchContent = useCallback(async () => {
    if (!initialized.current) {
      const cached = getFromCache();
      if (cached) {
        setContent(cached);
        setIsLoading(false);
        initialized.current = true;
        return;
      }
      initialized.current = true;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/content/get");
      const data = await res.json();
      if (data.success) {
        setContent(data.content);
        setToCache(data.content);
      } else {
        setError(data.message || "İçerik yüklenemedi.");
      }
    } catch (err) {
      console.error("Content fetch error:", err);
      setError("Sunucu hatası oluştu.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveContent = async (newContent: SiteContent) => {
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newContent),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setContent(newContent);
        setToCache(newContent);
        return { success: true };
      } else {
        return { 
          success: false, 
          message: data.message || "Güncelleme başarısız.",
          errors: data.errors 
        };
      }
    } catch (err) {
      console.error("Content save error:", err);
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
    refresh: fetchContent,
    save: saveContent
  };
}