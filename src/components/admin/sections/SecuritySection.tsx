"use client";

import React, { useState, useEffect } from "react";
import { AdminCard, AdminInputGroup } from "../AdminUI";
import { Input, Button } from "@/components/ui";
import { ShieldCheck, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

export const SecuritySection = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings/password")
      .then((r) => r.json())
      .then((d) => { if (d.success) setLastUpdated(d.lastUpdated); })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      toast.error("Şifre en az 8 karakter olmalıdır.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Şifreler eşleşmiyor.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/settings/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Şifre güncellendi. Bir sonraki girişte yeni şifrenizi kullanın.");
        setNewPassword("");
        setConfirmPassword("");
        setLastUpdated(new Date().toISOString());
      } else {
        toast.error(data.message ?? "Şifre güncellenemedi.");
      }
    } catch {
      toast.error("Ağ hatası oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Güvenlik</h1>
        <p className="text-sm text-slate-400 font-medium mt-1">
          Admin panel erişim şifresi yönetimi
        </p>
      </div>

      <AdminCard
        title="Şifre Değiştir"
        subtitle="Yeni şifre en az 8 karakter olmalıdır."
      >
        <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100">
            <ShieldCheck size={16} className="text-slate-400 shrink-0" />
            <div className="text-xs text-slate-500 font-medium">
              {lastUpdated
                ? `Son güncelleme: ${new Date(lastUpdated).toLocaleString("tr-TR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}`
                : "Şifre henüz DB'de kayıtlı değil — .env ADMIN_SECRET kullanılıyor"}
            </div>
          </div>

          <AdminInputGroup
            label="Yeni Şifre"
            helperText="En az 8 karakter"
          >
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </AdminInputGroup>

          <AdminInputGroup label="Yeni Şifre (Tekrar)">
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </AdminInputGroup>

          <Button
            type="submit"
            variant="secondary"
            isLoading={isSaving}
            leftIcon={<KeyRound size={16} />}
          >
            Şifreyi Güncelle
          </Button>
        </form>
      </AdminCard>
    </div>
  );
};
