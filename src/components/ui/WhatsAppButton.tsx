"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { siteContent } from "@/data/siteContent";
import { motion } from "framer-motion";

export const WhatsAppButton = () => {
  return (
    <motion.a
      href={`https://wa.me/${siteContent.contact.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 z-[60] w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl transition-shadow hover:shadow-[0_0_20px_rgba(37,211,102,0.5)] group"
      aria-label="WhatsApp ile İletişime Geç"
    >
      <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:hidden" />
      <MessageCircle size={32} />
    </motion.a>
  );
};
