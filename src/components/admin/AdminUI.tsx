"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Admin Card Container
 */
export const AdminCard = ({ children, className, title, subtitle }: { 
  children: React.ReactNode; 
  className?: string;
  title?: string;
  subtitle?: string;
}) => (
  <div className={cn("bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden", className)}>
    {(title || subtitle) && (
      <div className="px-10 py-8 border-b border-slate-50">
        {title && <h3 className="text-xl font-black text-slate-900 tracking-tight">{title}</h3>}
        {subtitle && <p className="text-sm font-medium text-slate-400 mt-1">{subtitle}</p>}
      </div>
    )}
    <div className="p-10">{children}</div>
  </div>
);

/**
 * Admin Form Group with Label and Helper
 */
export const AdminInputGroup = ({ 
  label, 
  error, 
  helperText, 
  children, 
  className 
}: { 
  label: string; 
  error?: string; 
  helperText?: string; 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-2", className)}>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex justify-between">
      {label}
      {error && <span className="text-rose-500 lowercase tracking-normal">{error}</span>}
    </label>
    {children}
    {helperText && !error && <p className="text-[10px] font-bold text-slate-300 ml-1 italic">{helperText}</p>}
  </div>
);

/**
 * Modern Admin Sidebar Navigation
 */
export const AdminNav = ({ 
  activeTab, 
  onTabChange, 
  tabs 
}: { 
  activeTab: string; 
  onTabChange: (id: string) => void; 
  tabs: { id: string; label: string; icon: React.ElementType }[] 
}) => (
  <nav className="flex lg:flex-col gap-2 p-2 bg-slate-50/50 rounded-[2rem] border border-slate-100/50 overflow-x-auto lg:overflow-x-visible">
    {tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all whitespace-nowrap",
            isActive 
              ? "bg-white text-primary-ocean shadow-lg shadow-primary-ocean/5 border border-primary-ocean/10" 
              : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
          )}
        >
          <Icon size={18} className={cn("transition-colors", isActive ? "text-primary-ocean" : "text-slate-300")} />
          {tab.label}
        </button>
      );
    })}
  </nav>
);
