"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In this simple setup, we set a cookie that the middleware checks.
    // In a real app, this would be an API call to verify and set a secure HttpOnly cookie.
    document.cookie = `admin_auth=${secret}; path=/; max-age=86400; SameSite=Lax`;
    
    // Check if it worked by trying to go to admin
    router.push("/admin");
    router.refresh();
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
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:border-primary-ocean outline-none transition-all text-center tracking-widest"
          />
          
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-4 bg-primary-ocean text-white rounded-2xl font-bold hover:bg-primary-ocean/90 transition-all group"
          >
            Giriş Yap
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {error && (
          <div className="mt-6 flex items-center gap-2 text-rose-400 text-xs font-medium justify-center">
            <ShieldAlert size={14} />
            Hatalı parola, tekrar deneyiniz.
          </div>
        )}
      </motion.div>
    </div>
  );
}
