import React from "react";
import { siteContent } from "@/data/siteContent";
import { Earth, Share2, Phone, Mail, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-ocean rounded-lg flex items-center justify-center text-white font-bold">
              C
            </div>
            <span className="font-bold text-xl text-white">{siteContent.brand.name}</span>
          </div>
          <p className="text-sm leading-relaxed">
            {siteContent.footer.about}
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-ocean hover:text-white transition-all">
              <Earth size={20} />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary-ocean hover:text-white transition-all">
              <Share2 size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold mb-6">Hızlı Menü</h4>
          <ul className="space-y-4">
            {siteContent.navigation.map((item) => (
              <li key={item.label}>
                <a href={item.href} className="text-sm hover:text-primary-ocean transition-colors">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white font-bold mb-6">İletişim</h4>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-sm">
              <MapPin size={18} className="text-primary-ocean shrink-0" />
              <span>{siteContent.contact.address}, {siteContent.contact.district}/{siteContent.contact.city}</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Phone size={18} className="text-primary-ocean shrink-0" />
              <span>{siteContent.contact.phone}</span>
            </li>
            <li className="flex items-center gap-3 text-sm">
              <Mail size={18} className="text-primary-ocean shrink-0" />
              <span>{siteContent.contact.email}</span>
            </li>
          </ul>
        </div>

        {/* Map Placeholder or Working Hours */}
        <div>
          <h4 className="text-white font-bold mb-6">Çalışma Saatleri</h4>
          <p className="text-sm italic mb-4">Pazar günü kapalıyız.</p>
          <div className="bg-slate-800 p-4 rounded-xl border border-white/5">
            <p className="text-white font-medium text-sm mb-1">Mesai Saatleri:</p>
            <p className="text-xs">{siteContent.contact.workingHours}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs">{siteContent.footer.copyright}</p>
        <div className="flex gap-6">
          {siteContent.footer.links.map((link) => (
            <a key={link.label} href={link.href} className="text-xs hover:text-white">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};
