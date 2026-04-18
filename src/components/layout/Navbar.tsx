"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";
import { cn } from "@/lib/utils";

export const Navbar = ({ content }: { content?: SiteContent }) => {
  const data = content || fallbackContent;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-4",
        isScrolled ? "pt-2" : "pt-6"
      )}
    >
      <div
        className={cn(
          "max-w-7xl mx-auto rounded-full transition-all duration-300 flex items-center justify-between px-6 py-3",
          isScrolled ? "glass shadow-lg" : "bg-transparent"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-ocean rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-primary-ocean/10">
            {data.brand.name.charAt(0)}
          </div>
          <span className={cn(
            "font-bold text-xl tracking-tight hidden sm:block",
            isScrolled ? "text-slate-900" : "text-slate-900"
          )}>
            {data.brand.name.split(' ')[0]}
            <span className="text-primary-ocean ml-1">{data.brand.name.split(' ').slice(1).join(' ')}</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {data.navigation.map((item : any) => (
            <li key={item.label}>
              <a
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-primary-ocean transition-colors"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="flex items-center gap-4">
          <a
            href={`tel:${data.contact.phone.replace(/\s/g, "")}`}
            className="hidden lg:flex items-center gap-2 text-primary-ocean font-semibold"
            aria-label="Bizi arayın"
          >
            <Phone size={18} />
            <span className="text-sm">{data.contact.phone}</span>
          </a>
          <a
            href={`https://wa.me/${data.contact.whatsapp}?text=${encodeURIComponent("Merhaba, halı yıkama hizmetiniz için teklif almak istiyorum.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary-ocean text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-primary-ocean/20 hover:scale-105 transition-transform active:scale-95"
          >
            Teklif Al
          </a>
          
          <button 
            className="md:hidden text-slate-900 p-1"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Menüyü Kapat" : "Menüyü Aç"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 glass rounded-3xl p-6 shadow-2xl md:hidden"
          >
            <div className="flex flex-col gap-4">
              {data.navigation.map((item : any) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-semibold text-slate-800 hover:text-primary-ocean"
                >
                  {item.label}
                </a>
              ))}
              <hr className="border-slate-200" />
              <div className="flex flex-col gap-2">
                 <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Bizi Arayın</p>
                 <a href={`tel:${data.contact.phone.replace(/\s/g, "")}`} className="text-xl font-bold text-primary-ocean">
                   {data.contact.phone}
                 </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
