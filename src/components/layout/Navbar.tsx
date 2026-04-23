"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

export const Navbar = ({ content }: { content?: SiteContent }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const data = content || fallbackContent;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled 
          ? "py-4 px-4 md:px-8" 
          : "py-6 px-4 md:px-12"
      )}
    >
      <div 
        className={cn(
          "max-w-7xl mx-auto rounded-[2rem] transition-all duration-500 border border-transparent",
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl shadow-2xl shadow-primary-ocean/5 border-white/20 py-3 px-4 sm:px-6 md:px-8 lg:w-[95%]" 
            : "bg-transparent py-3 md:py-4 px-0"
        )}
      >
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary-ocean rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-primary-ocean/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              {data.brand.name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <span className={cn(
                "font-black text-lg sm:text-xl tracking-tighter leading-none transition-colors",
                isScrolled ? "text-slate-900" : "text-slate-900"
              )}>
                {data.brand.name.split(' ')[0]}
                <span className="text-primary-ocean ml-1">{data.brand.name.split(' ')[1]}</span>
              </span>
              <span className="text-[8px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">
                {data.brand.slogan.split(' ')[0]} {data.brand.slogan.split(' ')[1]}
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-10">
            {data.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-bold tracking-tight hover:text-primary-ocean transition-all relative group",
                  isScrolled ? "text-slate-600" : "text-slate-800"
                )}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-ocean transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

           <div className="flex items-center gap-4">
             <div className="hidden md:flex flex-col items-end mr-4 text-right">
               <span className="text-[10px] font-black text-primary-ocean uppercase tracking-widest mb-0.5">Müşteri Destek</span>
               {data.contact.phone.map((num) => (
                 <a key={num} href={`tel:${num.replace(/\s/g, "")}`} className="text-base font-black text-primary-ocean hover:text-slate-900 transition-colors flex items-center gap-1.5 drop-shadow-sm">
                   <Phone size={14} className="text-primary-ocean" />
                   {num}
                 </a>
               ))}
             </div>
             
<a
               target="_blank"
               rel="noopener noreferrer"
               href={`https://wa.me/${data.contact.whatsapp.replace(/\s+/g, '')}?text=Bilgi almak istiyorum.`}
               className={cn(
                "px-4 py-2 md:px-6 md:py-3 rounded-2xl font-black text-xs md:text-sm transition-all shadow-xl hover:-translate-y-1 active:scale-95",
                isScrolled 
                  ? "bg-primary-ocean text-white shadow-primary-ocean/20 hover:bg-slate-900" 
                  : "bg-slate-900 text-white shadow-slate-900/10 hover:bg-primary-ocean"
              )}
            >
              Teklif Al
            </a>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 md:p-2 text-slate-900"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:hidden absolute top-full left-4 right-4 mt-4 glass p-8 rounded-[2.5rem] shadow-2xl border-white"
        >
          <div className="flex flex-col gap-6">
            {data.navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-bold text-slate-900 hover:text-primary-ocean transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <hr className="border-slate-100" />
            <a
              href={`tel:${data.contact.phone[0].replace(/\s/g, "")}`}
              className="flex items-center gap-3 text-slate-900 font-bold"
            >
              <Phone size={20} className="text-primary-ocean" />
              {data.contact.phone[0]}
            </a>
          </div>
        </motion.div>
      )}
    </nav>
  );
};
