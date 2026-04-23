"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { SiteContent } from "@/types";
import { siteContent as fallbackContent } from "@/data/siteContent";

export const WhatsAppButton = ({ content }: { content?: SiteContent }) => {
  const data = content || fallbackContent;

  return (
    <a
      href={`https://wa.me/${data.contact.whatsapp.replace(/\s+/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ile İletişime Geç"
      className="fixed bottom-6 right-6 z-[60] w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-transform duration-200 will-change-transform"
    >
      {/* Ping halkası — CSS only, JS reflow yok */}
      <span
        className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"
        aria-hidden="true"
      />
      <MessageCircle size={32} />
    </a>
  );
};
