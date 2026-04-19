"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ContentSection } from "@/lib/constants";

// ─── AdminCard ────────────────────────────────────────────────────────────────

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const AdminCard = ({ children, className, title, subtitle }: AdminCardProps) => (
  <div
    className={cn(
      "bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden",
      className
    )}
  >
    {(title || subtitle) && (
      <div className="px-6 py-5 md:px-10 md:py-8 border-b border-slate-50">
        {title && (
          <h3 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-xs md:text-sm font-medium text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
    )}
    <div className="p-6 md:p-10">{children}</div>
  </div>
);

// ─── AdminInputGroup ──────────────────────────────────────────────────────────

interface AdminInputGroupProps {
  label: string;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
  className?: string;
}

export const AdminInputGroup = ({
  label,
  error,
  helperText,
  children,
  className,
}: AdminInputGroupProps) => (
  <div className={cn("space-y-2", className)}>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1 flex justify-between">
      {label}
      {error && (
        <span className="text-rose-500 lowercase tracking-normal font-bold">{error}</span>
      )}
    </label>
    {children}
    {helperText && !error && (
      <p className="text-[10px] font-bold text-slate-300 ml-1 italic">{helperText}</p>
    )}
  </div>
);

// ─── AdminNav ─────────────────────────────────────────────────────────────────

interface AdminNavProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  tabs: { id: string; label: string; icon: React.ElementType }[];
  dirtySections?: Set<ContentSection>;
  tabSectionMap?: Partial<Record<string, ContentSection>>;
}

export const AdminNav = ({
  activeTab,
  onTabChange,
  tabs,
  dirtySections,
  tabSectionMap,
}: AdminNavProps) => (
  <nav
    className="flex lg:flex-col gap-1 p-2 bg-white rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm overflow-x-auto lg:overflow-x-visible snap-x"
    aria-label="Admin navigasyon"
  >
    {tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      const section = tabSectionMap?.[tab.id];
      const isDirty = section ? dirtySections?.has(section) : false;

      return (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 md:gap-3 px-4 py-3 rounded-xl md:rounded-2xl font-bold text-xs md:text-sm transition-all whitespace-nowrap snap-start shrink-0 relative",
            isActive
              ? "bg-primary-ocean/5 text-primary-ocean border border-primary-ocean/10"
              : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
          )}
          aria-current={isActive ? "page" : undefined}
        >
          <Icon
            size={16}
            className={cn(
              "transition-colors shrink-0",
              isActive ? "text-primary-ocean" : "text-slate-300"
            )}
          />
          <span className="flex-1 text-left">{tab.label}</span>
          {isDirty && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"
              aria-label="Kaydedilmemiş değişiklik"
            />
          )}
        </button>
      );
    })}
  </nav>
);

// ─── AdminTextarea ────────────────────────────────────────────────────────────

interface AdminTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  minHeight?: string;
}

export const AdminTextarea = ({
  className,
  minHeight = "min-h-[100px]",
  ...props
}: AdminTextareaProps) => (
  <textarea
    className={cn(
      "w-full px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100",
      "outline-none focus:bg-white focus:border-primary-ocean focus:ring-4 focus:ring-primary-ocean/5",
      "transition-all font-bold text-slate-900 resize-y",
      minHeight,
      className
    )}
    {...props}
  />
);
