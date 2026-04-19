"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Hard redirect — cookie'nin kesinlikle gönderilmesini sağlar
        window.location.href = "/admin";
      } else {
        setError(data.message || "Giriş başarısız.");
      }
    } catch (err) {
      setError("Bağlantı hatası oluştu.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-dark p-10 rounded-[2.5rem] border-white/10 shadow-2xl text-center"
      >
        <div className="w-16 h-16 bg-primary-ocean/20 rounded-2xl flex items-center justify-center text-primary-ocean mx-auto mb-6">
          <Lock size={32} />
        </div>
        
        <h1 className="text-2xl font-black text-white mb-2">Panel Girişi</h1>
        <p className="text-slate-400 text-sm mb-8">Devam etmek için yönetici parolasını giriniz.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            placeholder="Yönetici Parolası"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary-ocean outline-none transition-all text-center tracking-widest disabled:opacity-50"
          />
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary-ocean text-white rounded-2xl font-bold hover:bg-primary-ocean/90 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Giriş Yap
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-6 flex items-center gap-2 text-rose-400 text-xs font-medium justify-center bg-rose-400/10 py-3 rounded-xl border border-rose-400/20">
            <ShieldAlert size={14} />
            {error}
          </div>
        )}
      </motion.div>
    </div>
  );
}
