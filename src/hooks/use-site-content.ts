"use client";

import { useState, useEffect, useCallback } from "react";
import { SiteContent } from "@/types";

/**
 * Global application state and content management hook
 * Implements best practices for data fetching and caching
 */
export function useSiteContent() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/content/get");
      const data = await res.json();
      if (data.success) {
        setContent(data.content);
      } else {
        setError(data.message || "İçerik yüklenemedi.");
      }
    } catch (err) {
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
        return { success: true };
      } else {
        return { 
          success: false, 
          message: data.message || "Güncelleme başarısız.",
          errors: data.errors 
        };
      }
    } catch (err) {
      return { success: false, message: "Ağ hatası oluştu." };
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      fetchContent();
    }
    return () => { isMounted = false; };
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
